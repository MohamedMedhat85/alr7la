// Weather/Weather.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  WbSunny, 
  Cloud, 
  Opacity, 
  AcUnit, 
  Thunderstorm,
  Air
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { weatherService } from '../../../services/networkService';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// More accurate weather condition mapping based on OpenWeatherMap API
const WEATHER_CONDITIONS = {
  // Clear conditions
  'Clear': 'sunny',
  
  // Cloud conditions
  'Clouds': 'cloudy',
  'Cloudy': 'cloudy',
  'Overcast': 'cloudy',
  'Partly cloudy': 'cloudy',
  
  // Rain conditions
  'Rain': 'rainy',
  'Drizzle': 'rainy',
  'Light rain': 'rainy',
  'Moderate rain': 'rainy',
  'Heavy rain': 'rainy',
  'Shower rain': 'rainy',
  
  // Snow conditions
  'Snow': 'snowy',
  'Light snow': 'snowy',
  'Heavy snow': 'snowy',
  'Sleet': 'snowy',
  
  // Thunderstorm conditions
  'Thunderstorm': 'thunderstorm',
  'Thunderstorm with light rain': 'thunderstorm',
  'Thunderstorm with rain': 'thunderstorm',
  'Thunderstorm with heavy rain': 'thunderstorm',
  
  // Atmospheric conditions
  'Mist': 'cloudy',
  'Fog': 'cloudy',
  'Haze': 'cloudy',
  'Smoke': 'cloudy',
  'Dust': 'cloudy',
  'Sand': 'cloudy',
  'Ash': 'cloudy',
  'Squall': 'windy',
  'Tornado': 'thunderstorm',
  
  // Additional OpenWeatherMap conditions
  'Atmosphere': 'cloudy',
  'Extreme': 'thunderstorm',
  'Additional': 'cloudy'
};

// Helper function to get weather icon with comprehensive debugging
const getWeatherIcon = (condition) => {
  console.log('=== WEATHER DEBUG ===');
  console.log('Raw condition from API:', condition);
  console.log('Condition type:', typeof condition);
  
  // Normalize the condition (remove extra spaces, capitalize first letter)
  const normalizedCondition = condition ? condition.trim().replace(/\s+/g, ' ') : '';
  console.log('Normalized condition:', normalizedCondition);
  
  const mappedCondition = WEATHER_CONDITIONS[normalizedCondition];
  console.log('Mapped condition:', mappedCondition);
  
  const finalCondition = mappedCondition || 'sunny';
  console.log('Final condition used:', finalCondition);
  console.log('=== END WEATHER DEBUG ===');
  
  return finalCondition;
};

