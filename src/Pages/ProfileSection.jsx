import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, ShieldCheck,ArrowLeft,
  Users, Edit3, Loader2, Calendar 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

function ProfileSection() {
  const [userData, setUserData] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("UserCricBoxToken");
  const navigate=useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(routes.profile, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Profile Data:", response.data);

        if (response.data.success) {
          setUserData(response.data.user);
          setFriendsList(response.data.friendsname || []);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadProfile();
    } else {
      setLoading(false); // No token, stop loading
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
        User details not found. Please log in again.
      </div>
    );
  }

  // Get Initials for Avatar
  const initials = userData.name 
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
              <p className="text-muted-foreground text-sm">
                Access and manage your profile
              </p>
            </div>
          </div>
      <div className="container mx-auto max-w-4xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* --- 1. COVER BANNER --- */}
          <div className="h-48 w-full bg-gradient-to-r from-green-600 to-emerald-800 rounded-t-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>

          {/* --- 2. PROFILE CARD CONTENT --- */}
          <Card className="border-0 shadow-xl rounded-b-3xl rounded-t-none relative -mt-4 z-10">
            <CardContent className="pt-0 px-6 pb-8">
              
              {/* Header: Avatar & Main Info */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
                
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                    <AvatarImage src="" /> {/* Add profile pic URL if available */}
                    <AvatarFallback className="bg-slate-100 text-slate-700 text-3xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {userData.isVerified && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified User">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="flex-1 pt-4 md:pt-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 capitalize flex items-center gap-2">
                        {userData.name}
                      </h1>
                      <p className="text-slate-500 font-medium">@{userData.nickname}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-slate-200">
                        <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 3. DETAILS GRID --- */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Column: Contact Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-slate-600 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                        <p className="font-medium text-slate-900">{userData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                        <p className="font-medium text-slate-900">{userData.phoneNumber}</p>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-4 text-slate-600 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      
                    </div> */}
                  </div>
                </div>

                {/* Right Column: Friends & Activity */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-bold text-slate-800">Friends</h3>
                    <Badge variant="outline" className="text-slate-500">
                      {friendsList.length} Connected
                    </Badge>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    {friendsList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {friendsList?.map((friendName, index) => (
                          <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-slate-100">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-green-400 flex items-center justify-center text-[10px] text-white font-bold">
                              {/* {friendName[0]?.toUpperCase()} */}
                            </div>
                            <span className="text-sm font-medium text-slate-700">{friendName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No friends added yet.</p>
                      </div>
                    )}
                  </div>
                  
            

                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfileSection;