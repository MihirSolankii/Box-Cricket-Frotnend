import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, MapPin, Loader2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {routes} from "../../routes.js"

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [locationStatus, setLocationStatus] = useState({
    found: false,
    lat: '',
    lng: ''
  });

  // 1. Fetch Location from Local Storage on Mount
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");

    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation);
        if (parsed.latitude && parsed.longitude) {
          setLocationStatus({
            found: true,
            lat: parsed.latitude,
            lng: parsed.longitude
          });
          console.log("Location loaded from storage:", parsed);
        }
      } catch (e) {
        console.error("Error parsing location", e);
      }
    } else {
      toast.warning("Location not found. Please enable location services.");
    }
  }, []);

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }

    if (!locationStatus.found) {
      toast.error("Location data is missing. Please refresh or enable location.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("UserCricBoxToken");

      const payload = {
        nickname: nickname,
        latitude: String(locationStatus.lat), // Ensure string format as per your requirement
        longitude: String(locationStatus.lng)
      };

      const response = await axios.post(`${routes.UserProfile}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Profile Updated:", response.data);
      toast.success("Profile completed successfully!");

      // Update local user data if necessary
      localStorage.setItem('userNickname', nickname);

      navigate('/'); // Redirect to Home/Dashboard

    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-10 px-4">

      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">

          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-yellow-400 to-primary"></div>

          {/* Header */}
          <div className="text-center mb-8 mt-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              One Last Step
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Set your nickname and confirm your location to start booking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nickname Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground ml-1 uppercase tracking-wide">
                Nickname
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. MasterBlaster"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-xl outline-none transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            {/* Location Status Card */}
            {/* <div className={`p-4 rounded-xl border transition-colors ${
              locationStatus.found 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-red-500/10 border-red-500/20"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full ${
                   locationStatus.found ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                  <MapPin size={14} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${
                     locationStatus.found ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                  }`}>
                    {locationStatus.found ? "Location Detected" : "Location Missing"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {locationStatus.found 
                      ? `Lat: ${locationStatus.lat.toFixed(4)}, Long: ${locationStatus.lng.toFixed(4)}`
                      : "We couldn't find your saved location. Please ensure you allowed location access on the previous screen."
                    }
                  </p>
                </div>
                {locationStatus.found ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
              </div>
            </div> */}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading || !locationStatus.found}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Profile <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
          Your location helps us find the nearest turfs for you.
        </p>
      </motion.div>
    </div>
  );
}