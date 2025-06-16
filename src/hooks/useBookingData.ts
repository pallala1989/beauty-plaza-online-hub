
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import servicesData from '@/data/services.json';
import techniciansData from '@/data/technicians.json';

const SPRING_BOOT_BASE_URL = 'http://localhost:8080';

export const useBookingData = () => {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setBackendStatus('available');
        return true;
      }
    } catch (error) {
      console.log('Spring Boot backend not available:', error);
    }
    
    setBackendStatus('unavailable');
    return false;
  };

  const fetchServices = async () => {
    try {
      console.log('Checking Spring Boot backend availability...');
      const isBackendAvailable = await checkBackendHealth();
      
      if (isBackendAvailable) {
        console.log('Fetching services from Spring Boot backend...');
        const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/services`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Services fetched from Spring Boot backend:', data);
          setServices(data);
          return;
        }
      }
      
      console.log('Spring Boot unavailable, trying Supabase...');
      
      // Fallback to Supabase
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      console.log('Services fetched from Supabase:', data);
      setServices(data || []);
    } catch (error) {
      console.log('Supabase unavailable, using local data:', error);
      // Final fallback to local JSON
      setServices(servicesData);
    }
  };

  const fetchTechnicians = async () => {
    try {
      if (backendStatus === 'available') {
        console.log('Fetching technicians from Spring Boot backend...');
        const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/technicians`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Technicians fetched from Spring Boot backend:', data);
          setTechnicians(data.filter((tech: any) => tech.is_available));
          return;
        }
      }
      
      console.log('Spring Boot unavailable, trying Supabase...');
      
      // Fallback to Supabase
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_available', true)
        .order('name');
      
      if (error) throw error;
      
      console.log('Technicians fetched from Supabase:', data);
      setTechnicians(data || []);
    } catch (error) {
      console.log('Supabase unavailable, using local data:', error);
      // Final fallback to local JSON
      setTechnicians(techniciansData.filter(tech => tech.is_available));
    }
  };

  const fetchMonthlyBookedData = useCallback(async (month: Date, selectedTechnician: string) => {
    if (!month || !selectedTechnician) {
      setMonthlyBookedData({});
      return;
    }

    setIsFetchingSlots(true);
    try {
      const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(month), 'yyyy-MM-dd');
      
      console.log('Fetching monthly booked slots for:', { 
        month: format(month, 'yyyy-MM'), 
        selectedTechnician 
      });
      
      // Try Spring Boot backend first if available
      if (backendStatus === 'available') {
        try {
          const response = await fetch(
            `${SPRING_BOOT_BASE_URL}/api/appointments/slots?` +
            `technicianId=${selectedTechnician}&startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log('Monthly booked slots from Spring Boot:', data);
            setMonthlyBookedData(data.bookedSlots || {});
            return;
          }
        } catch (error) {
          console.log('Spring Boot slots fetch failed, falling back to Supabase:', error);
        }
      }
      
      // Fallback to Supabase
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time, status')
        .eq('technician_id', selectedTechnician)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .in('status', ['scheduled', 'confirmed'])
        .order('appointment_time');
      
      if (error) {
        console.error('Error fetching monthly booked slots:', error);
        throw error;
      }
      
      const slotsByDate: Record<string, string[]> = {};
      data?.forEach(appointment => {
          const dateKey = appointment.appointment_date;
          if (!slotsByDate[dateKey]) {
              slotsByDate[dateKey] = [];
          }
          slotsByDate[dateKey].push(appointment.appointment_time.slice(0, 5));
      });

      console.log('Monthly booked slots found for technician', selectedTechnician, 'on', format(month, 'yyyy-MM'), ':', slotsByDate);
      setMonthlyBookedData(slotsByDate);
    } catch (error) {
      console.error('Error fetching monthly booked slots:', error);
      setMonthlyBookedData({});
    } finally {
      setIsFetchingSlots(false);
    }
  }, [backendStatus]);

  const refreshBookedSlots = useCallback(async (month?: Date, selectedTechnician?: string) => {
    if (month && selectedTechnician) {
      console.log('Force refreshing monthly booked slots...');
      await fetchMonthlyBookedData(month, selectedTechnician);
    }
  }, [fetchMonthlyBookedData]);

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchServices();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    console.log('Technicians state updated:', technicians);
  }, [technicians]);

  const clearBookedSlots = useCallback(() => {
    setMonthlyBookedData({});
  }, []);

  return {
    services,
    technicians,
    monthlyBookedData,
    isFetchingSlots,
    backendStatus,
    fetchMonthlyBookedData,
    clearBookedSlots,
    refreshBookedSlots
  };
};
