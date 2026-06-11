// controllers/uploadController.js
const { Users } = require('../models');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

module.exports = {

    async getProfilePicture(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({ error: 'No user ID provided' });
            }
            const userId = req.user.id;
            const user = await Users.findByPk(userId);
            if (!user || !user.profile_picture) {
                return res.status(404).json({ error: 'Profile Picture not found' });
            }
            // Generate a signed URL with expiration (e.g., 1 hour = 3600 seconds)
            const signedUrl = cloudinary.url(user.profile_picture, {
                type: 'authenticated',
                sign_url: true,
                expires_at: Math.floor(Date.now() / 1000) + 20,
            });
            // Fetch the image data from Cloudinary via the signed URL
            const response = await axios.get(signedUrl, { responseType: 'stream' });
            // Set appropriate headers for image
            res.setHeader('Content-Type', response.headers['content-type']);
            // Pipe the image stream to the response directly
            response.data.pipe(res);
        }
        catch (error) {
            console.error('Error fetching Profile Picture:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch Profile Picture',
                error: error.message,
            });
        }
    },

    // upload a Profile Picture
    async uploadProfilePicture(req, res) {
        try {
            console.log('Upload Profile Picture - Request body:', req.body);
            console.log('Upload Profile Picture - Request file:', req.file);
            console.log('Upload Profile Picture - Request headers:', req.headers);
            
            if (!req.file) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No file uploaded' 
                });
            }
            if (!req.user || !req.user.id) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No user ID provided' 
                });
            }

            const userId = req.user.id;
            const user = await Users.findByPk(userId);
            console.log(req.file.filename, req.file.public_id);
            // Store the public_id (Cloudinary's unique ID for the file)
            user.profile_picture = req.file.path;
            await user.save();

            res.json({
                success: true,
                message: 'Profile picture uploaded successfully',
                data: {
                    profile_picture: user.profile_picture
                }
            });

        } catch (error) {
            console.error('Error uploading Profile Picture:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload Profile Picture',
                error: error.message,
            });
        }
    },
    async uploadWallpaper(req, res) {
        try {
            
            if (!req.file) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No file uploaded' 
                });
            }
            if (!req.user.id) {
                return res.status(400).json({ 
                    success: false,
                    message: 'No user ID provided' 
                });
            }
            const userId = req.user.id;
            const user = await Users.findByPk(userId);
            console.log('req.file:', req.file.path);
            user.wallpaper = req.file.path;
            await user.save();
            res.json({
                success: true,
                message: 'Wallpaper uploaded successfully',
                data: {
                    wallpaper: user.wallpaper
                }
            });
        }
        catch (error) {
            console.error('Error uploading wallpaper:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload wallpaper',
                error: error.message
            });
        }
    },
    async deleteProfilePicture(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({ success: false, message: 'No user ID provided' });
            }
            const userId = req.user.id;
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            console.log('Before delete:', user.profile_picture);
            user.profile_picture = null;
            await user.save();
            console.log('After delete:', user.profile_picture);
            res.json({ success: true, message: 'Profile picture deleted successfully', user });
        } catch (error) {
            console.error('Error deleting Profile Picture:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete Profile Picture', error: error.message });
        }
    },
    async deleteWallpaper(req, res) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({ success: false, message: 'No user ID provided' });
            }
            const userId = req.user.id;
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            console.log('Before delete:', user.wallpaper);
            user.wallpaper = null;
            await user.save();
            console.log('After delete:', user.wallpaper);
            res.json({ success: true, message: 'Wallpaper deleted successfully', user });
        } catch (error) {
            console.error('Error deleting wallpaper:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete wallpaper', error: error.message });
        }
    }

};