import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Settings, Check, X, 
  Wallet, Filter, Search, Calendar, 
  Loader2, Ban, UserPlus, Crown, Bell
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import axios from 'axios';
import {routes} from "../../routes.js"

const GroupDashboard = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  const token = localStorage.getItem('UserCricBoxToken');
  const currentUserId = localStorage.getItem('UserId');

  // --- STATE ---
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Settlement States
  const [settlementData, setSettlementData] = useState(null);
  const [mySettlement, setMySettlement] = useState(null);
  const [settlementLoading, setSettlementLoading] = useState(false);
  
  // Modal States
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberNick, setNewMemberNick] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Settle Modal States
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [settleStep, setSettleStep] = useState('input');
  const [amountToPay, setAmountToPay] = useState('');
  const [settlePaymentMethod, setSettlePaymentMethod] = useState("UPI");

  // --- HELPER FUNCTIONS ---
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "U";

  // --- 1. CORE FETCH LOGIC (Fixed Flow) ---
  useEffect(() => {
    const initDashboard = async () => {
      if (!token || !groupId) return;

      try {
        setLoading(true);

        // A. Fetch Group Details First
        const groupResponse = await axios.post(
          `${routes.groupDetail}`,
          { groupId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (groupResponse.data.success) {
          const group = groupResponse.data.group;
          setGroupData(group);

          // B. CHECK ADMIN STATUS & CREATE SETTLEMENT
          // Only the Admin (who booked) should trigger the create/calculate route
          const isAdmin = group.admin?._id === currentUserId || group.admin === currentUserId;
          
          if (isAdmin) {
             try {
                const totalAmount = group.bookingId?.totalAmount;
               const resposne= await axios.post(
                  `${routes.createSettlement}`,
                  { groupId, totalAmount },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Admin triggered settlement calculation");
                console.log("resposne if settlement created::::",resposne.data);
                
             } catch (err) {
                console.error("Settlement creation/update warning:", err);
                // We don't stop execution here, maybe it already exists
             }
          }

          // C. Fetch Settlement Details (For Everyone)
          await fetchSettlementDetails();
        }
      } catch (error) {
        console.error("Init Dashboard Error:", error);
        toast.error("Failed to load group data");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [groupId, token, currentUserId]); // Added currentUserId dependency

  // --- 2. FETCH SETTLEMENT DETAILS ---
  const fetchSettlementDetails = async () => {
    try {
      setSettlementLoading(true);
      
      const response = await axios.get(
        `${routes.getGroup}/${groupId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if(response.data?.settlement) {
        setSettlementData(response.data);
        console.log("Settlement Details Fetched:", response.data.settlement._id);
        localStorage.setItem("SettlementId",response.data.settlement._id);
       
        
        // Fetch personal status only if settlement exists
        await fetchMyStatus(response.data.settlement._id);
      }
    } catch (error) {
      console.log("Settlement fetch info:", error.response?.data?.message || error.message);
      // It's okay if 404 (Settlement not created yet), just clear data
      setSettlementData(null);
    } finally {
      setSettlementLoading(false);
    }
  };

  // --- 3. FETCH MY PAYMENT STATUS ---
  const fetchMyStatus = async (settlementId) => {
    try {
      const response = await axios.get(
        `${routes.myStatus}/${settlementId}/my-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMySettlement(response.data);
    } catch (error) {
      console.error("My status error:", error);
      // Suppress 404 errors here as user might not be in settlement yet
    }
  };

  // --- 4. PROCESS PAYMENT ---
  const processPayment = async () => {
    if (!amountToPay || Number(amountToPay) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const settlementId = settlementData?.settlement?._id;
    if (!settlementId) return toast.error("Settlement not found");

    try {
      setSettleStep('processing');
      await axios.post(
        `${routes.mySettlemetn}/${settlementId}/payment`,
        { 
          amount: Number(amountToPay), 
          paymentMethod: settlePaymentMethod 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSettleStep('success');
      toast.success("Payment recorded!");

      setTimeout(async () => {
        await fetchSettlementDetails();
        setIsSettleOpen(false);
        setSettleStep('input');
        setAmountToPay('');
      }, 2000);

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setSettleStep('input');
    }
  };

  // --- 5. SEND REMINDER ---
  const sendReminder = async (memberUserId) => {
    const settlementId = settlementData?.settlement?._id;
    if (!settlementId) return toast.error("Settlement not active yet");

    try {
      await axios.post(
        `${routes.reminder}`,
        { settlementId, userId: memberUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reminder sent!");
    } catch (error) {
      toast.error("Failed to send reminder");
    }
  };

  // --- 6. ADD MEMBER ---
  const handleAddMember = async () => {
    if (!newMemberNick.trim()) return;

    try {
      setInviteLoading(true);
      await axios.post(
        `${routes.inviteGroup}`, // Make sure this matches backend route exactly
        { groupId, nickname: newMemberNick },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Invite sent to ${newMemberNick}`);
      setIsAddMemberOpen(false);
      setNewMemberNick("");
      
      // Refresh logic
      const groupResponse = await axios.post(
        `${routes.groupDetail}`,
        { groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (groupResponse.data.success) {
        setGroupData(groupResponse.data.group);
        // If admin, this might trigger a recalculation needed? 
        // Usually settlement updates automatically or needs a manual trigger.
        // For now, just fetching group data is enough for UI.
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to invite user");
    } finally {
      setInviteLoading(false);
    }
  };

  // Check if current user is admin safely
  const isAdmin = groupData?.admin?._id === currentUserId || groupData?.admin === currentUserId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!groupData) return <div className="p-8 text-center">Group Not Found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="outline" size="icon" onClick={() => navigate('/my-groups')} className="rounded-full flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">{groupData.name}</h1>
                {isAdmin && <Badge className="bg-primary/10 text-primary text-xs flex-shrink-0">Admin</Badge>}
              </div>
              <p className="text-slate-500 text-sm mt-1 truncate">
                {groupData.bookingId?.date || "Date N/A"} • ₹{groupData.bookingId?.totalAmount || 0}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0">
            {isAdmin && (
              <Button size="sm" onClick={() => setIsAddMemberOpen(true)} className="gap-1">
                <UserPlus className="h-4 w-4" /> Add Member
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="text-xs gap-1 px-2 border  border-accent-foreground " onClick={() => navigate('/scoreboard')} >
              {isAdmin ? "Manage" : "View"} ScoreBoard
            </Button>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT SIDEBAR (Financials) --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* BALANCE CARD */}
            <Card className="bg-slate-900 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-slate-400 text-sm uppercase">Your Net Position</p>
                  
                  {settlementData ? (
                    <h2 className="text-4xl font-bold mt-2">
                      ₹{Math.abs(mySettlement?.remaining || 0)}
                      <span className={`text-base ml-2 px-2 py-1 rounded ${
                        mySettlement?.paymentStatus === 'paid' 
                          ? 'bg-green-500/20 text-green-200' 
                          : 'bg-red-500/20 text-red-200'
                      }`}>
                        {mySettlement?.paymentStatus === 'paid' ? "Settled" : "You Owe"}
                      </span>
                    </h2>
                  ) : (
                    <div className="mt-2 text-slate-400 text-sm italic">
                        {isAdmin ? "Settlement updating..." : "Waiting for Admin..."}
                    </div>
                  )}

                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setIsSettleOpen(true)} 
                    disabled={!settlementData || mySettlement?.paymentStatus === "paid"}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {mySettlement?.paymentStatus === "paid" ? "Paid" : "Settle Up"}
                  </Button>
                  {/* Optional Expense Button */}
                  <Button disabled className="w-full bg-slate-800 border border-slate-700 opacity-50">
                    <Plus className="h-4 w-4 mr-2" /> Expense
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* MEMBERS LIST */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Match Squad</CardTitle>
                <Badge variant="secondary">{groupData.bookingId?.groupMembers?.length || 0}</Badge>
              </CardHeader>
              <CardContent className="space-y-1">
                {/* We should map from Settlement Participants if available, 
                   fallback to Booking Members if not 
                */}
                {(settlementData?.settlement?.participants || groupData.bookingId?.groupMembers || []).map((member, idx) => {
                   // Handle data structure differences between Settlement Participant vs Booking Member
                   const isSettlementObj = !!member.user; 
                   const displayNick = isSettlementObj ? member.nickname : member.memberId?.nickname;
                   const displayId = isSettlementObj ? (member.user?._id || member.user) : member.memberId?._id;
                   const paymentStatus = isSettlementObj ? member.paymentStatus : 'pending';
                   
                   return (
                    <div key={idx} className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-slate-100 text-xs">
                            {getInitials(displayNick)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">{displayNick || "Unknown"}</p>
                            {displayId === groupData.admin?._id && (
                                <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            )}
                            </div>
                            {isSettlementObj && (
                                <p className={`text-xs ${paymentStatus === 'pending' ? 'text-red-500' : 'text-green-600'}`}>
                                    {paymentStatus === 'pending' ? 'Not Paid' : 'Paid'}
                                </p>
                            )}
                        </div>
                        </div>

                        {/* Actions for Admin */}
                        {isAdmin && displayId !== currentUserId && isSettlementObj && paymentStatus !== 'paid' && (
                           <Button
                                size="sm" variant="ghost" className="text-xs h-7"
                                onClick={() => sendReminder(displayId)}
                            >
                                Remind
                           </Button>
                        )}
                    </div>
                   );
                })}
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT SIDE (Feed) --- */}
          <div className="lg:col-span-8 space-y-6">
             {/* Simple Settlement Header */}
             {settlementData && (
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Payment Breakdown</h3>
                            <p className="text-slate-500 text-sm">Total Bill: ₹{settlementData.settlement.totalAmount}</p>
                        </div>
                        <Badge variant="outline" className="px-3 py-1">
                            {settlementData.settlement.settlementStatus.toUpperCase()}
                        </Badge>
                    </div>
                </div>
             )}

            {/* Transactions Feed */}
            <h3 className="text-sm font-bold text-slate-500 uppercase mt-4">Live Activity</h3>
            
            {(!settlementData || !settlementData.settlement.participants.some(p => p.transactions.length > 0)) && (
                <div className="text-center py-10 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No payments recorded yet.</p>
                </div>
            )}

            {settlementData?.settlement?.participants?.map((participant) =>
              participant.transactions.map((txn, idx) => (
                <motion.div
                  key={`${participant._id}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                      {txn.paymentMethod === 'Cash' ? '💵' : '📲'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {participant.nickname} <span className="font-normal text-slate-500">paid</span>
                      </h4>
                      <p className="text-xs text-slate-500">{new Date(txn.paidAt).toLocaleTimeString()} • {txn.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-green-600">+₹{txn.amount}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* --- ADD MEMBER MODAL --- */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add to Squad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Enter friend's nickname..." 
              value={newMemberNick}
              onChange={(e) => setNewMemberNick(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={inviteLoading || !newMemberNick}>
              {inviteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- SETTLE UP MODAL --- */}
      <Dialog open={isSettleOpen} onOpenChange={setIsSettleOpen}>
        <DialogContent className="sm:max-w-md">
          <AnimatePresence mode="wait">
            {settleStep === 'input' ? (
              <motion.div key="input" className="p-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Pay Your Share</h3>
                  <p className="text-sm text-slate-500">
                    Remaining: ₹{mySettlement?.remaining || 0}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="text-4xl font-bold text-slate-300">₹</span>
                  <Input 
                    type="number"
                    value={amountToPay}
                    onChange={(e) => setAmountToPay(e.target.value)}
                    placeholder={mySettlement?.remaining?.toString() || "0"}
                    className="text-center text-5xl font-black w-48 h-16 border-none shadow-none focus-visible:ring-0 placeholder:text-slate-200"
                  />
                </div>

                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-400 uppercase mb-3 block text-center">
                    Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["UPI", "Cash"].map((method) => (
                      <button
                        key={method}
                        onClick={() => setSettlePaymentMethod(method)}
                        className={`text-sm py-2 px-3 rounded-lg border transition-all ${
                          settlePaymentMethod === method
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={processPayment} 
                  size="lg" 
                  className="w-full font-bold"
                  disabled={!amountToPay || Number(amountToPay) <= 0}
                >
                  Confirm Payment
                </Button>
              </motion.div>
            ) : (
              <motion.div key="success" className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Paid!</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDashboard;