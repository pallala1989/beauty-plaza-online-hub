import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";

export const useBookingData = () => {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      console.log('Services fetched successfully:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      console.log('Fetching technicians...');
      
      const { data, error, count } = await supabase
        .from('technicians')
        .select('*', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching technicians:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('Raw technicians data:', data);
      console.log('Technicians count:', count);
      
      const availableTechnicians = data?.filter(tech => tech.is_available === true) || [];
      console.log('Available technicians:', availableTechnicians);
      
      setTechnicians(availableTechnicians);
    } catch (error) {
      console.error('Error in fetchTechnicians:', error);
      setTechnicians([]);
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
