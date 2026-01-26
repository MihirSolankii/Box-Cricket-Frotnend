import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  Crown, 
  User, 
  Wallet, 
  ChevronRight, 
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { routes } from "../../routes.js";

const MyGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("UserCricBoxToken");

  

  // --- API CALL: GET MY GROUPS ---
  useEffect(() => {
    const fetchMyGroups = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await axios.get(`${routes.mygroup}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("fetch the group detail::::",response.data);

        localStorage.setItem("GroupId",response.data._id)
        
        if (response.data) {
          setGroups(response.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error("Failed to load your groups");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGroups();
  }, [token]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(()=>{
   console.log(groups);
   
  },[groups])

  return (
    <div className="min-h-screen w-full bg-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold tracking-tight">My Groups</h1>
              <p className="text-muted-foreground text-sm">
                Access and manage your squads
              </p>
            </div>
          </div>
          
          <Button size="icon" variant="outline" className="rounded-full" onClick={() => navigate('/create-group')}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
             <div className="bg-muted p-4 rounded-full inline-flex mb-3">
                <Users className="h-6 w-6 text-muted-foreground" />
             </div>
             <h3 className="font-semibold">No Groups Found</h3>
             <p className="text-sm text-muted-foreground mt-1 mb-4">You haven't joined any groups yet.</p>
             <Button onClick={() => navigate('/create-group')}>Create One</Button>
          </div>
        ) : (
          <motion.div 
            className="grid gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {groups.map((group) => (
              <motion.div key={group._id} variants={item}>
                {/* UX NOTE: We assume clicking this card goes to the Dashboard.
                   The Dashboard component will then call 'get-group-detail' using the ID in the URL.
                */}
                <Link to={`/group/${group._id}`}>
                  <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                    <CardContent className="p-5 flex items-center justify-between">
                      
                      {/* Left Side: Info */}
                      <div className="flex gap-4 items-center">
                        <div className={`p-3 rounded-full ${group.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Users className="h-6 w-6" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-lg leading-none">
                              {group.name}
                            </h2>
                            {group.role === "admin" ? (
                              <Badge variant="default" className="text-[10px] px-1.5 h-5 gap-1">
                                <Crown className="w-3 h-3" /> Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] px-1.5 h-5 gap-1 text-muted-foreground">
                                <User className="w-3 h-3" /> Member
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" /> {group.members?.length || 0} Members
                            </span>
                            {/* You can add Total Amount here if your API returns it */}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Action Arrow */}
                      <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                        <ChevronRight className="h-6 w-6" />
                      </div>

                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyGroups;