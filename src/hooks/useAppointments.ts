import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

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
      
      const response = await fetch(`${API_BASE_URL}/appointments/customer/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments. The backend might be offline.');
      }
      const data = await response.json();

      console.log('Fetched appointments:', data);
      
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Error in fetchAppointments:', error);
      setError(error.message);
      setAppointments([]); // Fallback to empty list
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
