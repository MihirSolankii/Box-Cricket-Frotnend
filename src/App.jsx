import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import BoxCricketDashboard from "../src/Components/BoxCricketDashboard"
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Turfs from "./Pages/Turfs";
import TurfDetails from "./Pages/TurfDetails";
import Index from "./Pages/Index";
import NotFound from "./Pages/Notfound";
import Booking from "./Pages/Booking"
import MyBookings from "./Pages/MyBookings";
import Singup from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import Group from "./Pages/Group";
import GroupDashboard from "./Pages/GroupDashboard";
import Invitations from "./Pages/Invitations";
import MyGroups from "./Pages/MyGroups";
import GroupDetail from "./Pages/GroupDetail";
import RegisterVenue from "./Pages/RegisterVenue";
import ProfileSection from "./Pages/ProfileSection";
import CompleteProfile from "./Pages/CompleteProfile";

import Login from "./Pages/Login";
import Signup from "./Pages/SignupForm";
import VerifyEmail from "./Pages/VerifyEmail";
import Verify from "./Pages/Verify";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ScoreBoard from "./Pages/ScoreBoard";
import ScoreCard from "./Pages/ScoreCard";
import Contact from "./Pages/Contact";
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>

      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/turfs" element={<Turfs />} />
        <Route path="/turf/:id" element={<TurfDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-group" element={<Group />} />
        <Route path="/group/:groupId" element={<GroupDashboard />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/register-venue" element={<RegisterVenue />} />
        <Route path="/profile-section" element={<ProfileSection />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/scoreboard" element={<ScoreCard />} />
        <Route path="/scorecard" element={<ScoreBoard />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
