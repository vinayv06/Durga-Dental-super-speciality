import React from 'react';
import { Calendar, Phone, MapPin, ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          About Durga Dental Hospital
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Compassionate Dental Care, Backed by Modern Dentistry
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Providing comprehensive, patient-centred oral healthcare in Chitradurga, Karnataka, with modern dental clinical equipment and verified dental professionals.
        </p>
      </div>

      {/* Large Clinic Photo */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-16/9 bg-slate-100 relative">
        <img
          src="/src/assets/images/clinic_reception_lounge_1790342753666.jpg"
          alt="Durga Super Speciality Dental Hospital Interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/70 backdrop-blur-md text-white border border-white/10 max-w-xl">
          <p className="font-semibold text-sm">Durga Super Speciality Dental Hospital</p>
          <p className="text-xs text-slate-300 mt-0.5">
            Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501
          </p>
        </div>
      </div>

      {/* Clinic Philosophy & Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Our Treatment Philosophy
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            At Durga Super Speciality Dental Hospital, we believe dental treatment should never be intimidating or rushed. Our primary goal is to preserve natural teeth wherever possible through preventive care and conservative endodontics, while offering advanced restorative options when replacement is essential.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every clinical decision is discussed openly with you: our dentists carefully evaluate your teeth, gums, and oral biomechanics, explaining the diagnostics and recommending personalized care paths without unnecessary procedures.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Schedule a Clinical Consultation</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Patient-First Commitments</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Hospital-Grade Sterilization</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Autoclaved instruments, single-use disposables, and chemical operatory sanitization between every single patient.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Comfortable Patient Experience</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Profound local anesthesia, gentle chairside care, and empathetic handling of anxious adults or younger children.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Modern Clinical Diagnostics</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Rotary endodontics, apex locators, intraoral digital imaging, and high-strength aesthetic restorative materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Location & Access */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>Strategic Location</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Situated on Holalkere Road, right near Neelakanteshwara Temple. Easy landmark access for residents across Chitradurga and surrounding taluks.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Activity className="w-4 h-4" />
            <span>Scheduled Clinic Sessions</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Morning (09:30 AM – 01:30 PM) and Evening (04:30 PM – 08:30 PM) sessions to accommodate working professionals and families.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Phone className="w-4 h-4" />
            <span>Direct Reception Desk</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Call <a href="tel:09845344323" className="font-semibold text-slate-900 underline">098453 44323</a> for inquiries, directions, or urgent appointments.
          </p>
        </div>
      </div>
    </div>
  );
};
