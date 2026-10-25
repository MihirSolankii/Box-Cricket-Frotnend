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
    <footer className="bg-slate-50 text-slate-700 pt-16 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2"> 
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">CB</span>
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Cricket Box</span>
            </Link>
            <p className="text-slate-500 mb-5 max-w-sm text-sm leading-relaxed">
              Book the best box cricket turfs near you. Instant booking, transparent pricing, 
              and hassle-free slot confirmation with your squad.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-xs"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-600">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>hello@cricketbox.in</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-600">
                <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Cricket Box. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;