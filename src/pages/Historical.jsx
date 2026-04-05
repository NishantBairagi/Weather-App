import { useEffect, useState } from "react";
import axios from "axios";
import useLocation from "../hooks/useLocation";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Brush,
} from "recharts";

export default function Historical() {
  const location = useLocation();

  const [data, setData] = useState(null);
  const [airData, setAirData] = useState(null);

  const [startDate, setStartDate] = useState("2024-03-01");
  const [endDate, setEndDate] = useState("2024-03-07");

  // 🔍 Zoom range
  const [range, setRange] = useState([0, 20]);

  const isValidRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end - start) / (1000 * 60 * 60 * 24) <= 730;
  };

  // 🌦 Weather API
  useEffect(() => {
    if (!location?.latitude || !isValidRange()) return;

    axios
      .get("https://archive-api.open-meteo.com/v1/archive", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          start_date: startDate,
          end_date: endDate,
          daily:
            "temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max",
          timezone: "Asia/Kolkata",
        },
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [location, startDate, endDate]);

  // 🌫 Air Quality API
  useEffect(() => {
    if (!location?.latitude || !isValidRange()) return;

    axios
      .get("https://air-quality-api.open-meteo.com/v1/air-quality", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          start_date: startDate,
          end_date: endDate,
          hourly: "pm10,pm2_5",
          timezone: "Asia/Kolkata",
        },
      })
      .then((res) => setAirData(res.data))
      .catch(console.error);
  }, [location, startDate, endDate]);

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  // 📊 Transform data
  const tempData = data.daily.time.map((t, i) => ({
    date: t,
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
    mean: data.daily.temperature_2m_mean[i],
    precipitation: data.daily.precipitation_sum[i],
    wind: data.daily.wind_speed_10m_max[i],
  }));

  const airChartData =
    airData?.hourly?.time.map((t, i) => ({
      time: t.split("T")[0],
      pm10: airData.hourly.pm10[i],
      pm2_5: airData.hourly.pm2_5[i],
    })) || [];

  // 🔍 Apply zoom slicing
  const visibleTempData = tempData.slice(range[0], range[1]);
  const visibleAirData = airChartData.slice(range[0], range[1]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          🌦 Historical Dashboard
        </h1>

        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded-lg border border-white/20"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded-lg border border-white/20"
          />
        </div>
      </div>

      {!isValidRange() && (
        <p className="text-red-400 mb-4">
          Select range within 2 years
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TEMPERATURE */}
        <Card title="🌡 Temperature Trends">
          <ZoomControls setRange={setRange} total={tempData.length} />

          <ScrollChart dataLength={visibleTempData.length}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visibleTempData}>
                <XAxis dataKey="date" />
                <Tooltip />
                <Line dataKey="max" stroke="#22c55e" />
                <Line dataKey="min" stroke="#ef4444" />
                <Line dataKey="mean" stroke="#38bdf8" />
                <Brush dataKey="date" height={30} />
              </LineChart>
            </ResponsiveContainer>
          </ScrollChart>
        </Card>

        {/* PRECIPITATION */}
        <Card title="🌧 Precipitation">
          <ScrollChart dataLength={visibleTempData.length}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visibleTempData}>
                <XAxis dataKey="date" />
                <Tooltip />
                <Bar dataKey="precipitation" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </ScrollChart>
        </Card>

        {/* WIND */}
        <Card title="🌬 Wind Speed">
          <ScrollChart dataLength={visibleTempData.length}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visibleTempData}>
                <XAxis dataKey="date" />
                <Tooltip />
                <Line dataKey="wind" stroke="#facc15" />
              </LineChart>
            </ResponsiveContainer>
          </ScrollChart>
        </Card>

        {/* AIR QUALITY */}
        <Card title="🌫 Air Quality">
          <ScrollChart dataLength={visibleAirData.length}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visibleAirData}>
                <XAxis dataKey="time" />
                <Tooltip />
                <Line dataKey="pm10" stroke="#22c55e" />
                <Line dataKey="pm2_5" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </ScrollChart>
        </Card>
      </div>

      {/* SUN DATA */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">🌅 Sun Cycle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.daily.time.map((t, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl backdrop-blur border border-white/10"
            >
              <p className="text-sm">{t}</p>
              <p className="text-green-400 text-sm">
                🌅 {new Date(data.daily.sunrise[i]).toLocaleTimeString()}
              </p>
              <p className="text-orange-400 text-sm">
                🌇 {new Date(data.daily.sunset[i]).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 🔁 REUSABLE COMPONENTS */

function Card({ title, children }) {
  return (
    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur border border-white/10 shadow-lg">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function ScrollChart({ children, dataLength }) {
  return (
    <div className="overflow-x-auto">
      <div
        style={{ width: `${dataLength * 60}px` }}
        className="min-w-full"
      >
        {children}
      </div>
    </div>
  );
}

function ZoomControls({ setRange, total }) {
  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() =>
          setRange(([s, e]) => [Math.max(0, s - 5), Math.max(10, e - 5)])
        }
        className="px-3 py-1 bg-white/10 rounded"
      >
        ⬅️
      </button>

      <button
        onClick={() =>
          setRange(([s, e]) => [s + 5, Math.min(total, e + 5)])
        }
        className="px-3 py-1 bg-white/10 rounded"
      >
        ➡️
      </button>

      <button
        onClick={() => setRange([0, total])}
        className="px-3 py-1 bg-blue-500 rounded"
      >
        Reset
      </button>
    </div>
  );
}