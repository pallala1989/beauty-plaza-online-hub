
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
      
      if (error) throw error;
      console.log('Services fetched:', data);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      console.log('Fetching technicians...');
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      console.log('Technicians fetched:', data);
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchBookedSlots = async (selectedDate: Date, selectedTechnician: string) => {
    if (!selectedDate || !selectedTechnician) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('technician_id', selectedTechnician)
        .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['scheduled', 'confirmed']);
      
      if (error) throw error;
      
      const booked = data?.map(appointment => appointment.appointment_time) || [];
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchServices();
    fetchTechnicians();
  }, []);

  return {
    services,
    technicians,
    bookedSlots,
    fetchBookedSlots
  };
};