// Function to generate seasonal data based on country climate
const generateSeasonalData = (country, currentTemp) => {
  const countryName = country?.name?.toLowerCase() || '';
  const latitude = parseFloat(country?.latitude) || 0;
  
  // Base seasonal data - will be adjusted based on climate
  let baseHighTemps = [10, 11, 15, 19, 23, 26, 29, 31, 27, 22, 17, 12];
  let baseLowTemps = [2, 3, 6, 10, 14, 18, 22, 24, 20, 15, 9, 4];
  
  // Adjust based on latitude and climate
  if (latitude > 50) {
    // Cold climate (Northern Europe, Canada, etc.)
    baseHighTemps = [2, 3, 8, 12, 17, 21, 24, 23, 18, 12, 7, 3];
    baseLowTemps = [-5, -4, 0, 4, 9, 13, 16, 15, 11, 6, 1, -3];
  } else if (latitude > 30) {
    // Temperate climate (USA, Southern Europe, etc.)
    baseHighTemps = [8, 10, 14, 18, 23, 27, 30, 29, 25, 19, 13, 9];
    baseLowTemps = [-2, 0, 4, 8, 13, 17, 20, 19, 15, 9, 4, 0];
  } else if (latitude > 0) {
    // Tropical/subtropical climate (Africa, South Asia, etc.)
    baseHighTemps = [25, 26, 28, 30, 32, 33, 32, 31, 30, 29, 27, 25];
    baseLowTemps = [15, 16, 18, 20, 22, 24, 25, 24, 23, 21, 18, 16];
  } else {
    // Southern hemisphere
    baseHighTemps = [25, 24, 22, 18, 15, 12, 11, 13, 16, 19, 22, 24];
    baseLowTemps = [15, 14, 12, 9, 6, 4, 3, 5, 7, 10, 12, 14];
  }
  
  // Adjust based on current temperature if available
  if (currentTemp !== null) {
    const tempDiff = currentTemp - baseHighTemps[new Date().getMonth()];
    baseHighTemps = baseHighTemps.map(temp => Math.round(temp + tempDiff * 0.3));
    baseLowTemps = baseLowTemps.map(temp => Math.round(temp + tempDiff * 0.3));
  }
  
  // Generate seasons based on climate
  let seasons = [];
  if (latitude > 50) {
    seasons = [
      { name: 'Spring', months: 'March to May', description: 'Melting snow, gradually warming temperatures' },
      { name: 'Summer', months: 'June to August', description: 'Mild to warm weather, long daylight hours' },
      { name: 'Fall', months: 'September to November', description: 'Cooling temperatures, colorful foliage' },
      { name: 'Winter', months: 'December to February', description: 'Cold weather, snow and ice' }
    ];
  } else if (latitude > 30) {
    seasons = [
      { name: 'Spring', months: 'March to May', description: 'Mild temperatures, blooming flowers' },
      { name: 'Summer', months: 'June to August', description: 'Warm to hot weather, outdoor activities' },
      { name: 'Fall', months: 'September to November', description: 'Cooling temperatures, harvest season' },
      { name: 'Winter', months: 'December to February', description: 'Cold weather, occasional snow' }
    ];
  } else if (latitude > 0) {
    seasons = [
      { name: 'Dry Season', months: 'November to April', description: 'Lower humidity, clear skies' },
      { name: 'Wet Season', months: 'May to October', description: 'Higher rainfall, lush vegetation' }
    ];
  } else {
    seasons = [
      { name: 'Summer', months: 'December to February', description: 'Warm weather, outdoor activities' },
      { name: 'Fall', months: 'March to May', description: 'Cooling temperatures, harvest season' },
      { name: 'Winter', months: 'June to August', description: 'Cool weather, occasional rain' },
      { name: 'Spring', months: 'September to November', description: 'Gradually warming, blooming flowers' }
    ];
  }
  
  return {
    highTemps: baseHighTemps,
    lowTemps: baseLowTemps,
    seasons: seasons
  };
};

// Temperature Chart Component
const TemperatureChart = ({ weatherData }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Average High (°C)',
        data: weatherData.highTemps,
        borderColor: '#ff7043',
        backgroundColor: 'rgba(255, 112, 67, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Average Low (°C)',
        data: weatherData.lowTemps,
        borderColor: '#42a5f5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (item) => {
            return `${item.dataset.label}: ${item.raw}°C`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ height: 250, p: 1, mt: 2 }}>
      <Line data={data} options={options} />
    </Box>
  );
};

