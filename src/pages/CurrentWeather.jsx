import useLocation from "../hooks/useLocation";
import useWeather from "../hooks/useWeather";
import Card from "../components/Card";
import Chart from "../components/Chart";
import MultiChart from "../components/MultiChart";
import { motion } from "framer-motion";
import "./current.css";
import { useState } from "react";

export default function CurrentWeather() {

  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState(null);

  const userLocation = useLocation();   // ✅ always runs
  const location = coords ?? userLocation;

  const data = useWeather(location);    // ✅ safe now
  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
    );
    const result = await res.json();

    if (result.results && result.results.length > 0) {
      const { latitude, longitude } = result.results[0];
      setCoords({ latitude, longitude });
    } else {
      alert("Location not found");
    }
  };
  if (!data || !data.hourly || !data.daily) {
    return <div className="p-4">Loading weather...</div>;
  }
  const max = data.daily.temperature_2m_max[0];

  const temps = data?.hourly?.temperature_2m || [];

  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);

  const hourlyData =
  data?.hourly?.time?.map((t, i) => ({
    time: t?.split("T")[1],
    temp: temps[i],
    max: maxTemp,
    min: minTemp,
    humidity: data?.hourly?.relative_humidity_2m?.[i],
    wind: data?.hourly?.wind_speed_10m?.[i],

    // ✅ AIR QUALITY (IMPORTANT)
    pm10: data?.hourly?.pm10?.[i],
    pm2_5: data?.hourly?.pm2_5?.[i],
  })) || [];
  

  return (

    <div className="current flex flex-row  items-start justify-between">
      <div >
        <div className="flex flex-col  justify-evenly items-center">
          <h1 className="font-bold text-xl">🌦 Weather Dashboard</h1>
          <input
            type="text"
            placeholder="Enter location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="inpt px-3 py-2"
          />
          <button
            onClick={handleSearch}
            className="btn bg-blue-500 text-white px-3 py-2 rounded-md"
          >
            Search
          </button>
          <p className="text-sm">
            Real-time insights for your location
          </p>
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur">
            {new Date().toDateString()}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-rows-1  grid-cols-2 gap-4 "
        >
          <Card title="🌡 Current" value={`${data.current_weather.temperature}°C`} />
          <Card title="📈 Max" value={`${data.daily.temperature_2m_max[0]}°C`} />
          <Card title="📉 Min" value={`${data.daily.temperature_2m_min[0]}°C`} />
          <Card title="🌬 Wind" value={`${data.current_weather.windspeed} km/h`} />
          <Card title="🌅 Sunrise" value={new Date(data.daily.sunrise[0]).toLocaleTimeString()} />
          <Card title="🌇 Sunset" value={new Date(data.daily.sunset[0]).toLocaleTimeString()} />
        </motion.div>

        {/* 🌫 EXTRA AIR QUALITY + HUMIDITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-1 gap-4"
        >
          <Card title="💧 Humidity" value={`${data.hourly.relative_humidity_2m[0]}%`} />
          <Card title="🌫 PM2.5" value={`${data.hourly.pm2_5[0]}`} />
          <Card title="🌫 PM10" value={`${data.hourly.pm10[0]}`} />
          <Card title="🌧 Precipitation" value={`${data.hourly.precipitation?.[0] || 0} mm`} />
        </motion.div>
      </div>
      <div className="space-y-10 ">
        <h2 className="text-xl font-semibold">📊 Hourly Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Chart
              title="🌡 Temperature"
              data={hourlyData}
              lines={[
                { key: "temp", color: "#38bdf8" },
                { key: "max", color: "#22c55e" },
                { key: "min", color: "#ef4444" },
              ]}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Chart
              title="💧 Humidity"
              data={hourlyData}
              lines={[
                { key: "humidity", color: "#60a5fa" },
              ]}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Chart
              title="🌬 Wind Speed"
              data={hourlyData}
              lines={[
                { key: "wind", color: "#facc15" },
              ]}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <MultiChart
              title="🌫 Air Quality (PM10 & PM2.5)"
              data={hourlyData}
            />
          </motion.div>
        </div>
      </div>
    </div>



  );
}