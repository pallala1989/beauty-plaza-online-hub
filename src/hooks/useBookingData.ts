
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const useBookingData = () => {
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

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

  const fetchBookedSlots = async (selectedDate: Date, selectedTechnician: string) => {
    if (!selectedDate || !selectedTechnician) {
      console.log('fetchBookedSlots: Missing date or technician', { selectedDate, selectedTechnician });
      setBookedSlots([]);
      return;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching booked slots for:', { 
        selectedDate: formattedDate, 
        selectedTechnician 
      });
      
      // Fetch with real-time subscription to ensure we get latest data
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time, status')
        .eq('technician_id', selectedTechnician)
        .eq('appointment_date', formattedDate)
        .in('status', ['scheduled', 'confirmed'])
        .order('appointment_time');
      
      if (error) {
        console.error('Error fetching booked slots:', error);
        throw error;
      }
      
      const booked = data?.map(appointment => appointment.appointment_time.slice(0, 5)) || [];
      console.log('Booked slots found for technician', selectedTechnician, 'on', formattedDate, ':', booked);
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  // Force refresh booked slots - useful for real-time updates
  const refreshBookedSlots = async (selectedDate?: Date, selectedTechnician?: string) => {
    if (selectedDate && selectedTechnician) {
      console.log('Force refreshing booked slots...');
      await fetchBookedSlots(selectedDate, selectedTechnician);
    }
  };

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchServices();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    console.log('Technicians state updated:', technicians);
  }, [technicians]);

  // Clear booked slots when technician changes
  const clearBookedSlots = () => {
    setBookedSlots([]);
  };

  return {
    services,
    technicians,
    bookedSlots,
    fetchBookedSlots,
    clearBookedSlots,
    refreshBookedSlots
  };
};
