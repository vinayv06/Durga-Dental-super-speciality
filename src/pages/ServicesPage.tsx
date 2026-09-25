import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { api } from '../api';
import { Stethoscope, ArrowRight, Calendar, Search } from 'lucide-react';

interface ServicesPageProps {
  onSelectServiceDetail: (slug: string) => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSelectServiceDetail,
  onOpenBooking
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const categories = [
    'All',
    'General Dentistry',
    'Root Canal & Restorative Dentistry',
    'Orthodontics',
    'Dental Implants & Tooth Replacement',
    'Cosmetic Dentistry',
    'Gum & Periodontal Care',
    'Children\'s Dentistry',
    'Oral Surgery'
  ];

  const filtered = services.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Comprehensive Dental Disciplines
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Dental Treatments & Services
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          From preventive cleanings and pain-free root canals to orthodontic corrections and dental implants, we provide complete family and specialist dental care in Chitradurga.
        </p>
      </div>

      {/* Controls Bar: Search & Category Buttons */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search treatments (e.g. root canal, cleaning, braces)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{svc.category}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:text-teal-600 transition-colors">
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
                className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenBooking(svc.id)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm">No treatments found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="mt-3 text-xs font-semibold text-teal-700 underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Note about Assessment */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center max-w-2xl mx-auto">
        Your dental surgeon will assess your oral condition during your clinical evaluation to recommend the most suitable treatment protocol for you.
      </div>
    </div>
  );
};
