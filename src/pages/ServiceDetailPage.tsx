import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { api } from '../api';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  HelpCircle,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  onBack: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  onBack,
  onOpenBooking
}) => {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getService(slug);
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 text-sm">Loading treatment details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Treatment Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested dental service details could not be located.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium"
        >
          Return to All Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Dental Treatments</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-teal-700">{service.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Approx. {service.durationMinutes} minutes</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {service.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          {service.shortDescription}
        </p>

        {/* Responsible Medical Note */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs sm:text-sm text-teal-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <p>
            Your dentist can assess whether this treatment is appropriate for you during your comprehensive clinical evaluation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={() => onOpenBooking(service.id)}
            className="px-7 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Book Appointment for This Treatment</span>
          </button>
          <a
            href="tel:09845344323"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm flex items-center justify-center gap-2 text-center"
          >
            <Phone className="w-4 h-4 text-slate-500" />
            <span>Call 098453 44323</span>
          </a>
        </div>
      </div>

      {/* Grid: Who Needs It & What It Involves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Who may need it */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Who May Need This Treatment
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {service.whoNeedsIt}
          </p>
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Key Clinical Benefits
            </h3>
            <ul className="space-y-2.5">
              {service.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What the treatment involves */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            What The Treatment Involves
          </h2>
          <p className="text-xs text-slate-500">
            Standard clinical stages carried out by your dental surgeon:
          </p>
          <ol className="space-y-3 pt-1">
            {service.whatItInvolves.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready to Consult About {service.name}?
        </h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Visit Durga Super Speciality Dental Hospital on Holalkere Road in Chitradurga. Our dentists will examine your teeth and address all your questions.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenBooking(service.id)}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Book Appointment Online
          </button>
          <a
            href="tel:09845344323"
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-slate-700 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Call 098453 44323
          </a>
        </div>
      </div>
    </div>
  );
};
