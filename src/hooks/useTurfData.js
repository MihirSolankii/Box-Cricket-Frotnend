// src/hooks/useTurfData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { routes } from "../../routes.js"; // Adjust path as needed

export const useTurfData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoxes = async (coords = null) => {
      try {
        setLoading(true);
        const payload = (coords && (coords.latitude || coords.lat) && (coords.longitude || coords.lng))
          ? { lat: coords.latitude || coords.lat, lng: coords.longitude || coords.lng }
          : {};

        let response = await axios.post(routes.getData, payload);
        let boxes = response.data?.boxes || [];

        // If user location yields 0 boxes, load all available boxes across cities
        if (boxes.length === 0 && Object.keys(payload).length > 0) {
          response = await axios.post(routes.getData, {});
          boxes = response.data?.boxes || [];
        }

        setData(boxes);
        setError("");
      } catch (err) {
        // Fallback: try fetching all boxes with empty payload
        try {
          const fallbackRes = await axios.post(routes.getData, {});
          const boxes = fallbackRes.data?.boxes || [];
          if (boxes.length > 0) {
            setData(boxes);
            setError("");
            return;
          }
        } catch (_) {}
        setError(err.response?.data?.message || "Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    // 1. Check local storage first
    const storedLocation = localStorage.getItem("userLocation");
    let parsedLocation = null;
    if (storedLocation) {
      try {
        parsedLocation = JSON.parse(storedLocation);
      } catch (e) {
        console.error("Error parsing userLocation", e);
      }
    }

    if (parsedLocation && parsedLocation.latitude && parsedLocation.longitude) {
      fetchBoxes(parsedLocation);
      return;
    }

    // 2. Try geolocation, fallback to fetching all boxes without location if denied/unavailable
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));
          fetchBoxes({ latitude, longitude });
        },
        (geoErr) => {
          console.warn("Geolocation denied/failed. Fetching all boxes without location:", geoErr.message);
          fetchBoxes(null);
        },
        { timeout: 7000 }
      );
    } else {
      console.warn("Geolocation not supported. Fetching all boxes without location.");
      fetchBoxes(null);
    }
  }, []);

  useEffect(()=>{
    
  },[])

  return { data, loading, error };
};

