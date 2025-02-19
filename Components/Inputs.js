import React, { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = ({ setQuery, setUnits }) => {
  const [city, setCity] = useState("");

  const handleSearchClick = () => {
    if (city !== "") setQuery({ q: city });
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="flex-1 relative">
        <input
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          type="text"
          placeholder="Search by city..."
          className="w-full px-4 py-3 text-gray-700 bg-white/90 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all shadow-lg text-lg placeholder:text-gray-400"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors text-gray-700 hover:text-white"
          >
            <BiSearch size={24} />
          </button>
          <button
            onClick={handleLocationClick}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors text-gray-700 hover:text-white"
          >
            <BiCurrentLocation size={24} />
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-2 md:border-l md:border-white/20 md:pl-4">
        <button
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-blue-500 text-white transition-colors text-lg"
          onClick={() => setUnits("metric")}
        >
          °C
        </button>
        <span className="text-white/60 text-xl flex items-center">|</span>
        <button
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-blue-500 text-white transition-colors text-lg"
          onClick={() => setUnits("imperial")}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
