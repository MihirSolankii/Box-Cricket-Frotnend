import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Settings, Check, X, Wallet, Filter, Search, Calendar, Loader2, Ban, UserPlus, Crown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import axios from 'axios';
import AddExpenseModal from './AddExpenseModal';
import Headers from "../component/Headers";
import Footer from "../component/Footer";
import { routes } from '../../routes.js';

const GroupDashboard = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const token = localStorage.getItem('UserCricBoxToken');
  const currentUserId = localStorage.getItem('UserId');

  // --- STATE ---
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");
  
  // Modal States
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberNick, setNewMemberNick] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Settle Up Logic State
  const [settleStep, setSettleStep] = useState('input');
  const [amountToPay, setAmountToPay] = useState(0);
  
  // Expense modal
  const [open, setOpen] = useState(false);
  
  // Payment settlement logic
  const [paymentData, setPaymentData] = useState(null);
  const [settlementdata, setSettlementdata] = useState(null);

  // --- API CALLS ---
  
  // Create Settlement
  const createSettlement = async () => {
    try {
      const totalAmount = localStorage.getItem("totalAmount");
      const response = await axios.post(
        `${routes.createSettlement}`,
        { groupId, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentData(response.data.data);
      console.log("Settlement created:", response);
    } catch (error) {
      console.error("Settlement error:", error.response?.data || error.message);
      toast.error("Failed to create settlement");
    }
  };

  // Fetch Group Details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!token || !groupId) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          routes.groupDetail,
          { groupId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setGroupData(response.data.group);
          localStorage.setItem("totalAmount", response.data.group?.bookingId?.totalAmount);
          setAmountToPay(Math.abs(response.data.group.userBalance || 0));
          
          // Create settlement after fetching group
          await createSettlement();
        }
      } catch (error) {
        console.error("Fetch group error:", error);
        toast.error("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  // Fetch Settlement Details
  useEffect(() => {
    const fetchSettlementDetails = async () => {
      if (!token || !groupId) return;
      
      try {
        const response = await axios.get(
          `${routes.viewSettlement}/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Settlement details:", response.data);
        setSettlementdata(response.data);
      } catch (error) {
        console.error("Fetch settlement error:", error);
        toast.error("Failed to load settlement details");
      }
    };

    fetchSettlementDetails();
  }, [groupId, token]);

  // Fetch My Settlement Status
  useEffect(() => {
    const fetchMySettlement = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(
          `${routes.viewMySettlement}/${groupId}/my-status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("My settlement status:", response.data);
      } catch (error) {
        console.error("Fetch my settlement error:", error);
        toast.error("Failed to load your settlement status");
      }
    };

    fetchMySettlement();
  }, [groupId, token]);

  // Add Member (Admin)
  const handleAddMember = async () => {
    if (!newMemberNick.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    
    try {
      setInviteLoading(true);
      await axios.post(
        `${routes.inviteGroup}`,
        { groupId: groupId, nickname: newMemberNick },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Invite sent to ${newMemberNick}`);
      setIsAddMemberOpen(false);
      setNewMemberNick("");
      
      // Refresh group details
      const response = await axios.post(
        routes.groupDetail,
        { groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setGroupData(response.data.group);
      }
    } catch (error) {
      console.error("Add member error:", error);
      toast.error(error.response?.data?.message || "Failed to invite user");
    } finally {
      setInviteLoading(false);
    }
  };

  // Block/Remove Member (Admin)
  const handleBlockMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    
    try {
      await axios.post(
        `${routes.removeMember || 'https://box-cricket-backend-v7vh.onrender.com/api/group/remove-member'}`,
        { groupId: groupId, memberId: memberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Member removed successfully");
      
      // Update local state
      setGroupData(prev => ({
        ...prev,
        bookingId: {
          ...prev.bookingId,
          groupMembers: prev.bookingId.groupMembers.filter(m => m._id !== memberId)
        }
      }));
    } catch (error) {
      console.error("Remove member error:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  // Handle Join Requests (Admin)
  const handleRequestAction = async (reqId, action) => {
    try {
      await axios.post(
        `${routes.handleRequest || 'https://box-cricket-backend-v7vh.onrender.com/api/group/handle-request'}`,
        { groupId, requestId: reqId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Request ${action}ed successfully`);
      
      // Update local state
      setGroupData(prev => ({
        ...prev,
        requests: prev.requests.filter(r => r._id !== reqId)
      }));
      
      // If accepted, refresh group to show new member
      if (action === 'accept') {
        const response = await axios.post(
          routes.groupDetail,
          { groupId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setGroupData(response.data.group);
        }
      }
    } catch (error) {
      console.error("Handle request error:", error);
      toast.error(error.response?.data?.message || `Failed to ${action} request`);
    }
  };

  // Process Payment Settlement
  const processPayment = async () => {
    setSettleStep('processing');
    
    try {
      const response = await axios.post(
        `${routes.settlePayment || 'https://box-cricket-backend-v7vh.onrender.com/api/settlement/pay'}`,
        { groupId, amount: amountToPay },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTimeout(() => {
        setSettleStep('success');
        
        // Update local balance
        setGroupData(prev => ({ ...prev, userBalance: 0 }));
        
        toast.success("Payment settled successfully!");
      }, 1500);
      
      setTimeout(() => {
        setIsSettleOpen(false);
        setSettleStep('input');
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
      setSettleStep('input');
    }
  };

  // Helpers
  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "U";
  const isAdmin = groupData?.admin._id === currentUserId || false;

  // Debug logs
  useEffect(() => {
    console.log("Group data:", groupData);
    console.log("Is Admin:", isAdmin);
    console.log("Admin ID:", groupData?.admin._id);
    console.log("Current User ID:", currentUserId);
  }, [groupData, isAdmin, currentUserId]);

  useEffect(() => {
    console.log("Payment data:", paymentData);
  }, [paymentData]);

  useEffect(() => {
    console.log("Settlement data:", settlementdata);
  }, [settlementdata]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" />
          <p className="mt-4">Loading Pitch...</p>
        </div>
      </div>
    );
  }

  if (!groupData) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- HEADER --- */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/my-groups')}
                variant="ghost"
                size="icon"
                className="rounded-full hidden md:flex"
              >
                <ArrowLeft />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{groupData.name}</h1>
                  {isAdmin && <Badge variant="secondary">Admin View</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  Group • {groupData.description || "Cricket & Turf Bookings"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
              {isAdmin && (
                <Button onClick={() => setIsAddMemberOpen(true)}>
                  <UserPlus className="mr-2" />
                  Add Member
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT SIDEBAR --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* BALANCE CARD */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="w-5 h-5" />
                  Your Net Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  ₹{Math.abs(groupData.userBalance || 0)}
                </div>
                <div className={`text-sm font-semibold mb-4 ${groupData.userBalance < 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {groupData.userBalance < 0 ? "You Owe" : "You Get"}
                </div>
                <Button
                  onClick={() => setIsSettleOpen(true)}
                  disabled={!groupData.userBalance || groupData.userBalance >= 0}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100"
                >
                  💸 Settle Up Expense
                </Button>
              </CardContent>
            </Card>

            {/* MEMBERS WIDGET */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Members</span>
                  <Badge>{groupData.bookingId?.groupMembers?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Pending Requests (Admin Only) */}
                {isAdmin && groupData.requests && groupData.requests.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm font-semibold">Join Requests</span>
                    </div>
                    {groupData.requests.map((req) => (
                      <div key={req._id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{getInitials(req.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{req.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRequestAction(req._id, "reject")}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRequestAction(req._id, "accept")}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Member List */}
                <div className="space-y-3">
                  {groupData.bookingId?.groupMembers?.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(member.memberId?.nickname)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{member.memberId?.nickname}</span>
                            {member.role === 'admin' && <Crown className="w-4 h-4 text-amber-500" />}
                          </div>
                          <span className={`text-xs ${member.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {member.balance < 0 ? `Owes ₹${Math.abs(member.balance)}` : `Gets ₹${member.balance || 0}`}
                          </span>
                        </div>
                      </div>
                      {isAdmin && member._id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleBlockMember(member._id)}
                        >
                          <Ban className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- MAIN FEED --- */}
          <div className="lg:col-span-8">
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                  <TabsTrigger value="charts" className="flex-1">Charts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <Button onClick={() => setOpen(true)}>
                      <Plus className="mr-2" />
                      Add Expense
                    </Button>
                  </div>
                  
                  {groupData.expenses && groupData.expenses.length > 0 ? (
                    <div className="space-y-4">
                      {groupData.expenses.map((expense) => (
                        <div key={expense._id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50">
                          <div className="text-2xl">
                            {expense.category === 'Sport' ? '🏏' : '💸'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold">{expense.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {expense.category || "General"} • {expense.paidBy} paid ₹{expense.amount}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {expense.date || "Today"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No expenses recorded yet.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="charts" className="p-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Charts coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* --- MODAL: ADD MEMBER --- */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the unique nickname of the user you want to invite.
          </p>
          <Input
            placeholder="Enter nickname"
            value={newMemberNick}
            onChange={(e) => setNewMemberNick(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={inviteLoading}>
              {inviteLoading ? <Loader2 className="mr-2 animate-spin" /> : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: SETTLE UP --- */}
      <Dialog open={isSettleOpen} onOpenChange={setIsSettleOpen}>
        <DialogContent>
          {settleStep === 'input' ? (
            <>
              <DialogHeader>
                <DialogTitle>Settle Up</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Clear your dues</p>
              <div className="flex items-center justify-center my-6">
                <span className="text-2xl font-bold mr-2">₹</span>
                <Input
                  type="number"
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(e.target.value)}
                  className="text-center text-4xl font-bold w-40"
                />
              </div>
              <Button onClick={processPayment} className="w-full">
                Pay Now
              </Button>
            </>
          ) : settleStep === 'processing' ? (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold">Processing payment...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Check className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-2xl font-bold mb-2">Paid Successfully!</h3>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Expense Modal */}
      {open && <AddExpenseModal open={open} setOpen={setOpen} groupId={groupId} />}
    </div>
  );
};

export default GroupDashboard;