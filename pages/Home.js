import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Inputs from "../Components/Inputs";
import TempAndDetails from "../Components/TempAndDetails";
import TimeAndLocation from "../Components/TimeAndLocation";
import getFormattedWeatherData from "../services/weatherService";

const Home = () => {
  const [query, setQuery] = useState({ q: "Bengaluru" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getWeather = async () => {
    setLoading(true);
    try {
      const data = await getFormattedWeatherData({ ...query, units });
      if (data && data.temp) {
        setWeather(data);
      } else {
        console.error("Invalid data received from the API");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-cyan-500 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Main Container */}
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Search Bar */}
        <div className="bg-white/20 p-3 sm:p-4 rounded-lg shadow-md">
          <Inputs setQuery={setQuery} setUnits={setUnits} />
        </div>

        {/* Weather Information */}
        {weather ? (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* City & Time */}
            <div className="bg-white/10 p-4 sm:p-6 rounded-lg shadow-md">
              <TimeAndLocation weather={weather} />
            </div>

            {/* Temperature & Details */}
            <div className="bg-white/10 p-4 sm:p-6 rounded-lg shadow-md">
              <TempAndDetails weather={weather} units={units} />
            </div>

            {/* View 7-Day Forecast Button */}
            <button
              onClick={() =>
                navigate("/details", { state: { hourly: weather.hourly } })
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              View 7-Day Forecast
            </button>
          </div>
        ) : (
          <div className="text-white text-base sm:text-lg font-medium text-center p-4">
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Fetching weather data...</span>
              </div>
            ) : (
              "No weather data available"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
