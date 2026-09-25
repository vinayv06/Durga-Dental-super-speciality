import React, { useState } from 'react';
import { X, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  src: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      title: 'Sterile Modern Dental Operatory',
      category: 'Treatment Operatories',
      description: 'Ergonomic patient chair equipped with precision dental instruments, cleanroom lighting, and digital monitors.',
      src: '/src/assets/images/hero_dental_operatory_1790342713254.jpg'
    },
    {
      id: 'g-2',
      title: 'Hospital Reception & Patient Waiting Lounge',
      category: 'Reception & Lounge',
      description: 'Clean, comfortable, air-conditioned waiting environment designed to put patients at ease.',
      src: '/src/assets/images/clinic_reception_lounge_1790342753666.jpg'
    },
    {
      id: 'g-3',
      title: 'High-Precision Dental Diagnostics & Equipment',
      category: 'Advanced Equipment',
      description: 'Digital intraoral radiography, rotary endodontic equipment, and autoclave sterilization units.',
      src: '/src/assets/images/clinic_advanced_equipment_1790342766868.jpg'
    },
    {
      id: 'g-4',
      title: 'Dr. Govardhan S N in Consultation',
      category: 'Doctors & Consultations',
      description: 'Consultation room where patients receive clear explanation of diagnostics and treatment paths.',
      src: '/src/assets/images/doctor_govardhan_sn_1790342727377.jpg'
    },
    {
      id: 'g-5',
      title: 'Dr. Shilpa Govardhan Patient Care',
      category: 'Doctors & Consultations',
      description: 'Gentle, attentive clinical consultation ensuring anxiety-free dental experience for children and adults.',
      src: '/src/assets/images/doctor_shilpa_govardhan_1790342741294.jpg'
    }
  ];

  const categories = [
    'All',
    'Treatment Operatories',
    'Reception & Lounge',
    'Advanced Equipment',
    'Doctors & Consultations'
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block">
          Facility Showcase
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Clinic Facility & Atmosphere
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Take a look inside Durga Super Speciality Dental Hospital. Experience our sterile operatories, modern diagnostic setup, and comfortable patient spaces in Chitradurga.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 cursor-pointer shadow-sm hover:shadow-md transition-all"
          >
            <img
              src={item.src}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
                {item.category}
              </span>
              <h3 className="text-white text-base font-bold leading-snug">{item.title}</h3>
              <p className="text-slate-300 text-xs mt-1 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/90">
                <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Click to view large</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-1">
              <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">
                {selectedItem.category}
              </span>
              <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ethical note */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center max-w-2xl mx-auto">
        Durga Super Speciality Dental Hospital respects patient privacy. No identifiable patient photographs or clinical procedures are displayed without explicit prior consent.
      </div>
    </div>
  );
};
