import React from 'react';
import { BookingWorkflow } from '../components/BookingWorkflow';
import { Phone, MapPin, Clock } from 'lucide-react';

interface BookingPageProps {
  onGoHome: () => void;
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  onGoHome,
  preselectedServiceId,
  preselectedDoctorId
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Online Appointment Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Schedule Your Dental Visit
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Select your required treatment, preferred dental surgeon, and an available appointment time slot at Durga Super Speciality Dental Hospital.
        </p>
      </div>

      {/* Booking Workflow Container */}
      <BookingWorkflow
        preselectedServiceId={preselectedServiceId}
        preselectedDoctorId={preselectedDoctorId}
        onFinished={onGoHome}
        onGoHome={onGoHome}
      />

      {/* Clinic Quick Details */}
      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Hospital Working Hours</p>
            <p>Mon – Sat: 09:30 AM – 01:30 PM & 04:30 PM – 08:30 PM</p>
            <p className="text-slate-400">Sunday: Closed</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Need Immediate Help?</p>
            <p>Call our hospital desk directly:</p>
            <a href="tel:09845344323" className="font-bold text-slate-900 hover:underline">
              098453 44323
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
