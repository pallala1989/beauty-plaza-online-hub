import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import servicesData from '@/data/services.json';
import techniciansData from '@/data/technicians.json';

export const useBookingData = () => {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from backend...');
      
      // Try Spring Boot backend first
      const response = await fetch('http://localhost:8080/api/services');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Services fetched from backend:', data);
        setServices(data);
        return;
      }
    } catch (error) {
      console.log('Backend unavailable, trying Supabase...');
    }

    try {
      // Fallback to Supabase
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      
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
      console.log('Fetching technicians from backend...');
      
      // Try Spring Boot backend first
      const response = await fetch('http://localhost:8080/api/technicians');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Technicians fetched from backend:', data);
        setTechnicians(data.filter((tech: any) => tech.is_available));
        return;
      }
    } catch (error) {
      console.log('Backend unavailable, trying Supabase...');
    }

    try {
      // Fallback to Supabase
      const { data, error } = await supabase
        .from('technicians')
        .select('*');
      
      if (error) throw error;
      
      const availableTechnicians = data?.filter(tech => tech.is_available === true) || [];
      console.log('Technicians fetched from Supabase:', availableTechnicians);
      setTechnicians(availableTechnicians);
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
  }, []);

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
    fetchMonthlyBookedData,
    clearBookedSlots,
    refreshBookedSlots
  };
};
