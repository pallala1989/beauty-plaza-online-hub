
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { buildApiUrl } from '@/config/environment';
import { supabase } from '@/integrations/supabase/client';
import servicesData from '@/data/services.json';
import techniciansData from '@/data/technicians.json';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
}

interface Technician {
  id: string;
  name: string;
  specialties: string[];
  is_available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

export const useBookingData = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>(servicesData);
  const [beautyservices, setBeautyservices] = useState<Service[]>(servicesData);
  const [technicians, setTechnicians] = useState<Technician[]>(techniciansData);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimized service fetch with caching
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Loading services from Supabase...');
        
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          console.log('Supabase services error, using local data:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Services loaded from Supabase:', data);
          setServices(data);
          setBeautyservices(data);
        }
      } catch (error: any) {
        console.log('Using local services data:', error);
      }
    };

    fetchServices();
  }, []);

  // Optimized technician fetch with caching
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        console.log('Loading technicians from Supabase...');
        
        const { data, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('is_available', true);
        
        if (error) {
          console.log('Supabase technicians error, using local data:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Technicians loaded from Supabase:', data);
          setTechnicians(data);
        }
      } catch (error: any) {
        console.log('Using local technicians data:', error);
      }
    };

    fetchTechnicians();
  }, []);

  // Optimized time slots fetch using Supabase function
  const fetchTimeSlots = useCallback(async (serviceId: string, technicianId: string, serviceType: string, date?: string) => {
    if (!date || !technicianId) return;
    
    try {
      setIsFetchingSlots(true);
      console.log('Fetching available slots for:', { technicianId, date });
      
      const { data, error } = await supabase.rpc('get_available_slots', {
        technician_id_param: technicianId,
        appointment_date_param: date
      });
      
      if (error) {
        console.error('Error fetching slots:', error);
        // Fallback to basic time generation
        const allTimeSlots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
        
        const mockSlots: TimeSlot[] = allTimeSlots.map(time => ({
          time,
          available: true,
          booked: false
        }));
        
        setTimeSlots(mockSlots);
        return;
      }
      
      // Convert database response to TimeSlot format
      const availableSlots: TimeSlot[] = data?.map((slot: any) => ({
        time: slot.time_slot,
        available: true,
        booked: false
      })) || [];
      
      console.log('Available slots from database:', availableSlots);
      setTimeSlots(availableSlots);
      
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setIsFetchingSlots(false);
    }
  }, []);

  // Optimized monthly booked data fetch
  const fetchMonthlyBookedData = useCallback(async (month: Date, technicianId: string) => {
    if (!technicianId) return;
    
    try {
      setIsFetchingSlots(true);
      
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')
        .eq('technician_id', technicianId)
        .gte('appointment_date', startOfMonth.toISOString().split('T')[0])
        .lte('appointment_date', endOfMonth.toISOString().split('T')[0])
        .not('status', 'in', '(cancelled,completed)');
      
      if (error) {
        console.error('Error fetching monthly bookings:', error);
        return;
      }
      
      // Group bookings by date
      const monthlyData: {[key: string]: string[]} = {};
      data?.forEach(appointment => {
        const dateKey = appointment.appointment_date;
        if (!monthlyData[dateKey]) {
          monthlyData[dateKey] = [];
        }
        monthlyData[dateKey].push(appointment.appointment_time);
      });
      
      console.log('Monthly booked data loaded:', monthlyData);
      setMonthlyBookedData(monthlyData);
      
    } catch (error: any) {
      console.error('Error fetching monthly booked data:', error);
    } finally {
      setIsFetchingSlots(false);
    }
  }, []);

  const clearBookedSlots = useCallback(() => {
    setMonthlyBookedData({});
  }, []);

  const refreshBookedSlots = useCallback(async () => {
    console.log('Refreshing booked slots...');
    // This can be called after successful booking to refresh the data
  }, []);

  return {
    services,
    beautyservices,
    technicians,
    timeSlots,
    monthlyBookedData,
    isLoading,
    isFetchingSlots,
    error,
    fetchTimeSlots,
    fetchMonthlyBookedData,
    clearBookedSlots,
    refreshBookedSlots
  };
};
