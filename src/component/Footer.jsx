import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Turfs', href: '/turfs' },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'How It Works', href: '/#how-it-works' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
  <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container-main">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
         <div className="md:col-span-2 pl-10 md:pl-8"> 
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">CB</span>
              </div>
              <span className="font-bold text-xl">Cricket Box</span>
            </Link>
            <p className="text-background/70 mb-4 max-w-sm">
              Book the best box cricket turfs near you. Instant booking, best prices, 
              and hassle-free experience.
            </p>
            <div className="flex gap-4 md:col-span-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="h-5 w-5" />
                <span>hello@cricketbox.in</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-5 w-5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2 text-background/70">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/20 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Cricket Box. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;