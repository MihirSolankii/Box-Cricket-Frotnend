import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Check, Copy, Search, Plus, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; 
import axios from 'axios';
import { routes } from '../../routes.js';

const Group = () => {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(null);
  
  // Data States
  const [createdGroup, setCreatedGroup] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]); // Default to empty array
  const [invitedUsers, setInvitedUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem('UserCricBoxToken');
  const bookingId = localStorage.getItem('bookingid'); 

  // --- FIX 1: SAFETY CHECK IN DATA FETCHING ---
  useEffect(() => {
    const fetchNicknames = async () => {
      if (step === 2) { 
        if (!token) return;

        try {
          setUsersLoading(true);
          const response = await axios.get(`${routes.nickname}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log("API Response:", response.data); // Debug log

          // HANDLE BOTH FORMATS: Directly Array OR Object with 'users' key
          if (Array.isArray(response.data)) {
             setAvailableUsers(response.data);
          } else if (response.data.users && Array.isArray(response.data.users)) {
             setAvailableUsers(response.data.users);
          } else {
             console.error("Unexpected response format:", response.data);
             setAvailableUsers([]); // Fallback to empty array to prevent crash
          }

        } catch (error) {
          console.error("Failed to load nicknames", error);
          toast.error("Could not load users list");
        } finally {
          setUsersLoading(false);
        }
      }
    };

    fetchNicknames();
  }, [step, token]); 

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const createGroupApi = async (nameToUse) => {
    if (!token) { toast.error("You are not logged in!"); return; }
    if (!bookingId) { toast.error("No booking found!"); return; }

    try {
      setLoading(true);
      const response = await axios.post(
        `${routes.createGroup}`,
        { name: nameToUse, 
          bookingId: bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      console.log("group data",response);
      

      if (response.data) {
        setCreatedGroup(response.data.group || response.data);
        setGroupName(response.data.name)
        toast.success("Group created successfully!");
        setStep(2); 
      }
    } catch (error) {
      console.error("Create Group Error:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    createGroupApi(groupName);
  };

  const handleSkip = () => {
    const randomName = `Turf Squad #${Math.floor(Math.random() * 1000)}`;
    setGroupName(randomName);
    createGroupApi(randomName);
  };

  const handleInviteUser = async (user) => {
    if (!createdGroup?._id) return;
    if (!user.nickname) {
        toast.error("User has no nickname set, cannot invite.");
        return;
    }

    try {
      setInviteLoading(user._id); 
     const response= await axios.post(
        `${routes.inviteGroup}`,
        {
          groupId: createdGroup._id,
          nickname: user.nickname 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      console.log("inbvitatipn sent",response);
      
      setInvitedUsers(prev => [...prev, user._id]);
      toast.success(`Invited ${user.nickname}`);
    } catch (error) {
      console.error("Invite Error:", error);
      toast.error(error.response?.data?.message || "Failed to invite user");
    } finally {
      setInviteLoading(null);
    }
  };

  const handleCopyLink = () => {
    const link = `https://cricketbox.com/join/${createdGroup?._id || 'error'}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied");
  };

  // --- FIX 2: SAFETY CHECK IN FILTER ---
  // Ensure availableUsers is actually an array before filtering
  const safeUsersList = Array.isArray(availableUsers) ? availableUsers : [];
  
  const filteredUsers = safeUsersList.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(searchLower);
    const nickMatch = user.nickname?.toLowerCase().includes(searchLower);
    return nameMatch || nickMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/60 bg-white overflow-hidden relative">
        <div className="h-2 w-full bg-primary" />

        <CardHeader className="text-center pt-8 pb-2">
          <motion.div layout className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {step === 1 ? <Users className="h-8 w-8 text-green-600" /> : <Check className="h-8 w-8 text-green-600" />}
          </motion.div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {step === 1 ? "Payment Successful!" : "Group Created!"}
          </CardTitle>
          <p className="text-slate-500 text-sm">
            {step === 1 ? "Create a group to split costs." : `"${groupName}" is ready.`}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCreateGroup}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Group Name</label>
                  <Input 
                    placeholder="e.g. Sunday Strikers" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="h-11 bg-slate-50 border-slate-200 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading || !groupName}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Group"}
                </Button>
                <Button variant="ghost" className="w-full text-slate-400" onClick={handleSkip} type="button" disabled={loading}>
                  Skip for now (Auto-Create)
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="flex-1 truncate text-xs text-slate-500 font-mono">
                    https://cricketbox.com/join/{createdGroup?._id}
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                    <span className="bg-white px-2 text-slate-400 font-semibold z-10">Or invite friends</span>
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by nickname..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 h-10 text-sm"
                  />
                </div>

                <div className="h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {usersLoading ? (
                    <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const isInvited = invitedUsers.includes(user._id);
                      const isProcessing = inviteLoading === user._id;

                      return (
                        <div key={user._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-sm">
                              {getInitials(user.nickname)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-medium text-slate-700">{user.nickname}</span>
                              <span className="text-[10px] text-slate-400">User</span>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant={isInvited ? "secondary" : "outline"}
                            className={`h-7 px-3 text-xs ${isInvited ? 'bg-green-100 text-green-700' : ''}`}
                            onClick={() => !isInvited && handleInviteUser(user)}
                            disabled={isInvited || isProcessing || !user.nickname}
                          >
                            {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                             isInvited ? <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Sent</span> : 
                             <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> Add</span>
                            }
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-sm">No users found.</div>
                  )}
                </div>

                <Button onClick={() => navigate(`/group/${createdGroup?._id}`)} className="w-full h-11 text-base font-semibold">
                  Done <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default Group;