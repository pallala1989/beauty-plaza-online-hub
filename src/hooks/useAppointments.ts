
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { buildApiUrl } from '@/config/environment';

interface AppointmentWithDetails {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_amount: number;
  service_type: string;
  notes?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  service: {
    name: string;
    price: number;
  };
  technician: {
    name: string;
  };
  services?: Array<{
    name: string;
    price: number;
  }>;
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
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching appointments for user:', user.id);
      
      // Try Spring Boot backend first
      try {
        const response = await fetch(buildApiUrl(`/api/appointments/user/${user.id}`), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.id}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Appointments fetched from Spring Boot:', data);
          setAppointments(data);
          return;
        } else {
          console.log('Spring Boot response not ok:', response.status, response.statusText);
        }
      } catch (backendError) {
        console.log('Spring Boot unavailable:', backendError);
      }
      
      // Fallback to mock data
      const mockAppointments: AppointmentWithDetails[] = [
        {
          id: '1',
          appointment_date: '2024-01-20',
          appointment_time: '10:00',
          status: 'scheduled',
          total_amount: 75,
          service_type: 'in-store',
          notes: 'Regular manicure',
          service: {
            name: 'Classic Manicure',
            price: 75
          },
          technician: {
            name: 'Sarah Johnson'
          }
        }
      ];

      console.log('Using fallback appointment data');
      setAppointments(mockAppointments);
    } catch (error: any) {
      console.error('Error in fetchAppointments:', error);
      setError('Failed to load appointments');
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
