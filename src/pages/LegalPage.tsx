import React from 'react';
import { ShieldCheck, FileText, Clock, AlertTriangle } from 'lucide-react';

export const LegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Hospital Policies & Patient Privacy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Terms
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Important guidelines regarding your appointment scheduling, medical data confidentiality, and clinic policies at Durga Super Speciality Dental Hospital.
        </p>
      </div>

      {/* Appointment Policy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Clock className="w-5 h-5 text-teal-600" />
          <h2>Appointment Scheduling & Confirmation Policy</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            1. <strong className="text-slate-900">Request vs. Confirmed Slot:</strong> Submitting an appointment online registers a booking request in our clinic database. The appointment is officially confirmed after our clinic reception verifies doctor operatory availability and contacts you via phone call or SMS/email.
          </p>
          <p>
            2. <strong className="text-slate-900">Punctuality:</strong> To maintain strict hygiene intervals and zero waiting queues, patients are requested to arrive 10 minutes prior to their confirmed time slot.
          </p>
          <p>
            3. <strong className="text-slate-900">Rescheduling or Cancellations:</strong> If you are unable to attend your scheduled visit, please notify us at least 3 hours in advance by calling <a href="tel:09845344323" className="font-semibold text-slate-900 underline">098453 44323</a> so the operatory time can be allocated to an emergency patient.
          </p>
          <p>
            4. <strong className="text-slate-900">Emergency Priority:</strong> Patients with acute facial trauma, severe bleeding, or intractable tooth infections may occasionally require immediate emergency intervention, which might cause minor delays to routine consults. We appreciate your understanding.
          </p>
        </div>
      </div>

      {/* Patient Privacy Policy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h2>Patient Health Information & Data Privacy</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            1. <strong className="text-slate-900">Confidentiality:</strong> Durga Super Speciality Dental Hospital respects patient medical privacy. Any contact details, oral health histories, radiographs, and clinical notes collected through our appointment portal or during clinical evaluations are stored securely and never shared with third-party marketing companies.
          </p>
          <p>
            2. <strong className="text-slate-900">Use of Information:</strong> Contact details (phone numbers and emails) are strictly utilized to coordinate appointments, send reminders, or discuss treatment plans.
          </p>
          <p>
            3. <strong className="text-slate-900">Consent for Clinical Records:</strong> Diagnostic photographs or radiographs are taken solely for treatment monitoring and diagnostics. Identifiable clinical images are never published publicly without explicit written patient authorization.
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2>Clinical Information Disclaimer</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The procedural descriptions, articles, and frequently asked questions on this website are provided for patient educational purposes only. They do not constitute formal medical diagnoses or clinical guarantees. Treatment feasibility, material suitability, and healing durations depend entirely on individualized clinical examination and biological factors assessed by your qualified BDS dental surgeon.
        </p>
      </div>
    </div>
  );
};
