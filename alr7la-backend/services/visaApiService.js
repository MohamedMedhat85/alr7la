const axios = require('axios');

const Visa_API_URL = 'https://rough-sun-2523.fly.dev/visa';

async function getVisaRequirments(destination,source) {
  try {
    const response = await axios.get(`${Visa_API_URL}/${destination}/${source}`);


    const data = response.data;

    return {
        data
    };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`Visa API error: ${errMsg}`);
    throw new Error(`Unable to fetch Visa data for "${destination}"`);
  }
}

module.exports = {
  getVisaRequirments,
};