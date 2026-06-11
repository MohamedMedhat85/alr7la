const axios = require('axios');

const Exhange_Rate_API_Link = 'https://v6.exchangerate-api.com/v6';
const API_KEY = process.env.API_KEY || '1a290b3033b63fc9bd62e9ad'; // Store your key in .env

async function getExchangeCurrencies() {
  try {
    const response = await axios.get(`${Exhange_Rate_API_Link}/${API_KEY}/latest/USD` )
    const data = response.data;
    console.log(data);
    return {
      data  
    };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`Currency API error: ${errMsg}`);
    throw new Error(`Unable to fetch Currency data `);
  }
}

module.exports = {
  getExchangeCurrencies,
};
