import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth } from "date-fns";
import localServices from '@/data/services.json';
import localTechnicians from '@/data/technicians.json';

const API_BASE_URL = 'http://localhost:8080/api';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  is_active: boolean;
}

interface Technician {
  id: string;
  name: string;
  specialties?: string[];
  is_available: boolean;
}

export const useBookingData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from backend...');
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) throw new Error('Backend not available');
      let data = await response.json();
      data = data.filter((s: Service) => s.is_active);
      console.log('Services fetched successfully from backend:', data);
      setServices(data || []);
    } catch (error) {
      console.warn('Failed to fetch services from backend, falling back to local data.');
      setServices(localServices.filter(s => s.popular) as any); // Fallback to popular services
    }
  };

  const fetchTechnicians = async () => {
    try {
      console.log('Fetching technicians from backend...');
      const response = await fetch(`${API_BASE_URL}/technicians`);
      if (!response.ok) throw new Error('Backend not available');
      let data = await response.json();
      const availableTechnicians = data?.filter((tech: Technician) => tech.is_available === true) || [];
      console.log('Available technicians from backend:', availableTechnicians);
      setTechnicians(availableTechnicians);
    } catch (error) {
      console.warn('Failed to fetch technicians from backend, falling back to local data.');
      setTechnicians(localTechnicians.filter(t => t.is_available) as Technician[]);
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
      
      const response = await fetch(`${API_BASE_URL}/appointments/booked-slots?technicianId=${selectedTechnician}&startDate=${startDate}&endDate=${endDate}`);
      if(!response.ok) throw new Error('Failed to fetch booked slots');
      const data = await response.json();
            
      const slotsByDate: Record<string, string[]> = {};
      data?.forEach((appointment: any) => {
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
