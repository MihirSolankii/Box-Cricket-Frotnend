import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Car, Droplets, Lightbulb,Quote, Coffee, Dumbbell, ChevronLeft, ChevronRight, Check, Phone, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { routes } from "../../routes";
import Footer from '@/component/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

const facilityIcons = {
  'Parking': Car,
  'Washroom': Droplets,
  'Floodlights': Lightbulb,
  'Cafeteria': Coffee,
  'Equipment Rental': Dumbbell,
  'Drinking Water': Droplets,
  'First Aid': Check,
  'Seating Area': Check,
  'Coaching': Check,
};

const parseSlot = (slot) => {
  // Example: "5-6 PM"
  const [timeRange, period] = slot.split(" ");
  let [start, end] = timeRange.split("-");

  const to24Hour = (time, period) => {
    let hour = parseInt(time, 10);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return {
    startTime: to24Hour(start, period),
    endTime: to24Hour(end, period),
  };
};


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};





const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[boxId,setBoxId]=useState('')
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const[availableturf,setAvailableturf]=useState([]);
const [availabilityMsg, setAvailabilityMsg] = useState("");
const [isAvailable, setIsAvailable] = useState(null);
const [selectedCourt, setSelectedCourt] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${routes.getBox}/${id}`);
      
      if (response.data.success) {
        // The backend now returns a single unified 'response' object
        setBoxData(response.data.response);
        console.log(response.data);
        setBoxId(response.data.response.boxId)
        
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load turf details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);
 useEffect(() => {
  if (boxData?.boxId) {
    console.log("Box ID:", boxData.boxId);
   
    
  }
}, [boxData]);

useEffect(()=>{
 console.log("selected DataL",selectedDate);
 console.log("selected slot",selectedSlot);
 
},[])

 
  

const buildBookingPayload = () => {
  const { startTime, endTime } = parseSlot(selectedSlot);
    console.log("courtId",selectedCourt._id);
    console.log(startTime);
    
    console.log(selectedDate);
    
  return {
    date: formatDate(selectedDate),
    startTimes:startTime,
    endTimes:endTime,
    courtId:selectedCourt._id,
  };
};

const isAvailableBooking = async () => {
  try {
    setCheckingAvailability(true);
   const payload=buildBookingPayload();
    const response = await axios.post(
      `${routes.isAvailable}/${boxData?.boxId}`,
    payload
    );
     console.log("Payload sent:", payload);
    console.log("Response:", response.data);

    setAvailabilityMsg(response.data.message);
    setIsAvailable(response.data.isAvailable);
    setAvailableturf(response.data.availableCourts)

    return response.data.isAvailable;
  } catch (error) {
    console.error(error);
    setAvailabilityMsg("Failed to check availability");
    setIsAvailable(false);
    return false;
  } finally {
    setCheckingAvailability(false);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading turf details...</p>
        </div>
      </div>
    );
  }

  // Error or Not Found state
  if (error || !boxData) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              {error || "Turf not found"}
            </h1>
            <button 
              onClick={() => navigate('/turfs')}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Browse Turfs
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safe image handling - works for both registered and unregistered
  const images = Array.isArray(boxData?.images) && boxData.images.length > 0
    ? boxData.images
    : ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'];

  

const handleBookNow = async () => {
  console.log("clicked book now");

  const available = await isAvailableBooking();
  console.log("available:", available);

  if (!available) {
    console.log("slot not available, stopping");
    return;
  }

  console.log("inside handle book");

  navigate(`/booking/${boxData._id}`, {
    state: {
       turf: boxData,
      courtId: selectedCourt._id,   
      court: selectedCourt,       
      date: selectedDate,
      slot: selectedSlot,
    }
  });
};


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/20">
      
      {/* Decorative Background Blob */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />

      <main className="flex-1 py-10">
        {/* Main Container with increased padding and centering */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Back Button */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
    whileHover={{ x: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate(-1)}
    className="group flex items-center gap-2 px-4 py-2 bg-white 
    border-0 outline-none focus:outline-none focus:ring-0 shadow-none
    hover:text-primary transition-all duration-300"
  >
    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
    <span className="font-medium text-sm">Back to Turfs</span>
  </motion.button>

            {/* Status Badge (Mobile/Desktop friendly) */}
            <Badge className={`px-4 py-1.5 text-sm font-medium tracking-wide shadow-sm ${
              boxData.isRegistered 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20'
            }`}>
              {boxData.isRegistered ? '● Open for Booking' : '● Verification Pending'}
            </Badge>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: IMAGES & INFO (Spans 8 columns) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Image Slider Component */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 group bg-slate-900 aspect-[16/9] lg:aspect-[16/8]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={boxData.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Gradient Overlay for Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Slider Controls */}
                {images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="p-3 bg-white/10 hover:bg-white/90 rounded-full backdrop-blur-md border border-white/20 text-white hover:text-black transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="p-3 bg-white/10 hover:bg-white/90 rounded-full backdrop-blur-md border border-white/20 text-white hover:text-black transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.button>
                    </div>
                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentImageIndex === index 
                              ? 'bg-white w-8' 
                              : 'bg-white/40 w-4 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Turf Info Block */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
                    {boxData.name}
                  </h1>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-base font-medium">{boxData.address?.fullAddress}</span>
                    </div>

                    {boxData.averageRating > 0 && (
                      <div className="flex items-center gap-2">
                         <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500">
                           <Star className="h-5 w-5 fill-current" />
                         </div>
                        <span className="text-base font-bold text-foreground">
                          {boxData.averageRating.toFixed(1)} <span className="text-muted-foreground font-normal">/ 5.0</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
                  {boxData.description}
                </div>

                {/* Grid for Hours & Contact */}
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Opening Hours */}
                  {boxData.openingHours && (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-foreground mb-4 flex items-center gap-2.5">
                        <Clock className="h-5 w-5 text-primary" />
                        Operating Hours
                      </h4>
                      <div className="space-y-2">
                        {boxData.openingHours.weekday_text?.map((day, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{day.split(': ')[0]}</span>
                            <span className="font-medium text-foreground">{day.split(': ')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  {boxData.phoneno && (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2.5">
                          <Phone className="h-5 w-5 text-primary" />
                          Contact Information
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">Need to clarify something? Contact the venue directly.</p>
                      </div>
                      <a
                        href={`tel:${boxData.phoneno}`}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {boxData.phoneno}
                      </a>
                    </div>
                  )}
                </div>

                {/* Amenities - Styled as tags */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Facilities & Amenities</h3>
                  {boxData.amenities && boxData.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {boxData.amenities.map((amenity, index) => {
                        const Icon = facilityIcons[amenity.name] || Check;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-primary/50 transition-colors cursor-default"
                          >
                            <Icon size={18} className="text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {amenity.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No specific amenities listed.</p>
                  )}
                </div>

                {/* REVIEWS SECTION - REDESIGNED */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-foreground">Guest Reviews</h3>
                    {boxData.averageRating > 0 && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">{boxData.averageRating.toFixed(1)}</span>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={16} className={i < Math.round(boxData.averageRating) ? 'fill-current' : 'text-slate-300'} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {boxData.reviews && boxData.reviews.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {boxData.reviews.map((review, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          key={index}
                          className="relative group rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          {/* Decorative Quote Icon */}
                          <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-100 dark:text-slate-800 rotate-180 group-hover:text-primary/10 transition-colors" />
                          
                          <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {review.profile_photo_url ? (
                                <img src={review.profile_photo_url} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                review.author_name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm">{review.author_name}</p>
                              <div className="flex gap-0.5 text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={10} className={i < Math.round(review.rating) ? 'fill-current' : 'text-slate-200'} />
                                ))}
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                            "{review.text || 'No detailed review provided.'}"
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300">
                      <p className="text-muted-foreground">No reviews available yet. Be the first to book!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING CARD (Spans 4 columns & Sticky) */}
            <div className="lg:col-span-4">
              <div className="sticky top-6">
                <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                  {/* Dynamic Header */}
                  <div className="bg-slate-900 dark:bg-slate-950 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10 flex justify-between items-center">
                       <div>
                         <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Price per Hour</p>
                         <div className="flex items-baseline gap-1">
                           <span className="text-3xl font-bold">
                             {boxData.pricePerHour > 0 ? `₹${boxData.pricePerHour}` : 'Contact'}
                           </span>
                         </div>
                       </div>
                       {boxData.isRegistered && (
                         <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                            <CalendarIcon className="h-6 w-6 text-white" />
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 bg-white dark:bg-slate-900 space-y-6">
                    {boxData.isRegistered ? (
                      <>
                        {/* CALENDAR */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-foreground">Select Date</label>
                          <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              className="w-full flex justify-center"
                              classNames={{
                                head_cell: "text-muted-foreground font-normal text-[0.8rem]",
                                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/10 rounded-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors",
                                day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white shadow-md",
                                day_today: "bg-slate-100 text-slate-900 font-bold",
                              }}
                            />
                          </div>
                        </div>

                        {/* COURT SELECTION */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-foreground">Select Court</label>
                          <div className="grid grid-cols-2 gap-3">
                            {boxData.courts?.map((court) => (
                              <button
                                key={court.courtId}
                                disabled={!court.isAvailable}
                                onClick={() => setSelectedCourt(court)}
                                className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                                  selectedCourt?._id === court._id
                                    ? "bg-primary/5 border-primary ring-1 ring-primary"
                                    : court.isAvailable
                                    ? "bg-white border-slate-200 hover:border-primary/50"
                                    : "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                                }`}
                              >
                                <div className={`font-semibold text-sm ${selectedCourt?._id === court._id ? 'text-primary' : 'text-foreground'}`}>
                                  {court.courtName}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {court.maxPlayers} Players
                                </div>
                                {selectedCourt?._id === court._id && (
                                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Availability Check Button */}
                         <motion.button
                             whileTap={{ scale: 0.98 }}
                             onClick={isAvailableBooking}
                             className="w-full py-2.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors"
                         >
                            Refresh Availability
                         </motion.button>

                        {/* TIME SLOTS */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-foreground">Select Time</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['6-7 AM', '7-8 AM', '8-9 AM', '9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM'].map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-2 py-2.5 text-xs font-medium rounded-lg transition-all ${
                                  selectedSlot === slot
                                    ? 'bg-primary text-white shadow-md shadow-primary/30 transform scale-105'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Availability Message */}
                        <AnimatePresence>
                          {availabilityMsg && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2 ${
                                isAvailable
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                              {availabilityMsg}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* BOOK NOW BUTTON */}
                        <div className="pt-2">
                          <motion.button
                            whileHover={!(!selectedSlot || !selectedCourt || checkingAvailability) ? { scale: 1.02 } : {}}
                            whileTap={!(!selectedSlot || !selectedCourt || checkingAvailability) ? { scale: 0.98 } : {}}
                            disabled={!selectedSlot || !selectedCourt || checkingAvailability}
                            onClick={handleBookNow}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                              !selectedSlot || checkingAvailability
                                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-400'
                                : 'bg-gradient-to-r from-primary to-purple-600 shadow-primary/25 hover:shadow-primary/40'
                            }`}
                          >
                            {checkingAvailability ? (
                                <span className="animate-pulse">Checking...</span>
                            ) : (
                              <>
                                <span>{selectedSlot ? `Book ${selectedSlot}` : "Select Details"}</span>
                                {selectedSlot && <ChevronRight size={18} />}
                              </>
                            )}
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      /* UNREGISTERED STATE */
                      <div className="space-y-6">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-5"
                        >
                          <div className="flex gap-3 mb-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full h-fit">
                              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-amber-900 dark:text-amber-100">Direct Booking Only</h4>
                              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                This venue manages their own schedule. Contact them to check slots.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {boxData.phoneno && (
                          <div className="space-y-3">
                            <motion.a
                              href={`tel:${boxData.phoneno}`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-xl transition-all"
                            >
                              <Phone className="h-4 w-4" />
                              Call Venue
                            </motion.a>
                            
                            <motion.a
                               href={`https://wa.me/${boxData.phoneno.replace(/\D/g, '')}`}
                               target="_blank"
                               rel="noreferrer"
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                               className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all"
                            >
                               {/* WhatsApp SVG Path */}
                               <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                               Chat on WhatsApp
                            </motion.a>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TurfDetails;