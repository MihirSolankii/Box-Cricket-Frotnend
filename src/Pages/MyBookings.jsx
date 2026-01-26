import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CalendarX2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/component/Headers';
import Footer from '@/component/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {routes} from "../../routes.js"

// --- UTILS ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Status Colors based on your theme variables
const getStatusConfig = (status) => {
  const s = status?.toLowerCase() || 'pending';
  if (s === 'upcoming' || s === 'confirmed') {
    return { color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle2 };
  }
  if (s === 'completed') {
    return { color: 'bg-muted text-muted-foreground border-border', icon: CheckCircle2 };
  }
  if (s === 'cancelled') {
    return { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle };
  }
  return { color: 'bg-secondary text-secondary-foreground', icon: AlertCircle };
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("UserCricBoxToken");

  // Fetch Data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${routes.myBookings}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBookings();
  }, [token]);

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const pastBookings = bookings.filter((b) => b.status !== 'upcoming');

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          
          {/* PAGE HEADER */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                My Bookings
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Manage your matches and track your history.
              </p>
            </div>
            
            <Button className="btn-primary shadow-lg shadow-primary/20" asChild>
              <Link to="/turfs">Book New Slot</Link>
            </Button>
          </div>

          {/* LOADING STATE */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32">
               <Loader2 className="h-10 w-10 animate-spin text-primary" />
               <p className="mt-4 text-muted-foreground font-medium">Loading matches...</p>
             </div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              
              {/* CUSTOM TABS LIST */}
              <TabsList className="mb-8 bg-muted/50 p-1.5 h-auto rounded-xl border border-border w-full md:w-fit">
                <TabsTrigger 
                  value="upcoming" 
                  className="px-6 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium flex-1 md:flex-none"
                >
                  Upcoming <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">{upcomingBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="past"
                  className="px-6 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all font-medium flex-1 md:flex-none"
                >
                  History <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">{pastBookings.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-0 space-y-8 animate-in fade-in-50 duration-500">
                {upcomingBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No upcoming matches" desc="Time to get back on the field!" />
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-0 space-y-8 animate-in fade-in-50 duration-500">
                {pastBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking._id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No history found" desc="Your past games will show up here." />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// --- REDESIGNED CARD COMPONENT ---
const BookingCard = ({ booking }) => {
  const isUpcoming = booking.status === 'upcoming';
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="card-turf group relative overflow-hidden bg-card border border-border rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      
      {/* Decorative Top Border for Upcoming */}
      {isUpcoming && <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />}

      <CardContent className="p-0">
        <div className="p-6">
          
          {/* HEADER: Title & Price */}
          <div className="flex justify-between items-start gap-4 mb-5">
            <div className="space-y-1.5">
              <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${statusConfig.color}`}>
                <div className="flex items-center gap-1">
                   <StatusIcon size={12} />
                   {booking.status}
                </div>
              </Badge>
              <h3 className="font-bold text-lg text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {booking.boxName || "Turf Arena"}
              </h3>
            </div>
            
            <div className="text-right">
              <span className="block text-2xl font-bold text-primary tracking-tight">
                ₹{booking.totalAmount}
              </span>
              {booking.paymentStatus === 'success' && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-1.5 py-0.5 rounded-md">
                  Paid
                </span>
              )}
            </div>
          </div>

          {/* DETAILS BOX */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-3 border border-border/50">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-background rounded-md text-primary shadow-sm">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(booking.date)}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {booking.startTime} - {booking.endTime} ({booking.duration}h)
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-background rounded-md text-muted-foreground shadow-sm group-hover:text-primary transition-colors">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                 <p className="text-sm font-medium text-foreground">Location</p>
                 <a href="#" className="text-xs text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors">
                   View on Google Maps
                 </a>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (Upcoming Only) */}
        {isUpcoming && (
          <div className="px-6 pb-6 pt-2 flex gap-3">
             <Button 
                variant="outline" 
                className="flex-1 border-border hover:bg-secondary hover:text-foreground text-sm h-10 rounded-lg"
              >
               Reschedule
             </Button>
             <Button 
                variant="ghost" 
                className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive text-sm h-10 rounded-lg"
              >
               Cancel
             </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- EMPTY STATE ---
const EmptyState = ({ title, desc }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 bg-card border border-dashed border-border rounded-xl text-center">
    <div className="bg-muted/50 p-4 rounded-full mb-4">
      <CalendarX2 className="h-8 w-8 text-muted-foreground/50" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground max-w-xs mb-6 mx-auto text-sm">{desc}</p>
    <Button asChild className="btn-primary">
      <Link to="/turfs">Browse Turfs</Link>
    </Button>
  </div>
);

export default MyBookings;