import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Appointment, ContactMessage, Review } from '../src/types.ts';

export const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://ilyrmcrzotewmmckkbku.supabase.co';

export const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_YG7PxcuOJgHW9hn7kgFdDw_Lmpri3CK';

let supabaseClient: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
  }
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
}

export const supabase = supabaseClient;

export interface SupabaseSyncResult {
  success: boolean;
  table: string;
  error?: string;
  data?: any;
}

/**
 * Saves a new appointment to the Supabase 'appointments' table.
 */
export async function saveAppointmentToSupabase(
  appointment: Appointment
): Promise<SupabaseSyncResult> {
  if (!supabase) {
    return {
      success: false,
      table: 'appointments',
      error: 'Supabase client is not initialized.'
    };
  }

  // Primary payload with snake_case convention standard in PostgreSQL/Supabase
  const payloadSnake = {
    id: appointment.id,
    reference_number: appointment.referenceNumber,
    patient_name: appointment.patientName,
    phone: appointment.phone,
    email: appointment.email,
    service_id: appointment.serviceId,
    service_name: appointment.serviceName,
    doctor_id: appointment.doctorId,
    doctor_name: appointment.doctorName,
    appointment_date: appointment.appointmentDate,
    appointment_time: appointment.appointmentTime,
    is_new_patient: appointment.isNewPatient,
    reason: appointment.reason,
    notes: appointment.notes || '',
    status: appointment.status,
    created_at: appointment.createdAt,
    updated_at: appointment.updatedAt
  };

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([payloadSnake])
      .select();

    if (error) {
      // If error might be due to column casing differences, attempt camelCase fallback
      if (error.message.includes('column') || error.code === 'PGRST204') {
        const payloadCamel = {
          id: appointment.id,
          referenceNumber: appointment.referenceNumber,
          patientName: appointment.patientName,
          phone: appointment.phone,
          email: appointment.email,
          serviceId: appointment.serviceId,
          serviceName: appointment.serviceName,
          doctorId: appointment.doctorId,
          doctorName: appointment.doctorName,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          isNewPatient: appointment.isNewPatient,
          reason: appointment.reason,
          notes: appointment.notes || '',
          status: appointment.status,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt
        };

        const fallback = await supabase
          .from('appointments')
          .insert([payloadCamel])
          .select();

        if (fallback.error) {
          console.warn('[Supabase Sync Warning]', fallback.error.message);
          return {
            success: false,
            table: 'appointments',
            error: fallback.error.message
          };
        }

        console.log('[Supabase Sync Success] Appointment saved:', appointment.referenceNumber);
        return { success: true, table: 'appointments', data: fallback.data };
      }

      console.warn('[Supabase Sync Warning]', error.message);
      return { success: false, table: 'appointments', error: error.message };
    }

    console.log('[Supabase Sync Success] Appointment saved:', appointment.referenceNumber);
    return { success: true, table: 'appointments', data };
  } catch (err: any) {
    console.error('[Supabase Sync Error]', err);
    return {
      success: false,
      table: 'appointments',
      error: err.message || 'Network exception while connecting to Supabase.'
    };
  }
}

/**
 * Updates status or rescheduling in Supabase
 */
export async function updateAppointmentInSupabase(
  appointmentId: string,
  updates: Partial<Appointment>
): Promise<SupabaseSyncResult> {
  if (!supabase) return { success: false, table: 'appointments', error: 'No client' };

  const mappedUpdates: Record<string, any> = {
    updated_at: new Date().toISOString()
  };

  if (updates.status) mappedUpdates.status = updates.status;
  if (updates.notes !== undefined) mappedUpdates.notes = updates.notes;
  if (updates.appointmentDate) mappedUpdates.appointment_date = updates.appointmentDate;
  if (updates.appointmentTime) mappedUpdates.appointment_time = updates.appointmentTime;
  if (updates.doctorId) mappedUpdates.doctor_id = updates.doctorId;
  if (updates.doctorName) mappedUpdates.doctor_name = updates.doctorName;

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(mappedUpdates)
      .eq('id', appointmentId)
      .select();

    if (error) {
      return { success: false, table: 'appointments', error: error.message };
    }
    return { success: true, table: 'appointments', data };
  } catch (err: any) {
    return { success: false, table: 'appointments', error: err.message };
  }
}

/**
 * Saves contact inquiries to Supabase
 */
export async function saveContactToSupabase(contact: ContactMessage): Promise<SupabaseSyncResult> {
  if (!supabase) return { success: false, table: 'contact_messages', error: 'No client' };

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          created_at: contact.createdAt,
          status: contact.status
        }
      ])
      .select();

    if (error) {
      return { success: false, table: 'contact_messages', error: error.message };
    }
    return { success: true, table: 'contact_messages', data };
  } catch (err: any) {
    return { success: false, table: 'contact_messages', error: err.message };
  }
}

/**
 * Tests the connection to Supabase and checks if tables exist
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectUrl: string;
  tableExists: boolean;
  error?: string;
  count?: number;
}> {
  if (!supabase) {
    return {
      connected: false,
      projectUrl: SUPABASE_URL,
      tableExists: false,
      error: 'Supabase client not initialized.'
    };
  }

  try {
    const { data, error, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      return {
        connected: true,
        projectUrl: SUPABASE_URL,
        tableExists: false,
        error: error.message
      };
    }

    return {
      connected: true,
      projectUrl: SUPABASE_URL,
      tableExists: true,
      count: count ?? (data ? data.length : 0)
    };
  } catch (err: any) {
    return {
      connected: false,
      projectUrl: SUPABASE_URL,
      tableExists: false,
      error: err.message || 'Network exception when pinging Supabase.'
    };
  }
}
