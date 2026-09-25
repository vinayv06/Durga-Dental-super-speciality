export interface Service {
  id: string;
  slug: string;
  name: string;
  category: 
    | 'General Dentistry'
    | 'Root Canal & Restorative Dentistry'
    | 'Orthodontics'
    | 'Dental Implants & Tooth Replacement'
    | 'Cosmetic Dentistry'
    | 'Gum & Periodontal Care'
    | 'Children\'s Dentistry'
    | 'Oral Surgery';
  shortDescription: string;
  whoNeedsIt: string;
  whatItInvolves: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  isFeatured: boolean;
  iconName: string;
  durationMinutes: number;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  bio: string;
  photo: string;
  daysAvailable: string[];
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  isActive: boolean;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  referenceNumber: string;
  patientName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:30 AM"
  isNewPatient: boolean;
  reason: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicSettings {
  name: string;
  tagline: string;
  address: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  phoneRaw: string;
  email: string;
  googleMapsUrl: string;
  workingDays: string[];
  morningSession: { start: string; end: string };
  eveningSession: { start: string; end: string };
  sundayOpen: boolean;
  sundaySession?: { start: string; end: string };
  slotIntervalMinutes: number;
  blockedDates: string[]; // YYYY-MM-DD
  blockedSlots: { date: string; time: string; doctorId?: string; reason?: string }[];
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  isApproved: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Read' | 'Replied';
}

export interface NotificationLog {
  id: string;
  type: 'appointment_created' | 'appointment_confirmed' | 'appointment_cancelled' | 'contact_received';
  recipient: string;
  recipientType: 'admin' | 'patient';
  subject: string;
  content: string;
  createdAt: string;
  status: 'Sent' | 'Simulated';
}

export interface AvailabilityResponse {
  date: string;
  doctorId: string;
  doctorName: string;
  isOpenDay: boolean;
  isBlockedDate: boolean;
  slots: {
    time: string;
    isAvailable: boolean;
    reason?: string;
  }[];
}
