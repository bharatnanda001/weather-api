import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, Eye, Gauge } from 'lucide-react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // You can set your API key here or use environment variables
  const API_KEY = '5235f2d1ec06905b87eeec4cc35c463f'; // Replace with your actual API key

  const getWeatherIcon = (condition, temp) => {
    const iconProps = { size: 64, className: "text-blue-400" };
    
    if (condition.includes('rain')) return <CloudRain {...iconProps} className="text-blue-500" />;
    if (condition.includes('snow')) return <CloudSnow {...iconProps} className="text-gray-300" />;
    if (condition.includes('cloud')) return <Cloud {...iconProps} className="text-gray-400" />;
    if (temp > 25) return <Sun {...iconProps} className="text-yellow-400" />;
    return <Sun {...iconProps} className="text-orange-400" />;
  };

  const fetchWeather = async () => {
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      setError('Please set your OpenWeather API key in the code');
      return;
    }
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeather API key.');
        } else if (response.status === 404) {
          throw new Error('City not found. Please check the city name.');
        } else {
          throw new Error('Failed to fetch weather data');
        }
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchWeather();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
            <Cloud className="text-blue-300" />
            Weather App
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                City Name
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name (e.g., London, New York, Delhi)"
                className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm text-lg"
                onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              />
            </div>

            <button
              onClick={fetchWeather}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg text-lg"
            >
              {loading ? 'Getting Weather...' : 'Get Weather'}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {weather && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {weather.name}, {weather.sys.country}
                </h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {getWeatherIcon(weather.weather[0].description.toLowerCase(), weather.main.temp)}
                  <div>
                    <div className="text-4xl font-bold text-white">
                      {Math.round(weather.main.temp)}°C
                    </div>
                    <div className="text-white/80 capitalize">
                      {weather.weather[0].description}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Thermometer className="text-red-400 mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Feels Like</div>
                  <div className="text-white font-semibold">
                    {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Droplets className="text-blue-400 mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Humidity</div>
                  <div className="text-white font-semibold">
                    {weather.main.humidity}%
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Wind className="text-gray-300 mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Wind Speed</div>
                  <div className="text-white font-semibold">
                    {weather.wind.speed} m/s
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Gauge className="text-yellow-400 mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Pressure</div>
                  <div className="text-white font-semibold">
                    {weather.main.pressure} hPa
                  </div>
                </div>
              </div>

              {weather.visibility && (
                <div className="mt-4 bg-white/10 rounded-xl p-4 text-center">
                  <Eye className="text-purple-400 mx-auto mb-2" size={24} />
                  <div className="text-white/80 text-sm">Visibility</div>
                  <div className="text-white font-semibold">
                    {(weather.visibility / 1000).toFixed(1)} km
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Powered by OpenWeatherMap API • Set your API key in the code
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
