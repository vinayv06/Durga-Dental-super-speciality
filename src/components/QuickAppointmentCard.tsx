import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Service, Doctor, Appointment } from '../types';
import { Calendar, Clock, Phone, User, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface QuickAppointmentCardProps {
  onSuccess: (appointment: Appointment) => void;
}

export const QuickAppointmentCard: React.FC<QuickAppointmentCardProps> = ({ onSuccess }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form Fields
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState<string>(todayStr);
  const [appointmentTime, setAppointmentTime] = useState<string>('10:30 AM');
  const [isNewPatient, setIsNewPatient] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const [svcs, docs] = await Promise.all([api.getServices(), api.getDoctors()]);
        setServices(svcs);
        setDoctors(docs);
        if (svcs.length > 0) setServiceId(svcs[0].id);
        if (docs.length > 0) setDoctorId(docs[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmittedMessage(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createAppointment({
        patientName: patientName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        serviceId,
        doctorId,
        appointmentDate,
        appointmentTime,
        isNewPatient,
        reason: message.trim() || 'Dental Appointment Request',
        notes: ''
      });

      if (res.success && res.appointment) {
        setSubmittedMessage(
          'Thank you. Your appointment request has been received. Our clinic team will contact you to confirm your appointment.'
        );
        onSuccess(res.appointment);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to submit request. Please try again or call 098453 44323.');
    } finally {
      setSubmitting(false);
    }
  };

  const timeOptions = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl shadow-slate-100/50">
      <div className="mb-6">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
          Fast & Convenient Booking
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Your Healthier Smile Starts Here
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Submit your preferred time and dental concerns. Our desk coordinates directly with you.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submittedMessage ? (
        <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-base">Request Received</span>
          </div>
          <p className="text-sm leading-relaxed">{submittedMessage}</p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedMessage(null);
                setPatientName('');
                setPhone('');
                setEmail('');
                setMessage('');
              }}
              className="text-xs font-semibold text-teal-800 underline hover:text-teal-950 cursor-pointer"
            >
              Book another appointment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Optional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                min={todayStr}
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Time *
              </label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Treatment / Reason */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Treatment / Service *
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Consulting Doctor */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Doctor Preference
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.qualification})
                  </option>
                ))}
              </select>
            </div>

            {/* New / Existing Patient */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Patient Record
              </label>
              <div className="grid grid-cols-2 gap-2 h-[42px]">
                <button
                  type="button"
                  onClick={() => setIsNewPatient(true)}
                  className={`rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                    isNewPatient
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  New Patient
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPatient(false)}
                  className={`rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                    !isNewPatient
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Existing
                </button>
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Additional Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Specific symptoms or concerns..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              * Slots are subject to clinical confirmation. Emergency patients may call 098453 44323 directly.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Request Appointment</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
