import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";

const WeatherForecast = ({ lat, lon }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para agrupar pronósticos por día
  const groupForecastByDay = useCallback((list) => {
    const dailyData = {};
    
    list.forEach(reading => {
      const date = new Date(reading.dt * 1000);
      const dayKey = date.toLocaleDateString("es-MX", { weekday: "short" });
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          day: dayKey,
          date: date.getDate(),
          temps: [],
          weathers: [],
          timestamps: []
        };
      }
      
      dailyData[dayKey].temps.push(reading.main.temp);
      dailyData[dayKey].weathers.push(reading.weather[0]);
      dailyData[dayKey].timestamps.push(reading.dt);
    });

    return Object.values(dailyData).map(day => {
      // Encontrar el icono más representativo (el de mediodía más cercano)
      const noonIndex = day.timestamps.findIndex(
        ts => new Date(ts * 1000).getHours() >= 11
      );
      
      return {
        day: day.day,
        date: day.date,
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        weather: noonIndex >= 0 
          ? day.weathers[noonIndex] 
          : day.weathers[Math.floor(day.weathers.length / 2)]
      };
    });
  }, []);

  // Fetch datos meteorológicos
  const fetchWeather = useCallback(async () => {
    if (!lat || !lon) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error("API key no configurada");

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
      );

      const processedForecast = groupForecastByDay(response.data.list);
      setForecast(processedForecast.slice(0, 5)); // Mostrar solo 5 días
      
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar el pronóstico");
      console.error("Weather API error:", err);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, groupForecastByDay]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  if (error) {
    return (
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 mt-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Pronóstico del Clima
        </h3>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchWeather}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Pronóstico Extendido
      </h3>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FiLoader className="animate-spin text-3xl text-blue-500 mb-3" />
          <p>Cargando pronóstico...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {forecast.map((day, index) => (
            <DayForecast key={`${day.day}-${index}`} day={day} />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente hijo para cada día
const DayForecast = ({ day }) => (
  <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-b from-blue-50 to-white border border-blue-100">
    <p className="font-bold text-gray-800">
      {day.day} <span className="text-gray-500">{day.date}</span>
    </p>
    
    <div className="my-2">
      <img
        src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
        alt={day.weather.description}
        width="60"
        height="60"
        loading="lazy"
      />
    </div>
    
    <p className="text-sm text-gray-500 capitalize mb-2">
      {day.weather.description}
    </p>
    
    <div className="flex space-x-3">
      <div className="text-center">
        <span className="block text-xs text-gray-500">Máx</span>
        <span className="font-bold text-red-500">
          {Math.round(day.maxTemp)}°C
        </span>
      </div>
      
      <div className="text-center">
        <span className="block text-xs text-gray-500">Mín</span>
        <span className="font-bold text-blue-500">
          {Math.round(day.minTemp)}°C
        </span>
      </div>
    </div>
  </div>
);

export default WeatherForecast;