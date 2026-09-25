import { Router, type Request, type Response } from 'express';
import { db } from '../db.ts';
import {
  saveAppointmentToSupabase,
  updateAppointmentInSupabase,
  saveContactToSupabase,
  testSupabaseConnection,
  SUPABASE_URL
} from '../supabase.ts';

export const apiRouter = Router();

// Middleware for simulated admin auth checking
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'durga123';

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if ((username === 'admin' || username === 'drgovardhan') && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: 'durga-admin-authenticated-token-2026',
      user: {
        username: 'Dr. Govardhan',
        role: 'Hospital Administrator',
        email: 'drgovardhan@gmail.com'
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.includes('durga-admin-authenticated-token-2026')) {
    res.json({
      authenticated: true,
      user: {
        username: 'Dr. Govardhan',
        role: 'Hospital Administrator',
        email: 'drgovardhan@gmail.com'
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Settings
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

apiRouter.put('/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// Services
apiRouter.get('/services', (_req: Request, res: Response) => {
  res.json(db.getServices());
});

apiRouter.get('/services/:id', (req: Request, res: Response) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  res.json(service);
});

apiRouter.post('/services', (req: Request, res: Response) => {
  const service = db.addService(req.body);
  res.status(201).json(service);
});

apiRouter.put('/services/:id', (req: Request, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/services/:id', (req: Request, res: Response) => {
  const ok = db.deleteService(req.params.id);
  res.json({ success: ok });
});

// Doctors
apiRouter.get('/doctors', (_req: Request, res: Response) => {
  res.json(db.getDoctors());
});

apiRouter.get('/doctors/:id', (req: Request, res: Response) => {
  const doctor = db.getDoctorById(req.params.id);
  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' });
    return;
  }
  res.json(doctor);
});

apiRouter.post('/doctors', (req: Request, res: Response) => {
  const doctor = db.addDoctor(req.body);
  res.status(201).json(doctor);
});

apiRouter.put('/doctors/:id', (req: Request, res: Response) => {
  const updated = db.updateDoctor(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Doctor not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/doctors/:id', (req: Request, res: Response) => {
  const ok = db.deleteDoctor(req.params.id);
  res.json({ success: ok });
});

// Availability calculation
apiRouter.get('/availability', (req: Request, res: Response) => {
  const { date, doctorId } = req.query;

  if (!date || typeof date !== 'string') {
    res.status(400).json({ error: 'Date query param is required (YYYY-MM-DD)' });
    return;
  }

  let targetDocId = typeof doctorId === 'string' && doctorId ? doctorId : '';
  if (!targetDocId) {
    const doctors = db.getDoctors();
    targetDocId = doctors[0]?.id || 'doc-01';
  }

  const availability = db.getAvailability(date, targetDocId);
  res.json(availability);
});

// Appointments
apiRouter.get('/appointments', (req: Request, res: Response) => {
  let appointments = db.getAppointments();
  const { doctorId, status, date, search } = req.query;

  if (doctorId && typeof doctorId === 'string') {
    appointments = appointments.filter((a) => a.doctorId === doctorId);
  }
  if (status && typeof status === 'string') {
    appointments = appointments.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }
  if (date && typeof date === 'string') {
    appointments = appointments.filter((a) => a.appointmentDate === date);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    appointments = appointments.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.referenceNumber.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.serviceName.toLowerCase().includes(q)
    );
  }

  res.json(appointments);
});

apiRouter.get('/appointments/:id', (req: Request, res: Response) => {
  const apt = db.getAppointmentById(req.params.id);
  if (!apt) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json(apt);
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  const {
    patientName,
    phone,
    email,
    serviceId,
    doctorId,
    appointmentDate,
    appointmentTime,
    isNewPatient,
    reason,
    notes
  } = req.body;

  if (!patientName || !phone || !serviceId || !doctorId || !appointmentDate || !appointmentTime) {
    res.status(400).json({
      error: 'Please fill in all required fields (Name, Phone, Service, Doctor, Date, and Time).'
    });
    return;
  }

  // Basic phone validation (10+ digits)
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    return;
  }

  const result = db.createAppointment({
    patientName,
    phone,
    email: email || '',
    serviceId,
    doctorId,
    appointmentDate,
    appointmentTime,
    isNewPatient: Boolean(isNewPatient),
    reason: reason || 'Dental Consultation',
    notes
  });

  if (result.error) {
    res.status(409).json({ error: result.error });
    return;
  }

  // Automatically save to Supabase database
  if (result.appointment) {
    saveAppointmentToSupabase(result.appointment).catch((err) => {
      console.error('[Supabase Background Save Error]', err);
    });
  }

  res.status(201).json({
    success: true,
    message: 'Thank you. Your appointment request has been received. Our clinic team will contact you to confirm your appointment.',
    appointment: result.appointment
  });
});

apiRouter.patch('/appointments/:id/status', async (req: Request, res: Response) => {
  const { status, notes } = req.body;
  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  const updated = db.updateAppointmentStatus(req.params.id, status, notes);
  if (!updated) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Update in Supabase
  updateAppointmentInSupabase(req.params.id, { status, notes }).catch((err) => {
    console.error('[Supabase Status Update Error]', err);
  });

  res.json({ success: true, appointment: updated });
});

apiRouter.post('/appointments/:id/reschedule', async (req: Request, res: Response) => {
  const { appointmentDate, appointmentTime, doctorId } = req.body;
  if (!appointmentDate || !appointmentTime) {
    res.status(400).json({ error: 'New appointment date and time are required' });
    return;
  }

  const result = db.rescheduleAppointment(
    req.params.id,
    appointmentDate,
    appointmentTime,
    doctorId
  );

  if (result.error) {
    res.status(409).json({ error: result.error });
    return;
  }

  // Update in Supabase
  updateAppointmentInSupabase(req.params.id, {
    appointmentDate,
    appointmentTime,
    doctorId,
    doctorName: result.appointment?.doctorName
  }).catch((err) => {
    console.error('[Supabase Reschedule Error]', err);
  });

  res.json({ success: true, appointment: result.appointment });
});

// Reviews
apiRouter.get('/reviews', (_req: Request, res: Response) => {
  res.json(db.getReviews());
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  const { authorName, rating, comment, source } = req.body;
  if (!authorName || !comment) {
    res.status(400).json({ error: 'Name and review text are required' });
    return;
  }

  const newReview = db.addReview({
    authorName,
    rating: Number(rating) || 5,
    comment,
    date: new Date().toISOString().split('T')[0],
    source: source || 'Verified Patient'
  });

  res.status(201).json(newReview);
});

apiRouter.put('/reviews/:id', (req: Request, res: Response) => {
  const updated = db.updateReview(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/reviews/:id', (req: Request, res: Response) => {
  const ok = db.deleteReview(req.params.id);
  res.json({ success: ok });
});

// Contact Messages
apiRouter.get('/contact', (_req: Request, res: Response) => {
  res.json(db.getContactMessages());
});

apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: 'Name, phone, and message are required' });
    return;
  }

  const msg = db.addContactMessage({
    name,
    phone,
    email: email || '',
    subject: subject || 'General Dental Inquiry',
    message
  });

  // Save to Supabase contact_messages table
  saveContactToSupabase(msg).catch((err) => {
    console.error('[Supabase Contact Sync Error]', err);
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been sent to our clinic desk. We will get back to you shortly.',
    data: msg
  });
});

