const { getWeatherByCity } = require('../services/weatherApiService');
const getPackingList = require('../services/packinglist');
const { getTrip } = require('../services/tripPlannerApiService');
const { sequelize, Sequelize } = require('../models');
const { Countries, Currencies, ElectricalStandards, EmergencyNumbers, Trips, Places, TripsPlaces, UserTrips, PlacesImages, PackingLists, PackingSections, PackingItems } = sequelize.models;
const { fn, col, where, Op } = Sequelize;
const { createPackingList } = require('./packingList.controller');

module.exports = {
  async createTrip(req, res) {
    let transaction;


    try {
      transaction = await sequelize.transaction();
      console.log("bodyyyyyyyy trippppppppp", req.body);
      const {
        tripDescription,
        startTime,
        endTime,
        tripStatus = 'planned',
        tripStyle,
        tripPace,
        places = [],
        destinationCity,
        destinationCountry,
        packingList,
      } = req.body;

      // Validate required fields
      if (!tripDescription || !startTime || !endTime || !places.length) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: tripDescription, startTime, endTime, places'
        });
      }

      // Get the current user ID
      const userId = req.user.id;

      // Create the trip
      const trip = await Trips.create({
        trip_description: tripDescription,
        start_time: startTime,
        end_time: endTime,
        trip_status: tripStatus,
        trip_style: tripStyle,
        trip_pace: tripPace,
        city: destinationCity,
        country: destinationCountry
      }, { transaction });

      // Associate the trip with the user
      console.log('Creating user-trip association:', { user_id: userId, trip_id: trip.id });
      await UserTrips.create({
        user_id: userId,
        trip_id: trip.id
      }, { transaction });
      console.log('User-trip association created successfully');

      // Save the packing list if provided
      if (packingList) {
        try {
          await createPackingList({ userId, tripId: trip.id, packingList, transaction });
        } catch (err) {
          console.error('Error creating packing list during trip creation:', err);
          // Optionally, you could rollback the trip creation or just log the error
        }
      }

      // Handle packing list in the 3 tables

      // Associate places with the trip including notes, time, and day
      const tripPlacesData = places.map(place => ({
        trip_id: trip.id,
        place_id: place.id,
        notes: place.notes,
        time: place.time,
        day: place.day
      }));

      await TripsPlaces.bulkCreate(tripPlacesData, { transaction });

      await transaction.commit();

      // Fetch the created trip with its associated places
      const createdTrip = await Trips.findOne({
        where: { id: trip.id },
        include: [{
          model: Places,
          through: {
            model: TripsPlaces,
            as: 'AdditionalInfo',
            attributes: ['notes', 'time', 'day']
          },
          attributes: ['id', 'name', 'longitude', 'latitude', 'city', 'country', 'country_id']
        }]
      });

      return res.status(200).json({
        success: true,
        message: 'Trip created successfully',
        data: {
          tripDetails: {
            id: createdTrip.id,
            description: createdTrip.trip_description,
            startTime: createdTrip.start_time,
            endTime: createdTrip.end_time,
            status: createdTrip.trip_status,
            style: createdTrip.trip_style,
            pace: createdTrip.trip_pace
          },
          places: createdTrip.Places.map(place => ({
            id: place.id,
            name: place.name,
            location: {
              longitude: place.longitude,
              latitude: place.latitude,
              city: place.city,
              country: place.country,
              countryId: place.country_id
            },
            schedule: {
              notes: place.AdditionalInfo.notes,
              time: place.AdditionalInfo.time,
              day: place.AdditionalInfo.day
            }
          }))
        }
      });

    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error('Error creating trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create trip',
        error: error.message
      });
    }
  },

  async getTrip(req, res) {
    try {
      const tripId = req.params.id;

      const trip = await Trips.findOne({
        where: { id: tripId },
        include: [{
          model: Places,
          through: {
            model: TripsPlaces,
            as: 'AdditionalInfo',
            attributes: ['notes', 'time', 'day']
          },
          attributes: ['id', 'name', 'longitude', 'latitude', 'city', 'country', 'country_id'],
          include: [{
            model: PlacesImages,
            attributes: ['img_url']
          }]
        }]
      });

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      // Fetch packing list data
      let packingListData = null;
      try {
        const packingList = await PackingLists.findOne({
          where: { trip_id: tripId },
          include: [{
            model: PackingSections,
            include: [{
              model: PackingItems,
              attributes: ['name', 'quantity', 'is_packed']
            }],
            order: [['order', 'ASC']]
          }]
        });

        if (packingList) {
          // Transform packing list data to match the expected format
          packingListData = packingList.PackingSections.reduce((acc, section) => {
            acc[section.name] = section.PackingItems.reduce((items, item) => {
              items[item.name] = item.quantity;
              return items;
            }, {});
            return acc;
          }, {});
        }
      } catch (error) {
        console.error('Error fetching packing list:', error);
        // Continue without packing list if there's an error
      }

      // Calculate duration in days
      const startDate = new Date(trip.start_time);
      const endDate = new Date(trip.end_time);
      const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Get the first place to determine destination
      const firstPlace = trip.Places[0];
      const destinationCity = firstPlace?.city || "Unknown";
      const destinationCountry = firstPlace?.country || "Unknown";

      // Group places by day
      const placesByDay = trip.Places.reduce((acc, place) => {
        const day = place.AdditionalInfo.day || 1; // Default to day 1 if not specified
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push({
          id: place.id,
          time: place.AdditionalInfo.time || "Not specified",
          time_window: getTimeWindow(place.AdditionalInfo.time),
          place: place.name,
          description: place.AdditionalInfo.notes || `Visit ${place.name} in ${place.city}`,
          duration: "2 hours", // Default duration
          notes: place.AdditionalInfo.notes || "Plan your visit in advance",
          place_label: "Attraction", // Default label
          parent_label: "Tourism", // Default parent label
          latitude: place.latitude,
          longitude: place.longitude,
          image_url: place.PlacesImages[0]?.img_url || null
        });
        return acc;
      }, {});

      // Convert to array format
      const itinerary = Object.keys(placesByDay).map(day => ({
        day: parseInt(day),
        activities: placesByDay[day]
      })).sort((a, b) => a.day - b.day);

      // Create a trip plan structure that matches getTravelInfo response
      const tripPlan = {
        trip_name: trip.trip_description,
        destination: `${destinationCity}, ${destinationCountry}`,
        duration_days: durationDays,
        trip_style: trip.trip_style || "Adventure",
        pace: trip.trip_pace || "Moderate",
        traveler_preferences: [], // Default empty array
        itinerary: itinerary,
        estimated_costs: {
          currency: "USD",
          accommodation: "$100-200",
          meals: "$50-100",
          transportation: "$30-80",
          activities: "$20-100",
          total_estimate: "$200-480"
        },
        travel_tips: [
          "Book accommodations in advance",
          "Check local weather conditions",
          "Have local currency ready",
          "Keep important documents safe"
        ]
      };

      // Get weather data for the destination
      let destinationWeather = { error: 'Weather data unavailable' };
      try {
        destinationWeather = await getWeatherByCity(destinationCity);
      } catch (error) {
        console.error('Error fetching destination weather:', error);
      }

      // Format the response to match getTravelInfo structure
      const formattedResponse = {
        success: true,
        data: {
          destination: {
            country: destinationCountry,
            city: destinationCity,
            weather: destinationWeather
          },
          tripDetails: {
            days: durationDays,
            preferences: []
          },
          tripPlan: {
            data: tripPlan
          },
          packingList: packingListData
        }
      };

      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error('Error fetching trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch trip',
        error: error.message
      });
    }
  },

  async updateTrip(req, res) {
    let transaction;

    try {
      const tripId = req.params.id;
      transaction = await sequelize.transaction();

      const {
        tripDescription,
        startTime,
        endTime,
        tripStatus,
        tripStyle,
        tripPace,
        places = []
      } = req.body;

      // Check if trip exists
      const existingTrip = await Trips.findByPk(tripId);
      if (!existingTrip) {
        return res.status(404).json({
          success: false,
          message: 'Trip not found'
        });
      }

      // Update trip details
      await existingTrip.update({
        trip_description: tripDescription,
        start_time: startTime,
        end_time: endTime,
        trip_status: tripStatus,
        trip_style: tripStyle,
        trip_pace: tripPace
      }, { transaction });

      // Remove existing place associations
      await TripsPlaces.destroy({
        where: { trip_id: tripId },
        transaction
      });

      // Create new place associations with notes, time, and day
      const tripPlacesData = places.map(place => ({
        trip_id: tripId,
        place_id: place.id,
        notes: place.notes,
        time: place.time,
        day: place.day
      }));

      await TripsPlaces.bulkCreate(tripPlacesData, { transaction });

      await transaction.commit();

      // Fetch the updated trip
      const updatedTrip = await Trips.findOne({
        where: { id: tripId },
        include: [{
          model: Places,
          through: {
            model: TripsPlaces,
            as: 'AdditionalInfo',
            attributes: ['notes', 'time', 'day']
          },
          attributes: ['id', 'name', 'longitude', 'latitude', 'city', 'country', 'country_id']
        }]
      });

      return res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: {
          tripDetails: {
            id: updatedTrip.id,
            description: updatedTrip.trip_description,
            startTime: updatedTrip.start_time,
            endTime: updatedTrip.end_time,
            status: updatedTrip.trip_status,
            style: updatedTrip.trip_style,
            pace: updatedTrip.trip_pace
          },
          places: updatedTrip.Places.map(place => ({
            id: place.id,
            name: place.name,
            location: {
              longitude: place.longitude,
              latitude: place.latitude,
              city: place.city,
              country: place.country,
              countryId: place.country_id
            },
            schedule: {
              notes: place.AdditionalInfo.notes,
              time: place.AdditionalInfo.time,
              day: place.AdditionalInfo.day
            }
          }))
        }
      });

    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error('Error updating trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update trip',
        error: error.message
      });
    }
  },

  async getTravelInfo(req, res) {
    console.log('Received request for travel information:', req.body);
    try {
      const {
        sourceCountry,
        sourceCity,
        destinationCountry,
        destinationCity,
        days,
        style,
        pace,
        tripPreferences = []
      } = req.body;

      if (!sourceCountry || !sourceCity || !destinationCountry || !destinationCity || !days) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: sourceCountry, sourceCity, destinationCountry, destinationCity, days'
        });
      }

      const numberOfDays = parseInt(days, 10);
      if (isNaN(numberOfDays) || numberOfDays <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Days must be a positive number'
        });
      }

      const destCountryData = await Countries.findOne({
        where: where(fn('LOWER', col('name')), {
          [Op.like]: `%${destinationCountry.toLowerCase()}%`
        }),
        include: [
          {
            model: Currencies,
          },
          {
            model: ElectricalStandards
          },
          // {
          //   model: EmergencyNumbers
          // }
        ]
      });

      console.log('Destination country data:', destCountryData);

      if (!destCountryData) {
        return res.status(404).json({
          success: false,
          message: `Destination country "${destinationCountry}" not found in our database`
        });
      }

      const sourceCountryData = await Countries.findOne({
        where: where(fn('LOWER', col('name')), {
          [Op.like]: `%${sourceCountry.toLowerCase()}%`
        }),
        include: [
          {
            model: Currencies,
          }
        ]
      });

      console.log('Source country data:', sourceCountryData);

      if (!sourceCountryData) {
        return res.status(404).json({
          success: false,
          message: `Source country "${sourceCountry}" not found in our database`
        });
      }

      let destinationWeather;
      try {
        destinationWeather = await getWeatherByCity(destinationCity);
      } catch (error) {
        console.error('Error fetching destination weather:', error);
        destinationWeather = { error: 'Weather data unavailable' };
      }
      let tripPlan;
      try {
        tripPlan = await getTrip(
          destinationCity,
          numberOfDays,
          tripPreferences,
          style,
          pace
        );

        console.log('Trip details:', tripPlan);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to retrieve trip details',
          error: error.message
        });
      }

      let visaInfo = null; // Removed visa API call

      const sourceCurrency = sourceCountryData.Currencies && sourceCountryData.Currencies[0];
      const destCurrency = destCountryData.Currencies && destCountryData.Currencies[0];

      let currencyInfo = null; // Removed currency calculation

      const electricalInfo = null; // Removed electrical info

      const emergencyInfo = destCountryData.EmergencyNumbers?.[0] || null;

      let packingList = null;
      if (destinationWeather && destinationWeather.data) {
        const weather = destinationWeather.data;
        const maxTemp = weather.main?.temp_max || 20;
        const minTemp = weather.main?.temp_min || 15;

        packingList = getPackingList(numberOfDays, maxTemp, minTemp, tripPreferences);
      }

      const travelInfo = {
        destination: {
          country: destinationCountry,
          city: destinationCity,
          weather: destinationWeather
        },
        tripDetails: {
          days: numberOfDays,
          preferences: tripPreferences
        },
        tripPlan: tripPlan,
        visaRequirements: visaInfo,
        currencyInfo,
        electricalInfo,
        // emergencyInfo: emergencyInfo ? {
        //   police: emergencyInfo.police,
        //   ambulance: emergencyInfo.ambulance,
        //   fire: emergencyInfo.fire,
        //   notes: emergencyInfo.notes
        // } : null,
        packingList
      };

      return res.status(200).json({
        success: true,
        data: travelInfo
      });
    } catch (error) {
      console.error('Error processing travel info request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve travel information',
        error: error.message
      });
    }
  },

  // Get all trips for a specific user
  async getUserTrips(req, res) {
    try {
      const userId = req.params.userId;

      const userTrips = await UserTrips.findAll({
        where: { user_id: userId },
        include: [{
          model: Trips,
          attributes: ['id', 'trip_description', 'start_time', 'end_time', 'trip_status', 'trip_style', 'trip_pace', 'city', 'country'],
        }]
      });

      if (!userTrips || userTrips.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No trips found for this user'
        });
      }

      return res.status(200).json({
        success: true,
        userTrips
      });

    } catch (error) {
      console.error('Error fetching user trips:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user trips',
        error: error.message
      });
    }
  },

  // Delete a user trip
  async deleteUserTrip(req, res) {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;
      const userTrip = await UserTrips.findOne({
        where: {
          trip_id: tripId,
          user_id: userId
        }
      });

      if (!userTrip) {
        return res.status(404).json({
          success: false,
          message: 'User trip not found'
        });
      }

      await userTrip.destroy();

      return res.status(200).json({
        success: true,
        message: 'User trip was deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting user trip:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user trip',
        error: error.message
      });
    }
  }
};

/**
 * Helper function to determine time window
 */
function getTimeWindow(time) {
  if (!time) return "not specified";

  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
