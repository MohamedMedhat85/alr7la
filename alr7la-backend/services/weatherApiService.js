const axios = require('axios');

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY || '6a83ae65a97785db9c392709c8d26b62'; // Store your key in .env

async function getWeatherByCity(city) {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // optional: for Celsius
      },
    });

    const data = response.data;

    return {
        data
    //   city: data.name,
    //   temperature: data.main.temp,
    //   humidity: data.main.humidity,
    //   weather: data.weather[0].description,
    //   icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    };
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error(`Weather API error: ${errMsg}`);
    throw new Error(`Unable to fetch weather data for "${city}"`);
  }
}

module.exports = {
  getWeatherByCity,
};
