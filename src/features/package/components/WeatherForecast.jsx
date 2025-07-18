import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  Wind,
  Droplets,
  Eye,
  Thermometer,
} from "lucide-react";
import axios from "axios";

const WeatherForecast = ({ lat, lon, cityName = "Ubicación Actual" }) => {
  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const groupForecastByDay = useCallback((list) => {
    const dailyData = {};

    list.forEach((reading) => {
      const date = new Date(reading.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: date,
          temps: [],
          weathers: [],
          timestamps: [],
          humidity: [],
          windSpeed: [],
          pressure: [],
        };
      }

      dailyData[dayKey].temps.push(reading.main.temp);
      dailyData[dayKey].weathers.push(reading.weather[0]);
      dailyData[dayKey].timestamps.push(reading.dt);
      dailyData[dayKey].humidity.push(reading.main.humidity);
      dailyData[dayKey].windSpeed.push(reading.wind?.speed || 0);
      dailyData[dayKey].pressure.push(reading.main.pressure);
    });

    return Object.values(dailyData).map((day) => {
      const noonIndex = day.timestamps.findIndex(
        (ts) => new Date(ts * 1000).getHours() >= 11,
      );

      return {
        date: day.date,
        day: day.date.toLocaleDateString("es-MX", { weekday: "short" }),
        dayNumber: day.date.getDate(),
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        avgTemp: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
        weather:
          noonIndex >= 0
            ? day.weathers[noonIndex]
            : day.weathers[Math.floor(day.weathers.length / 2)],
        humidity: Math.round(
          day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length,
        ),
        windSpeed: Math.round(
          day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length,
        ),
        pressure: Math.round(
          day.pressure.reduce((a, b) => a + b, 0) / day.pressure.length,
        ),
      };
    });
  }, []);

  const fetchWeather = useCallback(
    async (isRefresh = false) => {
      if (!lat || !lon) return;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

        const [forecastResponse, currentWeatherResponse] = await Promise.all([
          axios.get(forecastUrl),
          axios.get(currentUrl),
        ]);

        const processedForecast = groupForecastByDay(
          forecastResponse.data.list,
        );
        setForecast(processedForecast.slice(0, 5));
        setCurrentWeather(currentWeatherResponse.data);
        setLastUpdate(new Date());
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Error al cargar el pronóstico. Verifica la API key y la conexión.",
        );
        console.error("Weather API error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [lat, lon, groupForecastByDay],
  );

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleRefresh = () => {
    fetchWeather(true);
  };

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500 w-6 h-6" />
          <h3 className="text-xl font-bold text-gray-800">
            Pronóstico del Clima
          </h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchWeather()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white ">
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <p className="text-xs text-gray-500">
              Actualizado:{" "}
              {lastUpdate.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-4xl text-blue-500 mb-4" />
          <p className="text-gray-600">Cargando pronóstico del tiempo...</p>
        </div>
      ) : (
        <>
          {currentWeather && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-800">
                    {Math.round(currentWeather.main.temp)}°C
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 capitalize">
                      {currentWeather.weather[0].description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sensación térmica:{" "}
                      {Math.round(currentWeather.main.feels_like)}°C
                    </p>
                  </div>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                  alt={currentWeather.weather[0].description}
                  className="w-20 h-20"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {currentWeather.main.humidity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {Math.round(currentWeather.wind.speed)} m/s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {Math.round(currentWeather.visibility / 1000)} km
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentWeather.main.pressure} hPa
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {forecast.map((day, index) => (
              <DayForecast
                key={`${day.date.toISOString()}-${index}`}
                day={day}
                isToday={index === 0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const DayForecast = ({ day, isToday }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer
        ${
          isToday
            ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg"
            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        }
        ${isExpanded ? "scale-105 z-10" : "hover:scale-102"}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="text-center mb-3">
          <p
            className={`font-bold text-sm ${isToday ? "text-white" : "text-gray-800"}`}
          >
            {isToday ? "Hoy" : day.day}
          </p>
          <p
            className={`text-xs ${isToday ? "text-blue-100" : "text-gray-500"}`}
          >
            {day.dayNumber}
          </p>
        </div>

        <div className="flex justify-center mb-3">
          <img
            src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
            alt={day.weather.description}
            className="w-12 h-12"
            loading="lazy"
          />
        </div>

        <p
          className={`text-xs text-center capitalize mb-3 ${isToday ? "text-blue-100" : "text-gray-600"}`}
        >
          {day.weather.description}
        </p>

        <div className="flex justify-center space-x-3 mb-2">
          <div className="text-center">
            <span
              className={`block text-xs ${isToday ? "text-blue-100" : "text-gray-500"}`}
            >
              Máx
            </span>
            <span
              className={`font-bold text-sm ${isToday ? "text-white" : "text-red-500"}`}
            >
              {Math.round(day.maxTemp)}°
            </span>
          </div>

          <div className="text-center">
            <span
              className={`block text-xs ${isToday ? "text-blue-100" : "text-gray-500"}`}
            >
              Mín
            </span>
            <span
              className={`font-bold text-sm ${isToday ? "text-blue-100" : "text-blue-500"}`}
            >
              {Math.round(day.minTemp)}°
            </span>
          </div>
        </div>

        {isExpanded && (
          <div
            className={`mt-3 pt-3 border-t ${isToday ? "border-blue-400" : "border-gray-200"} animate-in slide-in-from-top-2 duration-300`}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{day.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;
