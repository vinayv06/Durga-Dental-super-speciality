import React from 'react';
import { Appointment } from '../types';
import { CheckCircle2, Phone, MapPin, ArrowLeft, Calendar, User, Clock, FileText, Printer } from 'lucide-react';

interface AppointmentConfirmationProps {
  appointment: Appointment;
  onClose: () => void;
  onGoHome: () => void;
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  appointment,
  onClose,
  onGoHome
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-slate-200 shadow-xl">
      {/* Top Header Badge */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-100">
        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Appointment Request Received
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Thank you, <span className="font-semibold text-slate-900">{appointment.patientName}</span>. Your appointment request has been logged in our clinic management system. Our team will contact you shortly to confirm the slot.
        </p>
      </div>

      {/* Reference & Status */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
            Reference Number
          </span>
          <span className="text-lg font-bold font-mono text-slate-900 tracking-wider">
            {appointment.referenceNumber}
          </span>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider block mb-1">
            Current Status
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-base font-semibold text-amber-900">
              {appointment.status === 'Pending' ? 'Pending Confirmation' : appointment.status}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Summary Box */}
      <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 space-y-4 mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Appointment Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Requested Date</p>
              <p className="font-semibold text-slate-900">
                {new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Preferred Slot</p>
              <p className="font-semibold text-slate-900">{appointment.appointmentTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Consulting Doctor</p>
              <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Requested Treatment</p>
              <p className="font-semibold text-slate-900">{appointment.serviceName}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/70 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Phone: {appointment.phone}</span>
          {appointment.email && <span>Email: {appointment.email}</span>}
        </div>
      </div>

      {/* Hospital Location Alert */}
      <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 flex items-start gap-3 mb-8 text-xs sm:text-sm text-teal-900">
        <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Hospital Location:</span> Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <a
          href="tel:09845344323"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-center"
        >
          <Phone className="w-4 h-4 text-teal-400" />
          <span>Call Clinic: 098453 44323</span>
        </a>

        <a
          href="https://maps.google.com/?q=Durga+Super+Speciality+Dental+Hospital+Holalkere+Road+Chitradurga+Karnataka+577501"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-teal-300 text-teal-800 bg-teal-50/60 font-medium text-sm hover:bg-teal-100/70 transition-colors flex items-center justify-center gap-2 text-center"
        >
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>Get Directions</span>
        </a>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          title="Print Summary"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Print</span>
        </button>
      </div>
    </div>
  );
};
