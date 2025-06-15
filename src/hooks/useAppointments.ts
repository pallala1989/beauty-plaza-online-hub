
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AppointmentWithDetails {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_amount: number;
  service_type: string;
  notes?: string;
  service: {
    name: string;
    price: number;
  };
  technician: {
    name: string;
  };
}

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching appointments for user:', user.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_time,
          status,
          total_amount,
          service_type,
          notes,
          services:service_id (
            name,
            price
          ),
          technicians:technician_id (
            name
          )
        `)
        .eq('customer_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched appointments:', data);
      
      // Transform the data to match our interface
      const transformedData = data?.map(appointment => ({
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status,
        total_amount: appointment.total_amount || 0,
        service_type: appointment.service_type || 'in-store',
        notes: appointment.notes,
        service: {
          name: appointment.services?.name || 'Unknown Service',
          price: appointment.services?.price || 0
        },
        technician: {
          name: appointment.technicians?.name || 'Unknown Technician'
        }
      })) || [];

      setAppointments(transformedData);
    } catch (error: any) {
      console.error('Error in fetchAppointments:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments
  };
};
