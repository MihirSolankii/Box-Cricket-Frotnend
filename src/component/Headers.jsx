import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import axios from 'axios';
import { routes } from '../../routes.js'; // Ensure this path is correct

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("UserCricBoxToken");


  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    const fetchNotifications = async () => {
      // Logic: Only fetch if logged in and token exists
      if (!isLoggedIn || !token) return;
      console.log(routes.mygroup);
      

      try {
        const response = await axios.get(`${routes.mygroup}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        }); 
        
        console.log(response);
        
        if (response.status === 200 && response.data) {
          setMyGroups(response.data || []);
          setPendingInvites(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        console.log(error);
        
        setMyGroups([]);
        setPendingInvites([]);
      }
    };

    fetchNotifications(); 
    //this is pooling part 
    // const interval = setInterval(fetchNotifications, 30000); // Poll every 30s

    // return () => clearInterval(interval);
  }, [isLoggedIn, token]);

  
  const inviteCount = pendingInvites?.reduce(
    (sum, group) =>
      sum + (group.invites?.filter((i) => i.status === "pending").length || 0),
    0
  );

  
  const handleLogout = () => {
    localStorage.removeItem("UserCricBoxToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("UserId");
    localStorage.removeItem("userNickname");
    setIsLoggedIn(false);
    setPendingInvites([]);
    setMyGroups([]);
    navigate('/'); 
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'Score Card', href: '/scorecard' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href.split('#')[0]);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2 bg-background/70 backdrop-blur-md border-b border-border/40 shadow-sm'
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:shadow-primary/30"
            >
              <span className="text-primary-foreground font-bold text-lg">CB</span>
            </motion.div>
            <span className="font-bold text-xl text-foreground hidden sm:block tracking-tight">
              Cricket Box
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative py-1 transition-colors duration-200 font-medium text-muted-foreground hover:text-foreground"
              >
                {link.name}
                {/* {isActive(link.href) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                  />
                )} */}
              </Link>
            ))}

            {/* Groups Dropdown (Only if Logged In) */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative py-1 transition-colors duration-200 font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Groups
                    {inviteCount > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                        {inviteCount}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 backdrop-blur-lg bg-background/95">
                  <DropdownMenuLabel>My Groups</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/my-groups')}>
                    <Users className="w-4 h-4 mr-2" />
                    View All Groups ({myGroups.length})
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="flex items-center justify-between">
                    Pending Invites
                    {inviteCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                            {inviteCount}
                        </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/invitations')}>
                    <Bell className="w-4 h-4 mr-2" />
                    View All Invitations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            
            {/* Register Venue Button */}
            <Button
              onClick={() => navigate('/register-venue')}
              className="hidden md:flex bg-red-500 hover:bg-red-600 px-6 hover:scale-105 active:scale-95 transition-transform"
            >
              Register Your Venue
            </Button>

            {/* LOGIC CHANGE: User Menu OR Login Button */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full overflow-hidden hover:border-primary transition-colors"
                  >
                    {/* Placeholder Profile Picture */}
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-lg bg-background/95">
                  <DropdownMenuItem onClick={() => navigate('/profile-section')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/my-groups')}>
                    <Users className="h-4 w-4 mr-2" />
                    My Groups ({myGroups.length})
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/invitations')}>
                    <Bell className="h-4 w-4 mr-2" />
                    Invitations
                    {inviteCount > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {inviteCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/signup')}
                className="hidden sm:flex px-6 hover:scale-105 active:scale-95 transition-transform"
              >
                Login / Sign Up
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden flex flex-col gap-1 mt-4 border-t border-border/40 pt-4"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-3 px-4 rounded-xl transition-all ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Groups Section (Only if Logged In) */}
              {isLoggedIn && (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      to="/my-groups"
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        My Groups
                      </span>
                      <Badge variant="outline">{myGroups.length}</Badge>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (navLinks.length + 1) * 0.05 }}
                  >
                    <Link
                      to="/invitations"
                      className="flex items-center justify-between py-3 px-4 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Invitations
                      </span>
                      {inviteCount > 0 && (
                        <Badge variant="destructive">{inviteCount}</Badge>
                      )}
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Mobile Login Button (Only if NOT Logged In) */}
              {!isLoggedIn && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2"
                >
                  <Button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Login / Sign Up
                  </Button>
                </motion.div>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;