// Notifications (Admin)
apiRouter.get('/notifications', (_req: Request, res: Response) => {
  res.json(db.getNotifications());
});

// Supabase Status and Schema Utility
apiRouter.get('/supabase/status', async (_req: Request, res: Response) => {
  const status = await testSupabaseConnection();
  const sqlSchema = `
-- Supabase Schema for Durga Super Speciality Dental Hospital
-- Run this in your Supabase SQL Editor if the table is not created yet:

create table if not exists appointments (
  id text primary key,
  reference_number text not null,
  patient_name text not null,
  phone text not null,
  email text,
  service_id text,
  service_name text,
  doctor_id text,
  doctor_name text,
  appointment_date text not null,
  appointment_time text not null,
  is_new_patient boolean default true,
  reason text,
  notes text,
  status text default 'Pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security (RLS) policies allowing public appointment booking:
alter table appointments enable row level security;

create policy "Allow anonymous appointment creation" on appointments
  for insert with check (true);

create policy "Allow read appointments" on appointments
  for select using (true);

create policy "Allow update appointments" on appointments
  for update using (true);

-- Optional: Contact inquiries table
create table if not exists contact_messages (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  subject text,
  message text,
  status text default 'Unread',
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Allow anonymous contact messages" on contact_messages
  for insert with check (true);
`;

  res.json({
    ...status,
    projectId: 'ilyrmcrzotewmmckkbku',
    sqlSchema
  });
});

// Sync all existing appointments from local database to Supabase
apiRouter.post('/supabase/sync-all', async (_req: Request, res: Response) => {
  const allAppointments = db.getAppointments();
  const results = {
    total: allAppointments.length,
    synced: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const apt of allAppointments) {
    const resSync = await saveAppointmentToSupabase(apt);
    if (resSync.success) {
      results.synced++;
    } else {
      results.failed++;
      if (resSync.error && !results.errors.includes(resSync.error)) {
        results.errors.push(resSync.error);
      }
    }
  }

  res.json({
    success: results.failed === 0,
    ...results
  });
});

