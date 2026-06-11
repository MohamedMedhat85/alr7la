const express = require('express');
const router = express.Router();
const { getVisaRequirments } = require('../services/visaApiService');

// Route: /visa/:source/:destination
router.get('/:source/:destination', async (req, res) => {
  const { source, destination } = req.params;

  try {
    const visa = await getVisaRequirments(source,destination);
    res.json(visa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
