import {
  Service,
  Doctor,
  Appointment,
  ClinicSettings,
  Review,
  ContactMessage,
  NotificationLog,
  AvailabilityResponse
} from './types';

const BASE_URL = '/api';

export const api = {
  // Settings
  async getSettings(): Promise<ClinicSettings> {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<ClinicSettings>): Promise<{ success: boolean; settings: ClinicSettings }> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Services
  async getServices(): Promise<Service[]> {
    const res = await fetch(`${BASE_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  async getService(idOrSlug: string): Promise<Service> {
    const res = await fetch(`${BASE_URL}/services/${idOrSlug}`);
    if (!res.ok) throw new Error('Failed to fetch service');
    return res.json();
  },

  async saveService(service: Partial<Service>, id?: string): Promise<Service> {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BASE_URL}/services/${id}` : `${BASE_URL}/services`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error('Failed to save service');
    return res.json();
  },

  async deleteService(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/services/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete service');
    const data = await res.json();
    return data.success;
  },

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    const res = await fetch(`${BASE_URL}/doctors`);
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  async getDoctor(id: string): Promise<Doctor> {
    const res = await fetch(`${BASE_URL}/doctors/${id}`);
    if (!res.ok) throw new Error('Failed to fetch doctor');
    return res.json();
  },

  async saveDoctor(doctor: Partial<Doctor>, id?: string): Promise<Doctor> {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BASE_URL}/doctors/${id}` : `${BASE_URL}/doctors`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor)
    });
    if (!res.ok) throw new Error('Failed to save doctor');
    return res.json();
  },

  async deleteDoctor(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete doctor');
    const data = await res.json();
    return data.success;
  },

  // Availability
  async getAvailability(date: string, doctorId: string): Promise<AvailabilityResponse> {
    const res = await fetch(`${BASE_URL}/availability?date=${encodeURIComponent(date)}&doctorId=${encodeURIComponent(doctorId)}`);
    if (!res.ok) throw new Error('Failed to fetch availability');
    return res.json();
  },

  // Appointments
  async getAppointments(filters?: { doctorId?: string; status?: string; date?: string; search?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.doctorId) params.append('doctorId', filters.doctorId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${BASE_URL}/appointments?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async getAppointment(idOrRef: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${encodeURIComponent(idOrRef)}`);
    if (!res.ok) throw new Error('Failed to fetch appointment');
    return res.json();
  },

  async createAppointment(payload: {
    patientName: string;
    phone: string;
    email: string;
    serviceId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    isNewPatient: boolean;
    reason: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; appointment: Appointment }> {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit appointment');
    }
    return data;
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data.appointment;
  },

  async rescheduleAppointment(id: string, appointmentDate: string, appointmentTime: string, doctorId?: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentDate, appointmentTime, doctorId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reschedule appointment');
    return data.appointment;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${BASE_URL}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async addReview(review: { authorName: string; rating: number; comment: string; source?: string }): Promise<Review> {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/reviews/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Contact
  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${BASE_URL}/contact`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async submitContact(data: { name: string; phone: string; email?: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit contact inquiry');
    return result;
  },

  // Notifications
  async getNotifications(): Promise<NotificationLog[]> {
    const res = await fetch(`${BASE_URL}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  // Admin Auth
  async login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async checkAuth(token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.authenticated;
  },

  // Supabase Integration
  async getSupabaseStatus(): Promise<{
    connected: boolean;
    projectUrl: string;
    projectId: string;
    tableExists: boolean;
    count?: number;
    error?: string;
    sqlSchema: string;
  }> {
    const res = await fetch(`${BASE_URL}/supabase/status`);
    if (!res.ok) throw new Error('Failed to fetch Supabase status');
    return res.json();
  },

  async syncAllToSupabase(): Promise<{
    success: boolean;
    total: number;
    synced: number;
    failed: number;
    errors: string[];
  }> {
    const res = await fetch(`${BASE_URL}/supabase/sync-all`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to run Supabase sync');
    return res.json();
  }
};

