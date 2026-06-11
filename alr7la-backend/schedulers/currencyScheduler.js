const cron = require('node-cron');
const currencyApiService = require('../services/currencyApiService');
const { Currencies } = require('../models');

// This function updates currencies in the database
async function updateCurrenciesInDatabase() {
  try {
    const result = await currencyApiService.getExchangeCurrencies();
    const rates = result.data.conversion_rates;

    for (const code in rates) {
      const exchange_rate = rates[code];

      await Currencies.upsert({
        code,
        name: code, // You can replace this with actual names if available
        exchange_rate,
      });
    }
  } catch (error) {
    console.error('Failed to update currency rates:', error.message);
  }
}

// Schedule every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled currency update...');
  updateCurrenciesInDatabase();
});
