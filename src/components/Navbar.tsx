import React, { useState } from 'react';
import { Menu, X, Shield, Phone, Calendar } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
  onOpenBooking: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenBooking,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-slate-800 transition-colors shrink-0">
              <span className="tracking-tighter">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Durga Super Speciality Dental Hospital
              </span>
              <span className="text-xs text-slate-500 font-normal">
                Chitradurga, Karnataka
              </span>
            </div>
          </button>

          {/* Zone 2: 4-7 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors hover:text-slate-900 cursor-pointer pb-1 relative ${
                  currentTab === link.id
                    ? 'text-slate-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('faq')}
              className={`transition-colors hover:text-slate-900 cursor-pointer pb-1 relative ${
                currentTab === 'faq'
                  ? 'text-slate-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                  : ''
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Hospital Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-2 border-b border-slate-100 mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Navigation</p>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-slate-100 text-slate-950 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('faq');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            FAQ & Patient Information
          </button>
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Admin Dashboard</span>
          </button>

          <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
            <a
              href="tel:09845344323"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Call 098453 44323</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-800"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book Appointment Online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
