import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Calendar, Wallet, Inbox, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { routes } from "../../routes.js";

const Invitations = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("UserCricBoxToken");

 
  useEffect(() => {
    const fetchInvites = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${routes.invitations}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data);
        
        if (response.data.success) {
          setInvites(response.data.invites);
          // console.log(response.data.invites._id);
          
         
        }
      } catch (error) {
        console.error("Error fetching invites", error);
        toast.error("Failed to load invitations");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, [token]);


  const handleAction = async (groupId, action) => {
    try {
      setInvites((prev) => prev.filter((invite) => invite._id !== groupId));

     
      if (action === "accepted") {
        const response= await axios.post(
          `${routes.acceptinvite}`,
          { groupId: groupId  },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Group Joined!");
        console.log("invite accepted ",response);
        
          navigate(`/group/${response.data.group._id}`)
      } else {
       
        toast.info("Invite declined");
      }
    } catch (error) {
        console.error("Action failed", error);
        toast.error("Something went wrong");
       
    }
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : "GR";

  return (
    <div className="min-h-screen w-full bg-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
              <p className="text-muted-foreground text-sm">Manage pending requests</p>
            </div>
          </div>
          <Badge variant="secondary">{invites.length} Pending</Badge>
        </div>

        {/* Content */}
        <div className="grid gap-4">
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : (
            <AnimatePresence mode="popLayout">
              {invites.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-background/50">
                  <div className="bg-muted p-4 rounded-full mb-3">
                    <Inbox className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">No pending invitations.</p>
                </motion.div>
              ) : (
                invites.map((invite) => (
                  <motion.div
                    key={invite._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden shadow-sm border-l-4 border-l-primary">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="font-semibold text-lg">{invite.groupName}</h2>
                            <p className="text-xs text-muted-foreground">ID: {invite._id}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                          <Avatar className="h-8 w-8 border border-background">
                            <AvatarFallback>{getInitials(invite.invitedBy)}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <span className="font-medium">{invite.invitedBy}</span>
                            <span className="text-muted-foreground ml-1">(@{invite.invitedByNickname}) invited you</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-muted/10 p-3 grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:text-destructive"
                          onClick={() => handleAction(invite._id, "rejected")}
                        >
                          <X className="w-4 h-4 mr-2" /> Decline
                        </Button>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleAction(invite._id, "accepted")}
                        >
                          <Check className="w-4 h-4 mr-2" /> Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;