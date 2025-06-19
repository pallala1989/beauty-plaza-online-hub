
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { format } from 'date-fns';
import servicesData from "@/data/services.json";
import techniciansData from "@/data/technicians.json";
import beautyservicesData from "@/data/beautyservices.json";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export const useBookingData = () => {
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  // Services query
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        // First try to fetch from API
        const response = await fetch('http://localhost:8080/api/services');
        if (!response.ok) throw new Error('API not available');
        return await response.json();
      } catch (error) {
        // Fallback to local data
        console.log('Using local services data');
        return servicesData;
      }
    }
  });

  // Beauty services query  
  const { data: beautyservices = [] } = useQuery({
    queryKey: ['beautyservices'],
    queryFn: () => beautyservicesData
  });

  // Technicians query
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      try {
        // First try to fetch from API
        const response = await fetch('http://localhost:8080/api/technicians');
        if (!response.ok) throw new Error('API not available');
        return await response.json();
      } catch (error) {
        // Fallback to local data
        console.log('Using local technicians data');
        return techniciansData;
      }
    }
  });

  const fetchMonthlyBookedData = useCallback(async (month: Date, technicianId: string) => {
    setIsFetchingSlots(true);
    console.log('Fetching monthly booked data for:', format(month, 'yyyy-MM'), 'technician:', technicianId);

    try {
      // Get the first and last day of the month
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthData: Record<string, string[]> = {};

      // Generate data for each day of the month
      for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
        const dateKey = format(date, 'yyyy-MM-dd');
        
        // Check localStorage for booked slots
        const bookedSlotsKey = `booked_slots_${technicianId}_${dateKey}`;
        const localBookedSlots = JSON.parse(localStorage.getItem(bookedSlotsKey) || '[]');
        
        // Simulate some random booked slots for demo (but respect localStorage)
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPast = date < new Date();
        
        let bookedSlots: string[] = [...localBookedSlots];
        
        // Add some demo booked slots if none exist in localStorage
        if (localBookedSlots.length === 0 && !isPast) {
          if (isWeekend) {
            bookedSlots = timeSlots.slice(0, Math.floor(Math.random() * 3));
          } else {
            const numBooked = Math.floor(Math.random() * 5);
            bookedSlots = timeSlots.slice(0, numBooked);
          }
        } else if (isPast) {
          // Past dates should have more booked slots
          bookedSlots = timeSlots.slice(0, Math.floor(timeSlots.length * 0.7));
        }
        
        monthData[dateKey] = bookedSlots;
      }

      console.log('Monthly booked data:', monthData);
      setMonthlyBookedData(monthData);

    } catch (error) {
      console.error('Error fetching monthly booked data:', error);
      setMonthlyBookedData({});
    } finally {
      setIsFetchingSlots(false);
    }
  }, []);

  const refreshBookedSlots = useCallback(async (date?: Date, technicianId?: string) => {
    if (date && technicianId) {
      console.log('Refreshing booked slots for:', format(date, 'yyyy-MM-dd'), 'technician:', technicianId);
      await fetchMonthlyBookedData(date, technicianId);
    }
  }, [fetchMonthlyBookedData]);

  const clearBookedSlots = useCallback(() => {
    setMonthlyBookedData({});
  }, []);

  return {
    services,
    beautyservices,
    technicians,
    monthlyBookedData,
    isFetchingSlots,
    fetchMonthlyBookedData,
    refreshBookedSlots,
    clearBookedSlots
  };
};
