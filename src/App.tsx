/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileActionBar } from './components/MobileActionBar';
import { AppointmentModal } from './components/AppointmentModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BookingPage } from './pages/BookingPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Appointment } from './types';
import { AppointmentConfirmation } from './components/AppointmentConfirmation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | undefined>(undefined);
  const [bookingPreselectedDoctor, setBookingPreselectedDoctor] = useState<string | undefined>(undefined);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Admin auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('durga_admin_token');
  });

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (serviceId?: string, doctorId?: string) => {
    setBookingPreselectedService(serviceId);
    setBookingPreselectedDoctor(doctorId);
    setIsBookingModalOpen(true);
  };

  const handleSelectServiceDetail = (slug: string) => {
    setSelectedServiceSlug(slug);
    setCurrentTab('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppointmentSuccess = (appointment: Appointment) => {
    setConfirmedAppointment(appointment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16 sm:pb-0">
        {confirmedAppointment ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AppointmentConfirmation
              appointment={confirmedAppointment}
              onClose={() => setConfirmedAppointment(null)}
              onGoHome={() => {
                setConfirmedAppointment(null);
                handleNavigate('home');
              }}
            />
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenBooking={handleOpenBooking}
                onSelectServiceDetail={handleSelectServiceDetail}
                onAppointmentSuccess={handleAppointmentSuccess}
              />
            )}

            {currentTab === 'about' && (
              <AboutPage
                onOpenBooking={() => handleOpenBooking()}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'services' && (
              <ServicesPage
                onSelectServiceDetail={handleSelectServiceDetail}
                onOpenBooking={handleOpenBooking}
              />
            )}

            {currentTab === 'service-detail' && selectedServiceSlug && (
              <ServiceDetailPage
                slug={selectedServiceSlug}
                onBack={() => handleNavigate('services')}
                onOpenBooking={handleOpenBooking}
              />
            )}

            {currentTab === 'doctors' && (
              <DoctorsPage onOpenBooking={handleOpenBooking} />
            )}

            {currentTab === 'booking' && (
              <BookingPage
                onGoHome={() => handleNavigate('home')}
                preselectedServiceId={bookingPreselectedService}
                preselectedDoctorId={bookingPreselectedDoctor}
              />
            )}

            {currentTab === 'gallery' && <GalleryPage />}

            {currentTab === 'reviews' && <ReviewsPage />}

            {currentTab === 'contact' && <ContactPage />}

            {currentTab === 'faq' && (
              <FaqPage onOpenBooking={() => handleOpenBooking()} />
            )}

            {currentTab === 'legal' && <LegalPage />}

            {currentTab === 'admin' && (
              <AdminDashboard
                isAuthenticated={Boolean(adminToken)}
                onLoginSuccess={(token) => setAdminToken(token)}
                onLogout={() => {
                  localStorage.removeItem('durga_admin_token');
                  setAdminToken(null);
                  handleNavigate('home');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Global Quick Booking Modal */}
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedServiceId={bookingPreselectedService}
        preselectedDoctorId={bookingPreselectedDoctor}
        onGoHome={() => handleNavigate('home')}
      />

      {/* Mobile Fixed Bottom Action Bar */}
      <MobileActionBar onOpenBooking={() => handleOpenBooking()} />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />
    </div>
  );
}
