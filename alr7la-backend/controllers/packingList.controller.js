const { sequelize, Sequelize } = require('../models');
const { PackingLists, PackingSections, PackingItems, Trips } = sequelize.models;
const { getPackingList, generatePackingListForTrip } = require('../services/packinglist');

async function createPackingList({ userId, tripId, packingList, transaction }) {
  let localTransaction = transaction;
  let createdLocally = false;
  try {
    if (!localTransaction) {
      localTransaction = await sequelize.transaction();
      createdLocally = true;
    }
    // Create base packing list record
    const packingListRecord = await PackingLists.create({
      user_id: userId,
      trip_id: tripId
    }, { transaction: localTransaction });

    console.log("Pakcing List record", packingListRecord);
    // Prepare all sections and items for bulk creation
    const sectionsToCreate = [];
    const itemsToCreate = [];

    Object.entries(packingList).forEach(([sectionName, items], sectionIndex) => {
      sectionsToCreate.push({
        packing_list_id: packingListRecord.id,
        name: sectionName,
        order: sectionIndex
      });

      Object.entries(items).forEach(([itemName, quantity], itemIndex) => {
        itemsToCreate.push({
          name: itemName,
          quantity,
          order: itemIndex,
          is_packed: 0
        });
      });
    });

    // Bulk create sections
    const createdSections = await PackingSections.bulkCreate(sectionsToCreate, {
      transaction: localTransaction,
      returning: true
    });

    // Map items to their respective sections
    let currentItemIndex = 0;
    const mappedItems = createdSections.flatMap(section => {
      const sectionItems = Object.keys(packingList[section.name]).map(() => {
        const item = itemsToCreate[currentItemIndex];
        currentItemIndex++;
        return {
          ...item,
          section_id: section.id
        };
      });
      return sectionItems;
    });

    // Bulk create all items at once
    await PackingItems.bulkCreate(mappedItems, { transaction: localTransaction });

    if (createdLocally) {
      await localTransaction.commit();
    }

    return { success: true, packingListId: packingListRecord.id };
  } catch (error) {
    if (createdLocally && localTransaction) await localTransaction.rollback();
    throw error;
  }
}

// Express endpoint handler for API usage
async function createPackingListEndpoint(req, res) {
  try {
    const { userId, tripId } = req.params;
    const { packingList } = req.body;
    if (!packingList) {
      return res.status(400).json({
        success: false,
        message: 'Packing list data is required in the request body.'
      });
    }
    const result = await createPackingList({ userId, tripId, packingList });
    return res.status(201).json({
      success: true,
      message: 'Packing list created successfully',
      data: { id: result.packingListId }
    });
  } catch (error) {
    console.error('Error creating packing list:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create packing list',
      error: error.message
    });
  }
}

module.exports = {
  createPackingList,
  createPackingListEndpoint,

  // Get a packing list
  async getPackingList(req, res) {
    try {
      const { userId, tripId } = req.params;

      const packingList = await PackingLists.findOne({
        where: { user_id: userId, trip_id: tripId },
        include: [{
          model: PackingSections,
          separate: true, // Use separate queries for better performance
          order: [['order', 'ASC']],
          include: [{
            model: PackingItems,
            separate: true, // Use separate queries for better performance
            order: [['order', 'ASC']]
          }]
        }]
      });

      if (!packingList) {
        return res.status(404).json({
          success: false,
          message: 'Packing list not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: packingList
      });

    } catch (error) {
      console.error('Error fetching packing list:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch packing list',
        error: error.message
      });
    }
  },

  // Update a packing list
  async updatePackingList(req, res) {
    let transaction;
    try {
      console.log('updatePackingList called with:', { params: req.params, body: req.body });

      transaction = await sequelize.transaction();
      const { userId, tripId } = req.params;
      const { sections } = req.body;

      // Validate that sections is an array
      if (!sections || !Array.isArray(sections)) {
        console.error('Invalid sections data:', sections);
        return res.status(400).json({
          success: false,
          message: 'Sections must be an array',
          error: 'sections.map is not a function'
        });
      }

      console.log('Looking for packing list with:', { userId, tripId });

      let packingList = await PackingLists.findOne({
        where: { user_id: userId, trip_id: tripId },
        attributes: ['id']
      });

      console.log('Found packing list:', packingList);

      // If packing list doesn't exist, create it
      if (!packingList) {
        console.log('Creating new packing list');
        packingList = await PackingLists.create({
          user_id: userId,
          trip_id: tripId
        }, { transaction });
        console.log('Created packing list:', packingList);
      }

      console.log('Processing sections:', sections);

      // First delete all items
      await PackingItems.destroy({
        where: {
          section_id: {
            [Sequelize.Op.in]: Sequelize.literal(
              `(SELECT id FROM packing_sections WHERE packing_list_id = ${packingList.id})`
            )
          }
        },
        transaction
      });

      // Then delete all sections
      await PackingSections.destroy({
        where: { packing_list_id: packingList.id },
        transaction
      });

      // Create new sections and items
      const createdSections = await PackingSections.bulkCreate(
        sections.map(section => ({
          packing_list_id: packingList.id,
          name: section.name,
          order: section.order
        })),
        { transaction, returning: true }
      );

      console.log('Created sections:', createdSections);

      // Prepare items for bulk creation
      const itemsToCreate = createdSections.flatMap((section, index) => {
        const sectionItems = sections[index].items || [];
        return sectionItems.map(item => ({
          section_id: section.id,
          name: item.name,
          quantity: item.quantity,
          is_packed: item.is_packed || 0,
          order: item.order
        }));
      });

      console.log('Items to create:', itemsToCreate);

      // Bulk create all items at once if there are any
      if (itemsToCreate.length > 0) {
        await PackingItems.bulkCreate(itemsToCreate, { transaction });
      }

      await transaction.commit();
      console.log('Transaction committed successfully');

      return res.status(200).json({
        success: true,
        message: 'Packing list updated successfully',
        data: { id: packingList.id }
      });

    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error updating packing list:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update packing list',
        error: error.message
      });
    }
  },

  // Delete a packing list
  async deletePackingList(req, res) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const { userId, tripId } = req.params;

      const packingList = await PackingLists.findOne({
        where: { user_id: userId, trip_id: tripId },
        attributes: ['id']
      });

      if (!packingList) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Packing list not found'
        });
      }

      // First delete all items
      await PackingItems.destroy({
        where: {
          section_id: {
            [Sequelize.Op.in]: Sequelize.literal(
              `(SELECT id FROM packing_sections WHERE packing_list_id = ${packingList.id})`
            )
          }
        },
        transaction
      });

      // Then delete all sections
      await PackingSections.destroy({
        where: { packing_list_id: packingList.id },
        transaction
      });

      // Finally delete the packing list
      await PackingLists.destroy({
        where: { id: packingList.id },
        transaction
      });

      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: 'Packing list deleted successfully'
      });

    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error deleting packing list:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete packing list',
        error: error.message
      });
    }
  }
}; 