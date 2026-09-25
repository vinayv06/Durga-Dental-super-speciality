import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { api } from '../api';
import { Calendar, Phone, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

interface DoctorsPageProps {
  onOpenBooking: (serviceId?: string, doctorId?: string) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ onOpenBooking }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Clinical Specialists
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Our Dental Surgeons
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Meet the verified dental surgeons at Durga Super Speciality Dental Hospital. Dedicated to conservative, sterile, and patient-first dentistry in Chitradurga.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-5 aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="sm:col-span-7 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Verified Dental Surgeon</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {doc.name}
                  </h2>
                  <p className="text-xs font-bold text-teal-700">
                    Qualification: {doc.qualification}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {doc.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Professional Profile
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              {/* Consultation Sessions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Days of Practice:</span>
                  <span>Monday – Saturday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Morning Consultation:</span>
                  <span>09:30 AM – 01:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Evening Consultation:</span>
                  <span>04:30 PM – 08:30 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => onOpenBooking(undefined, doc.id)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Book Appointment with {doc.name.split(' ')[1]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Information Card */}
      <div className="p-6 rounded-3xl bg-teal-50/50 border border-teal-100 text-center max-w-2xl mx-auto space-y-3">
        <h3 className="font-bold text-slate-900 text-base">
          Direct Consultations by Prior Appointment
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          To maintain zero waiting time and strict sterilization of operatories between patients, all appointments are scheduled and confirmed directly. You can also reach our desk at <a href="tel:09845344323" className="font-semibold text-slate-900 underline">098453 44323</a>.
        </p>
      </div>
    </div>
  );
};
