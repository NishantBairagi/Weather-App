// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function useWeather(location) {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (!location?.latitude || !location?.longitude) return;

//     setData(null); // 🔥 reset old data (important)

//     axios
//       .get("https://api.open-meteo.com/v1/forecast", {
//         params: {
//           latitude: location.latitude,
//           longitude: location.longitude,
//           hourly:
//             "temperature_2m,relative_humidity_2m,wind_speed_10m,pm10,pm2_5",
//           daily:
//             "temperature_2m_max,temperature_2m_min,sunrise,sunset",
//           current_weather: true,
//           timezone: "auto",
//         },
//       })
//       .then((res) => {
//         console.log("API Response:", res.data);
//         setData(res.data);
//       })
//       .catch((err) => {
//         console.error("API Error:", err);
//       });
//   }, [location]);

//   return data;
// }
import { useState, useEffect } from "react";
import axios from "axios";

export default function useWeather(location) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    const fetchData = async () => {
      try {
        // 🌦 Weather API
        const weatherRes = await axios.get(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: location.latitude,
              longitude: location.longitude,
              hourly:
                "temperature_2m,relative_humidity_2m,wind_speed_10m",
              daily:
                "temperature_2m_max,temperature_2m_min,sunrise,sunset",
              current_weather: true,
              timezone: "auto",
            },
          }
        );

        // 🌫 Air Quality API
        const airRes = await axios.get(
          "https://air-quality-api.open-meteo.com/v1/air-quality",
          {
            params: {
              latitude: location.latitude,
              longitude: location.longitude,
              hourly: "pm10,pm2_5",
              timezone: "auto",
            },
          }
        );

        // 🔥 Merge both
        const mergedData = {
          ...weatherRes.data,
          hourly: {
            ...weatherRes.data.hourly,
            pm10: airRes.data.hourly.pm10,
            pm2_5: airRes.data.hourly.pm2_5,
          },
        };

        console.log("Merged Data:", mergedData);
        setData(mergedData);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchData();
  }, [location]);

  return data;
}