// Main Weather Component
const Weather = ({ country = {} }) => {
  const countryName = country?.name || "This Country";
  const countryCapital = country?.capital || countryName;
  
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seasonalData, setSeasonalData] = useState(null);

  // Function to generate mock weather data
  const generateMockWeather = (city) => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'thunderstorm', 'windy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      condition: randomCondition,
      temperature: Math.floor(Math.random() * 30) + 5,
      humidity: 40 + Math.floor(Math.random() * 50),
      windSpeed: 5 + Math.floor(Math.random() * 20),
      description: `${randomCondition} weather in ${city}`
    };
  };

  // Function to fetch current weather from backend
  const fetchCurrentWeather = async (city) => {
    try {
      const response = await weatherService.getWeather(city);
      const data = response.data.data; // Backend returns { data: weatherData }
      
      console.log('Weather data received:', data); // Debug log
      console.log('Weather condition:', data.weather[0].main); // Debug log
      
      const weatherInfo = {
        condition: getWeatherIcon(data.weather[0].main),
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
      
      console.log('Processed weather info:', weatherInfo); // Debug log
      
      setCurrentWeather(weatherInfo);
      
      // Generate seasonal data based on current temperature and country
      const seasonal = generateSeasonalData(country, weatherInfo.temperature);
      setSeasonalData(seasonal);
      
    } catch (error) {
      console.error('Error fetching current weather:', error);
      setError('Unable to fetch current weather data');
      
      // Generate seasonal data even if current weather fails
      const seasonal = generateSeasonalData(country, null);
      setSeasonalData(seasonal);
    }
  };

  // Function to fetch 5-day forecast (using current weather for now)
  const fetchForecast = async (city) => {
    try {
      // For now, we'll use the current weather data
      // In the future, you could add a forecast endpoint to your backend
      const response = await weatherService.getWeather(city);
      const data = response.data.data;
      
      // Generate realistic forecast data based on current weather
      const forecastData = [];
      const currentCondition = data.weather[0].main;
      const currentTemp = data.main.temp;
      
      // Weather conditions that are likely to follow the current condition
      const weatherProgression = {
        'Clear': ['Clear', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Clouds': ['Clouds', 'Rain', 'Clouds', 'Clear', 'Clouds'],
        'Rain': ['Rain', 'Drizzle', 'Clouds', 'Clear', 'Clouds'],
        'Snow': ['Snow', 'Clouds', 'Snow', 'Clouds', 'Clear'],
        'Thunderstorm': ['Thunderstorm', 'Rain', 'Clouds', 'Clear', 'Clouds'],
        'Drizzle': ['Drizzle', 'Rain', 'Clouds', 'Clear', 'Clouds'],
        'Mist': ['Mist', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Fog': ['Fog', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Haze': ['Haze', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Smoke': ['Smoke', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Dust': ['Dust', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Sand': ['Sand', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Ash': ['Ash', 'Clouds', 'Clear', 'Clouds', 'Clear'],
        'Squall': ['Squall', 'Windy', 'Clouds', 'Clear', 'Clouds'],
        'Tornado': ['Tornado', 'Thunderstorm', 'Rain', 'Clouds', 'Clear']
      };
      
      // Get progression for current condition, or default to clear progression
      const progression = weatherProgression[currentCondition] || weatherProgression['Clear'];
      
      for (let i = 1; i <= 5; i++) {
        const tempVariation = (Math.random() - 0.5) * 8; // ±4°C variation
        const condition = progression[i - 1];
        
        forecastData.push({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          avgTemp: Math.round(currentTemp + tempVariation),
          condition: getWeatherIcon(condition)
        });
      }
      
      setForecast(forecastData);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // Don't set error for forecast as it's not critical
    }
  };

  // Fetch weather data when country changes
  useEffect(() => {
    if (countryCapital && countryCapital !== "This Country") {
      setLoading(true);
      setError(null);
      
      // Test weather API call to see data structure
      console.log('=== TESTING WEATHER API ===');
      weatherService.getWeather('London').then(response => {
        console.log('Test weather response:', response.data);
        console.log('Weather data structure:', response.data.data);
        console.log('Weather condition:', response.data.data.weather[0]);
      }).catch(error => {
        console.error('Test weather API error:', error);
      });
      
      // Fetch both current weather and forecast
      Promise.all([
        fetchCurrentWeather(countryCapital),
        fetchForecast(countryCapital)
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [countryCapital]);

  // Generate seasonal data if not available
  useEffect(() => {
    if (!seasonalData && country) {
      const seasonal = generateSeasonalData(country, null);
      setSeasonalData(seasonal);
    }
  }, [country, seasonalData]);
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Weather in {countryName}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Current Weather with Animation */}
          {currentWeather && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Current Weather</Typography>
              <WeatherAnimation condition={currentWeather.condition} />
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Temperature</Typography>
                  <Typography variant="h6">{currentWeather.temperature}°C</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Humidity</Typography>
                  <Typography variant="h6">{currentWeather.humidity}%</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Wind</Typography>
                  <Typography variant="h6">{currentWeather.windSpeed} km/h</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {currentWeather.description}
              </Typography>
            </Box>
          )}
          
          {/* 5-Day Forecast */}
          {forecast && forecast.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" gutterBottom>5-Day Forecast</Typography>
                <Grid container spacing={1}>
                  {forecast.map((day, index) => (
                    <Grid item xs={2.4} key={index}>
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: 'background.paper', 
                        borderRadius: 1, 
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {day.date}
                        </Typography>
                        <WeatherAnimation condition={day.condition} />
                        <Typography variant="body2" fontWeight="bold">
                          {day.avgTemp}°C
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Temperature Throughout the Year Chart */}
          {seasonalData && (
            <Box>
              <Typography variant="h6" gutterBottom>Temperature Throughout the Year</Typography>
              <TemperatureChart weatherData={seasonalData} />
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Seasons Information */}
          {seasonalData && (
            <Box>
              <Typography variant="h6" gutterBottom>Seasons in {countryName}</Typography>
              <Grid container spacing={1}>
                {seasonalData.seasons.map((season, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="bold">{season.name}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {season.months}
                      </Typography>
                      <Typography variant="body2">{season.description}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

// Weather Animation Component
const WeatherAnimation = ({ condition }) => {
  switch (condition) {
    case 'sunny':
      return <SunnyAnimation />;
    case 'cloudy':
      return <CloudyAnimation />;
    case 'rainy':
      return <RainyAnimation />;
    case 'snowy':
      return <SnowyAnimation />;
    case 'thunderstorm':
      return <ThunderstormAnimation />;
    case 'windy':
      return <WindyAnimation />;
    default:
      return <SunnyAnimation />;
  }
};

// Animation Components (unchanged)
const SunnyAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <WbSunny sx={{ 
      fontSize: 40, 
      color: '#FFD700',
      animation: 'pulse 2s infinite'
    }} />
    <style>
      {`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}
    </style>
  </Box>
);

const CloudyAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <Cloud sx={{ 
      fontSize: 40, 
      color: '#90A4AE',
      animation: 'float 3s ease-in-out infinite'
    }} />
    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}
    </style>
  </Box>
);

const RainyAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <Cloud sx={{ fontSize: 40, color: '#90A4AE' }} />
    <Opacity sx={{ 
      fontSize: 20, 
      color: '#42A5F5',
      position: 'absolute',
      top: 35,
      animation: 'rain 1s linear infinite'
    }} />
    <style>
      {`
        @keyframes rain {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
      `}
    </style>
  </Box>
);

const SnowyAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <Cloud sx={{ fontSize: 40, color: '#90A4AE' }} />
    <AcUnit sx={{ 
      fontSize: 20, 
      color: '#E3F2FD',
      position: 'absolute',
      top: 35,
      animation: 'snow 2s linear infinite'
    }} />
    <style>
      {`
        @keyframes snow {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px) rotate(360deg); opacity: 0; }
        }
      `}
    </style>
  </Box>
);

const ThunderstormAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <Cloud sx={{ fontSize: 40, color: '#90A4AE' }} />
    <Thunderstorm sx={{ 
      fontSize: 20, 
      color: '#FFD700',
      position: 'absolute',
      top: 35,
      animation: 'lightning 2s ease-in-out infinite'
    }} />
    <style>
      {`
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; }
          10%, 20% { opacity: 1; }
        }
      `}
    </style>
  </Box>
);

const WindyAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <Air sx={{ 
      fontSize: 40, 
      color: '#90A4AE',
      animation: 'wind 2s ease-in-out infinite'
    }} />
    <style>
      {`
        @keyframes wind {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(5px) rotate(5deg); }
        }
      `}
    </style>
  </Box>
);

const NightAnimation = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: 60,
    position: 'relative'
  }}>
    <WbSunny sx={{ 
      fontSize: 40, 
      color: '#FFD700',
      filter: 'brightness(0.3)',
      animation: 'night 4s ease-in-out infinite'
    }} />
    <style>
      {`
        @keyframes night {
          0%, 100% { filter: brightness(0.3); }
          50% { filter: brightness(1); }
        }
      `}
    </style>
  </Box>
);

export default Weather;