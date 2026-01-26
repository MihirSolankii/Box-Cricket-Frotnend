import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Search,
  Home,
  Calendar,
  Trophy,
  Users2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const BoxCricketDashboard = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);



  return (
    <div className="min-h-screen bg-background text-foreground">
     
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
       
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">BoxCricket</h1>

            
          </div>

          {/* Center Search */}
          <div className="hidden lg:block w-full max-w-md mx-6">
            <div className="relative">
              {/* <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              /> */}
              {/* <input
                placeholder="Search boxes, locations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-ring outline-none"
              /> */}
 <nav className="hidden md:flex items-center gap-6 text-sm">
              {/* <NavItem icon={<Home size={16} />} label="Home" active /> */}
              {/* <NavItem icon={<Search size={16} />} label="Find Boxes" /> */}
             
              <NavItem icon={<Trophy size={16} />} label="Scoreboard" />
             <NavItem  label="Group"/>
            </nav>
              
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5 relative">
            {/* Highlighted CTA */}
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
              Register Your Venue
            </button>

            <ThemeToggle />

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-secondary font-semibold"
            >
              U
            </button>

          <button className="px-4 py-2 rounded-lg bg-accent font-medium hover:opacity-90 transition">
              Signin
            </button>

            
            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-popover border border-border rounded-lg shadow-lg">
                <MenuItem label="Profile" />
                <MenuItem label="My Bookings"/>
                <MenuItem label="Friends"/>
                <MenuItem label="ScoreCard"/>
                <MenuItem label="Logout" danger />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
        
             <h2> Play win bok you box now </h2>
            <div>right isde image</div>
        </div>
      </main>

        <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
           Top Rated Boxes:
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-card border border-border rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxes.map((box, i) => (
                <BoxCard key={i} box={box} />
              ))}
            </div>
          )}
        </div>
      </main>
        <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Nearby Cricket Boxes
          </h2>
            <p>See More </p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-card border border-border rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxes.map((box, i) => (
                <BoxCard key={i} box={box} />
              ))}
            </div>
          )}
        </div>
      </main>


      <div>
        <h2>List your Venue</h2>
        <h2>Host Cricket</h2>
        <h2>Your Bookings </h2>
      </div>
      <div>
        {/* GRID TYPW SOME RANOME PHOTOS  */}
        <p>Image Section</p>
      </div>
      <div>
        footer 
      </div>
    </div>
  );
};

export default BoxCricketDashboard;

/* ================= Components ================= */

const NavItem = ({ icon, label, active }) => (
  <button
    className={`flex items-center gap-2 text-sm font-medium transition ${
      active
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    {label}
  </button>
);

const MenuItem = ({ label, danger }) => (
  <button
    className={`w-full text-left px-4 py-2 hover:bg-accent ${
      danger ? "text-destructive" : ""
    }`}
  >
    {label}
  </button>
);

const BoxCard = ({ box }) => (
  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition">
    <div className="h-40 bg-muted flex items-center justify-center">
      <MapPin size={32} className="text-primary" />
    </div>

    <div className="p-4 space-y-2">
      <h3 className="font-bold text-lg">
        {box.name || "Cricket Box"}
      </h3>

      <Info icon={<Users size={14} />} text="10–15 Players" />
      <Info icon={<Clock size={14} />} text="6 AM – 11 PM" />
      <Info icon={<Star size={14} />} text="4.5 Rating" />

      <div className="flex justify-between items-center pt-3">
        <span className="text-xl font-bold text-primary">
          ₹500/hr
        </span>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          Book
        </button>
      </div>
    </div>
  </div>
);

const Info = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    {icon}
    {text}
  </div>
);
