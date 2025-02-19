import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Forecast from "../Components/Forecast";
import getFormattedWeatherData from "../services/weatherService";

const Details = () => {
  const location = useLocation();
  const [query, setQuery] = useState({ q: "Bengaluru" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  const hourlyData = location.state?.hourly || []; // Receive hourly data

  const getWeather = async () => {
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      if (data && data.temp) {
        setWeather(data);
      } else {
        console.error("Invalid data received from the API");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-700">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>←</span> Back to Home
          </button>
          <h1 className="text-white text-2xl font-medium hidden md:block">
            7-Day Weather Forecast
          </h1>
        </div>

        {/* Hourly Forecast */}
        {hourlyData.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl mb-6">
            <h2 className="text-white text-xl font-medium mb-4">
              Hourly Forecast
            </h2>
            <Forecast title="Hourly Forecast" data={hourlyData} />
          </div>
        )}

        {/* 7-Day Forecast */}
        {weather && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-white text-xl font-medium mb-6 md:hidden">
              7-Day Weather Forecast
            </h2>
            <div className="mb-4">
              <p className="text-white/80 text-lg">{`${weather.name}, ${weather.country}`}</p>
            </div>
            <Forecast title="7-Day Forecast" data={weather.daily} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
