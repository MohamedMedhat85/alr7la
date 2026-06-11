const axios = require('axios');

const Trip_planner_URL = 'https://ragapi-production-38b4.up.railway.app/generate-itinerary';

async function getTrip(destination,duration_days,traveler_preferences,trip_style,pace) {
  try {
    body ={
      "destination": destination,
      "duration_days": duration_days,
      "traveler_preferences": traveler_preferences,
      "trip_style": trip_style,
      "pace": pace
    }
    console.log("body", body);
    const response = await axios.post(`${Trip_planner_URL}`,body);


    const data = response.data;

    return {
        data
    };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`Travel API error: ${errMsg}`);
    throw new Error(`Unable to fetch Travel data for "${destination}"`);
  }
}

module.exports = {
  getTrip,
};