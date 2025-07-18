import { useState, useEffect } from "react";
import axios from "axios";
import { FiThermometer, FiWind, FiDroplet } from "react-icons/fi";

const WeatherForecast = ({ lat, lon }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat && lon) {
      const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
          // Usamos el endpoint '/forecast' que está disponible en el plan gratuito
        const response = await axios.get(
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
);


          // Procesamos los     datos para agruparlos por día
              
          const dailyData = response.data.list.reduce((acc, reading) => {
            const date = new Date(reading.dt * 1000).toLocaleDateString("es-MX", {
              weekday: "short",
              day: "numeric",
            });
            if (!acc[date]) {
              acc[date] = {
                temps: [],
                weather: reading.weather[0],
              };
            }
            acc[date].temps.push(reading.main.temp);
            return acc;
          }, {});

          const dailyForecast = Object.keys(dailyData).map(date => {
            const day = dailyData[date];
            const avgTemp = day.temps.reduce((a, b) => a + b) / day.temps.length;
            return {
              date,
              temp: avgTemp,
              weather: day.weather,
            };
          });

          setForecast(dailyForecast);
        } catch (err) {
          setError("No se pudo cargar el pronóstico del tiempo.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
    }
  }, [lat, lon]);


  if (loading) {
    return <div className="text-center p-4">Cargando clima...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Pronóstico del Clima
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecast &&
          forecast.map((day, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg text-center shadow-sm border border-gray-100"
            >
              <p className="font-bold text-gray-800">
                {day.date}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
                alt={day.weather.description}
                className="mx-auto"
              />
              <p className="text-lg font-bold text-blue-600">
                {Math.round(day.temp)}°C
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {day.weather.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default WeatherForecast;