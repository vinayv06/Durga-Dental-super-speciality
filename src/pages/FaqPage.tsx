import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Phone, HelpCircle } from 'lucide-react';

interface FaqPageProps {
  onOpenBooking: () => void;
}

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenBooking }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Appointments & Hospital Visits',
      q: 'How do I book an appointment at Durga Super Speciality Dental Hospital?',
      a: 'You can book directly via our online appointment system on this website, or call our clinic desk at 098453 44323. Once submitted, our team reviews current schedule availability and confirms your slot.'
    },
    {
      category: 'Appointments & Hospital Visits',
      q: 'Do I need an appointment before visiting?',
      a: 'We strongly recommend booking in advance to ensure minimal waiting time and adequate time allocated for your clinical evaluation. However, patients experiencing acute dental pain or trauma are accommodated based on doctor availability.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'What dental treatments are available at the clinic?',
      a: 'We provide full super-speciality dental services including general consultations, ultrasonic scaling and polishing, tooth-coloured composite fillings, painless rotary root canal treatments (RCT), precision crowns & bridges, orthodontic braces, dental implants, dentures, pediatric care, and wisdom tooth removal.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'Do you treat children?',
      a: 'Yes. Dr. Shilpa Govardhan and our team provide gentle pediatric dental care including milk tooth fillings, fluoride therapy, pit-and-fissure sealants, and gentle guidance to help young children build positive dental hygiene habits.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'Do you provide painless root canal treatments (RCT)?',
      a: 'Yes. We utilize modern rotary endodontic equipment, digital apex locators, and localized anesthesia techniques designed to eliminate infected pulp tissue with minimal discomfort and save your natural tooth.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'Do you provide dental braces and teeth straightening?',
      a: 'Yes. We offer orthodontic evaluations and treatments for teenagers and adults to correct crowding, gaps, overlapping teeth, and bite discrepancies.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'Do you provide dental implants?',
      a: 'Yes. We provide dental implant evaluations and surgical placement for single-tooth replacement, multiple missing teeth, or implant-supported bridges, restoring natural chewing stability and bone preservation.'
    },
    {
      category: 'Treatments & Clinical Care',
      q: 'Does teeth cleaning (scaling) damage tooth enamel?',
      a: 'No. Professional ultrasonic scaling uses gentle high-frequency vibrations to loosen tartar and bacterial plaque from the enamel and root surfaces without scraping or damaging healthy tooth structure.'
    },
    {
      category: 'Clinic & Hygiene',
      q: 'What sterilization protocols are followed?',
      a: 'We follow stringent hospital-grade infection control protocols. All reusable metal instruments undergo ultrasonic pre-cleaning followed by high-pressure autoclaving. Treatment chairs, handpieces, and contact surfaces are disinfected between each patient visit.'
    },
    {
      category: 'Location & Timings',
      q: 'Where is the clinic located and what are the timings?',
      a: 'We are situated on Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501. The clinic is open Monday through Saturday with Morning Sessions (09:30 AM – 01:30 PM) and Evening Sessions (04:30 PM – 08:30 PM). Sunday is closed.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Knowledge & Guidelines
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Helpful, medically responsible answers to common queries regarding appointments, treatments, and oral care at our hospital.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen ? 'bg-white border-slate-300 shadow-sm' : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div>
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h3 className="text-xl font-bold">Have a Specific Clinical Question?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Every smile and dental condition is unique. Book a comprehensive evaluation so our dental surgeons can assess your oral health in person.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 cursor-pointer"
          >
            Book Clinical Consultation
          </button>
          <a
            href="tel:09845344323"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-700 text-white font-medium text-xs sm:text-sm hover:bg-slate-800"
          >
            Call Desk: 098453 44323
          </a>
        </div>
      </div>
    </div>
  );
};
