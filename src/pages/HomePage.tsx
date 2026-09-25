import React, { useState, useEffect } from 'react';
import { Service, Doctor, Review, Appointment } from '../types';
import { api } from '../api';
import { QuickAppointmentCard } from '../components/QuickAppointmentCard';
import {
  Calendar,
  Phone,
  ShieldCheck,
  Stethoscope,
  Smile,
  Heart,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Crosshair,
  Anchor,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, meta?: any) => void;
  onOpenBooking: (serviceId?: string, doctorId?: string) => void;
  onSelectServiceDetail: (slug: string) => void;
  onAppointmentSuccess: (appointment: Appointment) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onSelectServiceDetail,
  onAppointmentSuccess
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function loadData() {
      try {
        const [svcs, docs, revs] = await Promise.all([
          api.getServices(),
          api.getDoctors(),
          api.getReviews()
        ]);
        setServices(svcs);
        setDoctors(docs);
        setReviews(revs);
      } catch (e) {
        console.error('Error fetching homepage data:', e);
      }
    }
    loadData();
  }, []);

  const categories = [
    'All',
    'General Dentistry',
    'Root Canal & Restorative Dentistry',
    'Orthodontics',
    'Dental Implants & Tooth Replacement',
    'Cosmetic Dentistry',
    'Children\'s Dentistry',
    'Oral Surgery'
  ];

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const featuredServices = services.filter((s) => s.isFeatured).slice(0, 6);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Trust/Location Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Durga Super Speciality Dental Hospital · Chitradurga, Karnataka</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] text-balance">
                  Advanced Dental Care. <br className="hidden sm:inline" />
                  <span className="text-slate-900">Comfortable Smiles.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl text-balance">
                  Comprehensive dental care for healthier teeth, confident smiles, and a more comfortable patient experience in Chitradurga.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Book an Appointment</span>
                </button>

                <a
                  href="tel:09845344323"
                  className="px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Call the Clinic</span>
                </a>
              </div>

              {/* Quiet Micro Details */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <span>Holalkere Road, near Neelakanteshwara Temple</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Mon – Sat: Morning & Evening Sessions</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Direct Clinical Doctor Consultations</span>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 aspect-16/10 lg:aspect-4/3">
                <img
                  src="/src/assets/images/hero_dental_operatory_1790342713254.jpg"
                  alt="Modern Dental Operatory at Durga Super Speciality Dental Hospital"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs backdrop-blur-md bg-slate-950/40 p-3 rounded-xl border border-white/10">
                  <p className="font-semibold text-white">Sterile Modern Treatment Suite</p>
                  <p className="text-slate-300 text-[11px]">Precision clinical setup designed for patient comfort</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK APPOINTMENT CTA CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <QuickAppointmentCard onSuccess={onAppointmentSuccess} />
      </section>

      {/* 3. FOUR TRUST / VALUE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center mb-4">
              <Stethoscope className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Comprehensive Dental Care</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From routine preventive checkups to complex endodontic treatments, implants, and oral rehabilitation under one roof.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Modern Treatment Approach</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Utilizing rotary endodontics, digital diagnostic tools, and contemporary clinical protocols to minimize treatment discomfort.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Experienced Dental Professionals</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direct consultations with qualified BDS dental surgeons dedicated to ethical practice and transparent treatment planning.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Patient-Centred Care</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gentle chairside manner, unhurried appointments, and clear post-treatment guidance for both children and adult patients.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ABOUT CLINIC OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-16/10">
              <img
                src="/src/assets/images/clinic_reception_lounge_1790342753666.jpg"
                alt="Reception & Patient Lounge at Durga Super Speciality Dental Hospital"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Hygienic, comfortable waiting environment</span>
              <button
                onClick={() => onNavigate('about')}
                className="text-teal-700 font-semibold hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Philosophy</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
              About The Hospital
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Compassionate Dental Care, Backed by Modern Dentistry
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Located on Holalkere Road near Neelakanteshwara Temple in Chitradurga, Durga Super Speciality Dental Hospital provides comprehensive oral healthcare with an emphasis on patient comfort, sterile treatment standards, and evidence-based clinical practices.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you need urgent toothache relief, a preventive checkup, braces, or full restorative smile replacement, our experienced dental team assesses your individual oral health to recommend the most conservative and effective treatment.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Our Clinic</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenBooking()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
              Treatments & Specialities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Dental Procedures
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-sm font-semibold text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <span>View All Treatments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-slate-500">
                    {svc.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:text-teal-600 transition-colors">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-800 transition-colors">
                  {svc.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {svc.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectServiceDetail(svc.slug)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Learn More
                </button>
                <button
                  onClick={() => onOpenBooking(svc.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block mb-2">
              Clinical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Patients in Chitradurga Trust Durga Dental Hospital
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Our clinical practice focuses on transparency, conservative tooth preservation, and patient comfort at every visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-teal-400 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Sterile & Safe Environment</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Stringent multi-tier autoclaving and sterilization protocols to guarantee patient safety and zero cross-contamination.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-teal-400 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Direct Doctor Consultations</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every consultation is conducted directly by experienced BDS dental surgeons, with unhurried explanations and tailored care.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-teal-400 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Convenient Town Location</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Centrally situated on Holalkere Road near Neelakanteshwara Temple, offering easy accessibility from across Chitradurga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DOCTORS / OUR TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
            Clinical Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Dental Surgeons
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Verified, compassionate dental professionals committed to ethical dentistry in Chitradurga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="aspect-3/4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 max-h-72">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs font-semibold text-teal-700">{doc.qualification}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{doc.specialization}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <p>
                    <span className="font-semibold text-slate-700">Days Available:</span> Mon – Sat
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Sessions:</span> Morning & Evening
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onOpenBooking(undefined, doc.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Book Appointment with {doc.name.split(' ')[1]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TREATMENT CATEGORIES FILTERABLE BROWSER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
            Browse By Dental Category
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Dental Disciplines
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Select a specialty to explore related treatments and details.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-slate-400 block mb-1">{svc.category}</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{svc.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {svc.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectServiceDetail(svc.slug)}
                  className="font-semibold text-slate-700 hover:text-slate-950 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onOpenBooking(svc.id)}
                  className="font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  Schedule Visit →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CLINIC GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
              Hospital Facility
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Inside Durga Dental Hospital
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-sm font-semibold text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 relative group">
            <img
              src="/src/assets/images/hero_dental_operatory_1790342713254.jpg"
              alt="Operatory Suite"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold">Sterile Treatment Operatory</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 relative group">
            <img
              src="/src/assets/images/clinic_reception_lounge_1790342753666.jpg"
              alt="Clinic Lounge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold">Reception & Waiting Area</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 relative group sm:col-span-2 lg:col-span-1">
            <img
              src="/src/assets/images/clinic_advanced_equipment_1790342766868.jpg"
              alt="Advanced Dental Diagnostic Equipment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold">Precision Dental Equipment</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PATIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
              Google Business Profile Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Patient Feedback & Experiences
            </h2>
          </div>
          <button
            onClick={() => onNavigate('reviews')}
            className="text-sm font-semibold text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{rev.authorName}</span>
                <span className="text-slate-400">{rev.source}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block mb-1">
            Patient Queries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Clear, responsible answers to common questions about dental visits and treatments.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
              How do I book an appointment at Durga Dental Hospital?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You can submit your preferred date, time slot, and consulting doctor via the online form above, or call our clinic desk directly at 098453 44323. Our team confirms every appointment slot prior to your arrival.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
              Do I need a prior appointment before visiting?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              While we encourage prior appointments to minimize waiting times and coordinate sterile operatory preparation, walk-in patients with acute toothaches or dental emergencies are accommodated based on doctor availability.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
              Is root canal treatment (RCT) painful?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. With modern local anesthesia techniques and rotary endodontic equipment, root canal therapy is performed comfortably to relieve infection and throbbing pain rather than cause it.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('faq')}
            className="text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View all questions & medical guidance</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 12. LOCATION / GOOGLE MAPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Chitradurga Location</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Durga Super Speciality Dental Hospital
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Holalkere Road, near Neelakanteshwara Temple, Chitradurga, Karnataka – 577501.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Mon–Sat: 09:30 AM–01:30 PM & 04:30 PM–08:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <a href="tel:09845344323" className="hover:text-white underline">
                  098453 44323
                </a>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://maps.google.com/?q=Durga+Super+Speciality+Dental+Hospital+Holalkere+Road+Chitradurga+Karnataka+577501"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                View Full Contact Details
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Visual Location Frame */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Landmark Navigation</span>
                <span className="text-teal-400 font-medium">Near Neelakanteshwara Temple</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Easily accessible via Holalkere Road main arterial road in Chitradurga. Two-wheeler and car parking accessible in surrounding street vicinity.
              </p>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                <span>Direct Inquiries:</span>
                <span className="text-white font-mono font-medium">098453 44323</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FINAL APPOINTMENT CTA (Section 29) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 text-center space-y-6 shadow-sm">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
            Begin Your Consultation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
            Ready to Take Care of Your Smile?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Book your dental consultation at Durga Super Speciality Dental Hospital in Chitradurga.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 text-white font-medium text-sm sm:text-base hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book an Appointment</span>
            </button>
            <a
              href="tel:09845344323"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call 098453 44323</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
