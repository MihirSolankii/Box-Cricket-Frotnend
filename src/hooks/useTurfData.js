// src/hooks/useTurfData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { routes } from "../../routes.js"; // Adjust path as needed

export const useTurfData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check Local Storage for Data
        // const cachedData = localStorage.getItem("turfData");

        // if (cachedData) {
        //   console.log("Loading from Local Storage");
        //   setData(JSON.parse(cachedData));
        //   setLoading(false);
        //   return;
        // }

        // 2. If no data, Get Location
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported");
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("longtitude and latitude :",latitude,longitude);
            
            
            // Save location for future reference
            localStorage.setItem("userLocation", JSON.stringify({ latitude, longitude }));
             console.log("routes.getData",routes.getData);
             console.log("before response.....");
             
            // 3. Call API
            const response = await axios.post("https://box-cricket-backend-v7vh.onrender.com/api/user/box", {
              lat: latitude,
              lng: longitude
            });
                console.log("resoinse",routes.getData);
            
            console.log(" this is found what is error ",response.data);
            console.log("ooooooo",response.data.boxes);
            
            

            const boxes = response.data.boxes;
            console.log("after response///////////////");
            
            
            // 4. Save Data to Local Storage
            // localStorage.setItem("turfData", JSON.stringify(boxes));
            
            setData(boxes);
            setLoading(false);
          },
          (err) => {
            setError("Unable to retrieve location");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error(err);
        console.log(err);
        
        setError("Failed to load venues");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    console.log("idli dhosa ....",data);
    
  },[])

  return { data, loading, error };
};

