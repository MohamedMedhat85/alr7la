const { findUserById } = require('../services/user.service');
const { serializeUser } = require('../serializers/user.serializer');
const { Preferences, Labels } = require('../models');

const profileController = {
    // getMyProfile function
    async getMyProfile(req, res) {
        try {
            const userId = req.params.userId;
            const user = await findUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(serializeUser(user));
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error while fetching profile' });
        }
    },
    // 
    async getUserIdAndProfilePicture(req, res) {
        try {
            const userId = parseInt(req.user.id);
            const user = await findUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({
                user_id: user.id,
                profile_picture: user.profile_picture
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error while fetching profile' });
        }
    },

    async editProfile(req, res) {
        try {
            const userId = parseInt(req.user.id);
            console.log("1111x1x1x1x1", req.user)
            const { name, bio, birth_date, country_id, marital_status, preferences } = req.body;

            // Find the user
            const user = await findUserById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Update only the fields that are provided
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (bio !== undefined) updateData.bio = bio;
            if (birth_date !== undefined) updateData.birth_date = birth_date;
            if (country_id !== undefined) updateData.country_id = country_id;
            if (marital_status !== undefined) updateData.marital_status = marital_status;

            // Update the user
            await user.update(updateData);

            // Handle preferences if provided
            if (preferences != undefined) {
                // Get current preferences
                const currentPreferences = await Preferences.findAll({
                    where: { user_id: userId },
                    attributes: ['label_id']
                });
                const currentLabelIds = currentPreferences.map(p => p.label_id);

                // Find labels to add (in new preferences but not in current)
                const labelsToAdd = preferences.filter(labelId => !currentLabelIds.includes(labelId));

                // Find labels to remove (in current but not in new preferences)
                const labelsToRemove = currentLabelIds.filter(labelId => !preferences.includes(labelId));

                // Add new preferences
                if (labelsToAdd.length > 0) {
                    await Preferences.bulkCreate(
                        labelsToAdd.map(labelId => ({
                            user_id: userId,
                            label_id: labelId
                        }))
                    );
                }

                // Remove old preferences
                if (labelsToRemove.length > 0) {
                    await Preferences.destroy({
                        where: {
                            user_id: userId,
                            label_id: labelsToRemove
                        }
                    });
                }
            }

            // Get the updated user data
            const updatedUser = await findUserById(userId);

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: serializeUser(updatedUser)
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }
};

module.exports = profileController;