import React, { useState } from 'react';
import { api } from '../api';
import { Phone, Mail, MapPin, Clock, ExternalLink, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('General Dental Inquiry');
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitContact({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim(),
        subject,
        message: message.trim()
      });

      setStatusMessage({ type: 'success', text: res.message });
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to submit inquiry. Please call the clinic directly at 098453 44323.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Reach Our Clinic
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact & Location Details
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          We welcome your inquiries, appointment requests, and consultation questions. Reach out by phone, email, or visit our hospital premises in Chitradurga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              Hospital Information
            </h2>

            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Address & Landmark</p>
                  <p className="mt-0.5 leading-relaxed">
                    Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501
                  </p>
                  <a
                    href="https://maps.google.com/?q=Durga+Super+Speciality+Dental+Hospital+Holalkere+Road+Chitradurga+Karnataka+577501"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 mt-2"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <Phone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Telephone / Mobile</p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    <a href="tel:09845344323" className="hover:underline">
                      098453 44323
                    </a>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Direct reception and appointments desk</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Official Email</p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    <a href="mailto:drgovardhan@gmail.com" className="hover:underline">
                      drgovardhan@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Consultation Timings</p>
                  <p className="mt-0.5">Monday – Saturday:</p>
                  <p className="text-xs font-medium text-slate-700">Morning: 09:30 AM – 01:30 PM</p>
                  <p className="text-xs font-medium text-slate-700">Evening: 04:30 PM – 08:30 PM</p>
                  <p className="text-xs text-slate-400 mt-1">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Parking & Accessibility</h3>
            <p>
              Convenient road frontage along Holalkere Road. Suitable for two-wheeler and four-wheeler patient drop-off and local parking.
            </p>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                Direct Communication
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Send an Inquiry to the Clinic
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Have a question about a treatment, appointment reschedule, or dental concern? Send us a message and our staff will respond.
              </p>
            </div>

            {statusMessage && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm ${
                  statusMessage.type === 'success'
                    ? 'bg-teal-50 border border-teal-200 text-teal-900'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Optional email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Subject / Concern
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="General Dental Inquiry">General Dental Inquiry</option>
                    <option value="Appointment Query">Appointment Query</option>
                    <option value="Root Canal Consultation">Root Canal Consultation</option>
                    <option value="Dental Implants & Replacement">Dental Implants & Replacement</option>
                    <option value="Orthodontic Braces">Orthodontic Braces</option>
                    <option value="Children Dental Care">Children's Dental Care</option>
                    <option value="Other Medical Inquiry">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Message / Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our dental team assist you? Please mention your dental symptoms or preferred visit timeframe..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  For immediate emergency pain assistance, please call 098453 44323.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 text-teal-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
