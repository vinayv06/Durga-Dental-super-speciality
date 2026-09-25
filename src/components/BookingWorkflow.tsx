import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Service, Doctor, Appointment, AvailabilityResponse } from '../types';
import { AppointmentConfirmation } from './AppointmentConfirmation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';

interface BookingWorkflowProps {
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
  onFinished?: () => void;
  onGoHome?: () => void;
}

export const BookingWorkflow: React.FC<BookingWorkflowProps> = ({
  preselectedServiceId,
  preselectedDoctorId,
  onFinished,
  onGoHome
}) => {
  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  
  // Date calculation: minimum today
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Patient Info
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isNewPatient, setIsNewPatient] = useState<boolean>(true);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Availability State
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Completed Appointment
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load initial services & doctors
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [servicesData, doctorsData] = await Promise.all([
          api.getServices(),
          api.getDoctors()
        ]);
        setServices(servicesData);
        setDoctors(doctorsData);

        if (!selectedServiceId && servicesData.length > 0) {
          setSelectedServiceId(servicesData[0].id);
        }
        if (!selectedDoctorId && doctorsData.length > 0) {
          setSelectedDoctorId(doctorsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update preselected props if changed
  useEffect(() => {
    if (preselectedServiceId) setSelectedServiceId(preselectedServiceId);
    if (preselectedDoctorId) setSelectedDoctorId(preselectedDoctorId);
  }, [preselectedServiceId, preselectedDoctorId]);

  // Fetch availability whenever selectedDate or selectedDoctorId changes
  useEffect(() => {
    if (!selectedDate || !selectedDoctorId) return;

    let isMounted = true;
    async function fetchSlots() {
      try {
        setLoadingSlots(true);
        const res = await api.getAvailability(selectedDate, selectedDoctorId);
        if (isMounted) {
          setAvailability(res);
          // If current selectedTime is now unavailable, reset it
          const currentSlot = res.slots.find((s) => s.time === selectedTime);
          if (!currentSlot || !currentSlot.isAvailable) {
            setSelectedTime('');
          }
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedDoctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!selectedServiceId || !selectedDoctorId || !selectedDate || !selectedTime) {
      setErrorMessage('Please select a service, doctor, date, and available time slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createAppointment({
        patientName: patientName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        serviceId: selectedServiceId,
        doctorId: selectedDoctorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        isNewPatient,
        reason: reason.trim() || 'Dental Consultation',
        notes: notes.trim()
      });

      if (res.success && res.appointment) {
        setConfirmedAppointment(res.appointment);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit appointment. Please try again or call the clinic.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedAppointment) {
    return (
      <AppointmentConfirmation
        appointment={confirmedAppointment}
        onClose={() => {
          if (onFinished) onFinished();
        }}
        onGoHome={() => {
          if (onGoHome) onGoHome();
          else if (onFinished) onFinished();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading appointment scheduler...</p>
      </div>
    );
  }

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto border border-slate-200 shadow-xl">
      {/* Wizard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
            Step {step} of 3
          </span>
          <span className="text-xs text-slate-500">
            {step === 1 && 'Service & Doctor'}
            {step === 2 && 'Date & Time Slot'}
            {step === 3 && 'Patient Details'}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-slate-900 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Step 1: Select Service & Doctor */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Select Dental Treatment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Choose the primary reason or treatment for your visit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {services.map((svc) => {
                const isSelected = selectedServiceId === svc.id;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                        isSelected ? 'bg-slate-800 text-teal-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs leading-snug line-clamp-1">
                        {svc.name}
                      </p>
                      <p
                        className={`text-[11px] line-clamp-2 mt-0.5 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {svc.shortDescription}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Select Dental Surgeon
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Both doctors are verified BDS professionals at Durga Dental Hospital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs leading-tight">{doc.name}</p>
                      <p
                        className={`text-[11px] font-medium ${
                          isSelected ? 'text-teal-400' : 'text-teal-700'
                        }`}
                      >
                        {doc.qualification} · {doc.specialization.split('&')[0]}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (!selectedServiceId) {
                  setErrorMessage('Please select a dental treatment.');
                  return;
                }
                if (!selectedDoctorId) {
                  setErrorMessage('Please select a doctor.');
                  return;
                }
                setErrorMessage(null);
                setStep(2);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continue to Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Available Slots */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">Service:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-none">
                {selectedService?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500">Doctor:</span>
              <span className="font-semibold text-slate-900">{selectedDoctor?.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Preferred Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Clinic is open Monday to Saturday (Morning & Evening sessions). Sundays are closed.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Available Time Slot
              </label>
              {loadingSlots && (
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  Checking real-time slots...
                </span>
              )}
            </div>

            {availability && !availability.isOpenDay && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                The clinic is closed on this day. Please select a day from Monday to Saturday.
              </div>
            )}

            {availability && availability.isBlockedDate && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                The clinic has designated this date as a holiday or maintenance day. Please pick another date.
              </div>
            )}

            {availability && availability.isOpenDay && !availability.isBlockedDate && (
              <div className="space-y-4">
                {/* Morning Slots */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Morning Session (09:30 AM – 01:30 PM)</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availability.slots
                      .filter((s) => s.time.includes('AM') || s.time === '12:00 PM' || s.time === '12:30 PM' || s.time === '01:00 PM')
                      .map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                              !slot.isAvailable
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm cursor-pointer'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                            }`}
                            title={slot.reason || 'Available Slot'}
                          >
                            <span>{slot.time}</span>
                            {!slot.isAvailable && slot.reason && (
                              <span className="block text-[10px] font-normal no-underline text-slate-400">
                                ({slot.reason})
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Evening Slots */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Evening Session (04:30 PM – 08:30 PM)</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availability.slots
                      .filter((s) => s.time.includes('PM') && s.time !== '12:00 PM' && s.time !== '12:30 PM' && s.time !== '01:00 PM')
                      .map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                              !slot.isAvailable
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm cursor-pointer'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                            }`}
                            title={slot.reason || 'Available Slot'}
                          >
                            <span>{slot.time}</span>
                            {!slot.isAvailable && slot.reason && (
                              <span className="block text-[10px] font-normal no-underline text-slate-400">
                                ({slot.reason})
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setStep(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedDate) {
                  setErrorMessage('Please pick an appointment date.');
                  return;
                }
                if (!selectedTime) {
                  setErrorMessage('Please select an available time slot.');
                  return;
                }
                setErrorMessage(null);
                setStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continue to Patient Info</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Patient Information & Final Confirmation */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block mb-0.5">Treatment</span>
              <span className="font-semibold text-slate-900">{selectedService?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Doctor</span>
              <span className="font-semibold text-slate-900">{selectedDoctor?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date</span>
              <span className="font-semibold text-slate-900">{selectedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Time</span>
              <span className="font-semibold text-slate-900">{selectedTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 098453 44323"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Type
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsNewPatient(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                    isNewPatient
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  New Patient
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPatient(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-colors cursor-pointer ${
                    !isNewPatient
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Existing Patient
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Visit / Symptoms (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sharp pain while chewing, routine cleanup, or dental checkup..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-900 flex items-start gap-2">
            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Your appointment request will be logged with a unique reference number. Our clinic staff will review and contact you to confirm before your arrival.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setErrorMessage(null);
                setStep(2);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Processing Request...</span>
                </>
              ) : (
                <span>Request Appointment</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
