
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { buildApiUrl } from '@/config/environment';
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
  const [services, setServices] = useState<Service[]>([]);
  const [beautyservices, setBeautyservices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching services from Spring Boot backend...');
        
        // Try Spring Boot backend first
        try {
          const response = await fetch(buildApiUrl('/api/services'), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Services fetched from Spring Boot backend:', data);
            setServices(data);
            setBeautyservices(data);
            return;
          } else {
            console.log('Spring Boot response not ok:', response.status, response.statusText);
          }
        } catch (backendError) {
          console.log('Spring Boot unavailable:', backendError);
        }
        
        // Fallback to local data
        console.log('Using local services data as fallback');
        setServices(servicesData);
        setBeautyservices(servicesData);
        
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
        setServices(servicesData); // Fallback to local data
        setBeautyservices(servicesData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        console.log('Fetching technicians from Spring Boot backend...');
        
        // Try Spring Boot backend first
        try {
          const response = await fetch(buildApiUrl('/api/technicians'), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Technicians fetched from Spring Boot backend:', data);
            setTechnicians(data);
            return;
          } else {
            console.log('Spring Boot technicians response not ok:', response.status);
          }
        } catch (backendError) {
          console.log('Spring Boot technicians unavailable:', backendError);
        }
        
        // Fallback to local data
        console.log('Using local technicians data as fallback');
        setTechnicians(techniciansData);
        
      } catch (error: any) {
        console.error('Error fetching technicians:', error);
        setTechnicians(techniciansData); // Fallback to local data
      }
    };

    fetchTechnicians();
  }, []);

  // Fetch time slots
  const fetchTimeSlots = useCallback(async (serviceId: string, technicianId: string, serviceType: string, date?: string) => {
    try {
      setIsFetchingSlots(true);
      console.log('Fetching time slots from Spring Boot backend...', { serviceId, technicianId, serviceType, date });
      
      const queryParams = new URLSearchParams({
        serviceId,
        technicianId,
        serviceType,
        ...(date && { date })
      });
      
      // Try Spring Boot backend first
      try {
        const response = await fetch(buildApiUrl(`/api/appointments/available-slots?${queryParams}`), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(user && { 'Authorization': `Bearer ${user.id}` })
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Time slots fetched from Spring Boot backend:', data);
          setTimeSlots(data);
          return;
        } else {
          console.log('Spring Boot slots response not ok:', response.status);
        }
      } catch (error) {
        console.log('Spring Boot slots fetch failed:', error);
      }
      
      // Fallback to mock data
      const allTimeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
      ];
      
      // Generate some random booked slots for demo
      const numBooked = Math.floor(Math.random() * 5);
      const bookedTimes = allTimeSlots.slice(0, numBooked);
      
      const mockSlots: TimeSlot[] = allTimeSlots.map(time => ({
        time,
        available: !bookedTimes.includes(time),
        booked: bookedTimes.includes(time)
      }));
      
      console.log('Using mock time slots:', mockSlots);
      setTimeSlots(mockSlots);
      
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setIsFetchingSlots(false);
    }
  }, [user]);

  // Fetch monthly booked data
  const fetchMonthlyBookedData = useCallback(async (month: Date, technicianId: string) => {
    try {
      setIsFetchingSlots(true);
      
      // Mock monthly data for demo
      const mockData: {[key: string]: string[]} = {};
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const numBookedSlots = Math.floor(Math.random() * 8);
        const bookedSlots = [];
        
        for (let i = 0; i < numBookedSlots; i++) {
          const hour = 9 + Math.floor(Math.random() * 9);
          const minute = Math.random() > 0.5 ? '30' : '00';
          bookedSlots.push(`${String(hour).padStart(2, '0')}:${minute}`);
        }
        
        mockData[dateKey] = [...new Set(bookedSlots)]; // Remove duplicates
      }
      
      setMonthlyBookedData(mockData);
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
    // Refresh current slots if needed
    console.log('Refreshing booked slots...');
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
