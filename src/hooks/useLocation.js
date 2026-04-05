import { useEffect, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        latitude: pos.coords.latitude,
  longitude: pos.coords.longitude
      });
    });
  }, []);

  return location;
}