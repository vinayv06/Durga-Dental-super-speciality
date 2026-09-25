import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface MobileActionBarProps {
  onOpenBooking: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-lg">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <a
          href="tel:09845344323"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 font-medium text-xs bg-slate-50 active:bg-slate-100"
        >
          <Phone className="w-3.5 h-3.5 text-teal-600" />
          <span>Call Hospital</span>
        </a>
        <button
          onClick={onOpenBooking}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 active:bg-slate-950 text-white font-medium text-xs shadow-sm cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
};
