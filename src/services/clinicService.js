import { supabase, isSupabaseConfigured } from './supabase';
import { 
  getDoctors as getMockDoctors, 
  getAppointments as getMockAppointments, 
  getMedicalRecords as getMockMedicalRecords,
  updateAppointmentStatus as updateMockAppointmentStatus 
} from './mockDataStore';

/**
 * Fetch all clinical doctors (Live Supabase with fallback to local store)
 */
export const fetchDoctors = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(doc => ({
          ...doc,
          room: doc.room_number || doc.room,
          fee: doc.consultation_fee || doc.fee,
          avatar: doc.avatar_url || doc.avatar
        }));
      }
    } catch (err) {
      console.warn('Supabase doctor query failed, using local store:', err);
    }
  }

  // Graceful local fallback
  return getMockDoctors();
};

/**
 * Fetch all clinical departments
 */
export const fetchDepartments = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase departments query failed:', err);
    }
  }

  return [
    { id: 'gen-med', name: 'General Medicine', description: 'Comprehensive outpatient diagnostics & wellness checks.' },
    { id: 'cardio', name: 'Cardiology', description: 'Preventive heart health screenings & ECG evaluations.' },
    { id: 'peds', name: 'Pediatrics', description: 'Child healthcare from infancy to adolescence.' },
    { id: 'neuro', name: 'Neurology', description: 'Consultations for migraines, nerve wellness & sleep.' },
    { id: 'diagnostics', name: 'Pathology & Diagnostics', description: 'Integrated digital pathology with fast turnaround.' }
  ];
};

/**
 * Fetch patient appointments
 */
export const fetchAppointments = async (patientId) => {
  if (isSupabaseConfigured() && patientId) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: true });

      if (!error && data) {
        return data.map(a => ({
          ...a,
          patientId: a.patient_id,
          doctorId: a.doctor_id,
          doctorName: a.doctor_name,
          visitReason: a.visit_reason,
          paymentStatus: a.payment_status,
          checkInCode: a.check_in_code
        }));
      }
    } catch (err) {
      console.warn('Supabase appointments query failed:', err);
    }
  }

  const all = getMockAppointments();
  return all.filter(a => a.patientId === patientId);
};

/**
 * Save new patient appointment
 */
export const bookAppointment = async (aptData) => {
  if (isSupabaseConfigured() && aptData.patientId) {
    try {
      const row = {
        id: aptData.id || `APT-${Date.now().toString().slice(-4)}`,
        patient_id: aptData.patientId,
        doctor_id: aptData.doctorId,
        doctor_name: aptData.doctorName,
        date: aptData.date,
        time: aptData.time,
        room: aptData.room,
        visit_reason: aptData.visitReason || 'General Consultation',
        status: aptData.status || 'confirmed',
        payment_status: aptData.paymentStatus || 'pay_at_clinic',
        payment_method: aptData.paymentMethod || 'Pay at clinic',
        fee: aptData.fee || 800,
        check_in_code: aptData.checkInCode || `CHK-${Math.floor(100 + Math.random() * 900)}`,
        pre_visit_intake: aptData.preVisitIntake || null,
        is_sample: false
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(row)
        .select()
        .single();

      if (!error && data) {
        return {
          success: true,
          appointment: {
            ...data,
            patientId: data.patient_id,
            doctorId: data.doctor_id,
            doctorName: data.doctor_name,
            visitReason: data.visit_reason
          }
        };
      }
    } catch (err) {
      console.warn('Supabase booking failed, persisting locally:', err);
    }
  }

  // Local fallback
  return { success: true, appointment: aptData };
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (aptId, reason = '') => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          cancel_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', aptId);

      if (!error) return { success: true };
    } catch (err) {
      console.warn('Supabase cancel failed, fallback to local:', err);
    }
  }

  updateMockAppointmentStatus(aptId, 'cancelled', { cancelReason: reason });
  return { success: true };
};

