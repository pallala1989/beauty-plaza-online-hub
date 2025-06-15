
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
      
      // First, let's try a simple query to see if we can access the table at all
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
      
      // Filter for available technicians
      const availableTechnicians = data?.filter(tech => tech.is_available === true) || [];
      console.log('Available technicians:', availableTechnicians);
      
      setTechnicians(availableTechnicians);
    } catch (error) {
      console.error('Error in fetchTechnicians:', error);
      // Set empty array on error to prevent undefined issues
      setTechnicians([]);
    }
  };

  const fetchBookedSlots = async (selectedDate: Date, selectedTechnician: string) => {
    if (!selectedDate || !selectedTechnician) {
      console.log('fetchBookedSlots: Missing date or technician', { selectedDate, selectedTechnician });
      return;
    }

    try {
      console.log('Fetching booked slots for:', { selectedDate, selectedTechnician });
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('technician_id', selectedTechnician)
        .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['scheduled', 'confirmed']);
      
      if (error) {
        console.error('Error fetching booked slots:', error);
        throw error;
      }
      
      const booked = data?.map(appointment => appointment.appointment_time) || [];
      console.log('Booked slots found:', booked);
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchServices();
    fetchTechnicians();
  }, []);

  // Add effect to log when technicians state changes
  useEffect(() => {
    console.log('Technicians state updated:', technicians);
  }, [technicians]);

  return {
    services,
    technicians,
    bookedSlots,
    fetchBookedSlots
  };
};
