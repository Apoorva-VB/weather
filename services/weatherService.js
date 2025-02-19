import { DateTime } from "luxon";

const API_KEY = "c0caf632f47afc9153b66ddeb5c89f79";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(`${BASE_URL}/${infoType}`);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  return fetch(url).then((res) => res.json());
};

const iconUrlFromCode = (code) =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;

// Corrected timezone handling
const formatToLocalTime = (timestamp, timezoneOffset) => {
  return DateTime.fromSeconds(timestamp)
    .setZone(`UTC`)
    .plus({ seconds: timezoneOffset })
    .toFormat("cccc, dd LLL yyyy' | Local time: 'hh:mm a");
};

const formatSpecificTime = (timestamp, timezoneOffset, format) => {
  return DateTime.fromSeconds(timestamp)
    .setZone(`UTC`)
    .plus({ seconds: timezoneOffset })
    .toFormat(format);
};

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone, // OpenWeatherMap provides timezone offset in SECONDS
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise: formatSpecificTime(sunrise, timezone, "hh:mm a"),
    sunset: formatSpecificTime(sunset, timezone, "hh:mm a"),
    speed,
    details,
    icon: iconUrlFromCode(icon),
    timezone,
    formattedLocalTime: formatToLocalTime(dt, timezone),
  };
};

const formatForecastWeather = (currentData, forecastList) => {
  const { dt, timezone } = currentData;

  const hourly = forecastList
    .filter((f) => f.dt > dt)
    .map((f) => ({
      title: formatSpecificTime(f.dt, timezone, "hh:mm a"),
      temp: f.main.temp,
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }))
    .slice(0, 5);

  const daily = forecastList
    .filter((f) => f.dt_txt.includes("00:00:00"))
    .map((f) => ({
      title: formatSpecificTime(f.dt, timezone, "ccc"),
      temp: f.main.temp,
      icon: iconUrlFromCode(f.weather[0].icon),
      date: f.dt_txt,
    }));

  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrent);

  const { lat, lon } = formattedCurrentWeather;

  const forecastData = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  });

  const formattedForecastWeather = formatForecastWeather(
    formattedCurrentWeather,
    forecastData.list
  );

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

export default getFormattedWeatherData;
