import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-lg border border-slate-700">
                <span>D</span>
              </div>
              <span className="font-bold text-white text-base leading-snug">
                Durga Super Speciality Dental Hospital
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Comprehensive dental care for healthier teeth, confident smiles, and a more comfortable patient experience in Chitradurga.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <p>Chitradurga, Karnataka – 577501</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Hospital Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About the Clinic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Dental Treatments & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Our Dental Surgeons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clinic Facility & Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Patient Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Book Appointment Online</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact & Address
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <span>
                  Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:09845344323" className="hover:text-white transition-colors">
                  098453 44323
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:drgovardhan@gmail.com" className="hover:text-white transition-colors">
                  drgovardhan@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Durga+Super+Speciality+Dental+Hospital+Holalkere+Road+Chitradurga+Karnataka+577501"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  <span>View on Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Working Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Working Hours
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Monday – Saturday</p>
                  <p className="text-xs text-slate-400">Morning: 09:30 AM – 01:30 PM</p>
                  <p className="text-xs text-slate-400">Evening: 04:30 PM – 08:30 PM</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <p className="font-medium text-slate-200">Sunday</p>
                <p className="text-xs text-slate-400">Closed (or by scheduled appointment)</p>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => onNavigate('legal')}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Appointment & Clinic Policies
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Durga Super Speciality Dental Hospital. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-slate-400 transition-colors">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
