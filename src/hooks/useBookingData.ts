
import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth } from "date-fns";
import servicesData from '@/data/services.json';
import techniciansData from '@/data/technicians.json';
import { config, buildApiUrl } from '@/config/environment';

export const useBookingData = () => {
  const [beautyservices, setBeautyServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [monthlyBookedData, setMonthlyBookedData] = useState<Record<string, string[]>>({});
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'available' | 'unavailable'>('unknown');

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUTS.HEALTH_CHECK);
      
      const response = await fetch(buildApiUrl(config.API_ENDPOINTS.HEALTH), {
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

  const fetchBeautyServices = async () => {
    try {
      console.log('Checking Spring Boot backend availability...');
      const isBackendAvailable = await checkBackendHealth();
      
      if (isBackendAvailable) {
        console.log('Fetching beauty services from Spring Boot backend...');
        const response = await fetch(buildApiUrl(config.API_ENDPOINTS.SERVICES), {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Beauty services fetched from Spring Boot backend:', data);
          setBeautyServices(data);
          return;
        }
      }
      
      console.log('Spring Boot unavailable, using local data...');
      setBeautyServices(servicesData);
    } catch (error) {
      console.log('Error fetching beauty services, using local data:', error);
      setBeautyServices(servicesData);
    }
  };

  const fetchTechnicians = async () => {
    try {
      if (backendStatus === 'available') {
        console.log('Fetching technicians from Spring Boot backend...');
        const response = await fetch(buildApiUrl(config.API_ENDPOINTS.TECHNICIANS), {
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
      
      console.log('Spring Boot unavailable, using local data...');
      setTechnicians(techniciansData.filter(tech => tech.is_available));
    } catch (error) {
      console.log('Error fetching technicians, using local data:', error);
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
            buildApiUrl(`${config.API_ENDPOINTS.AVAILABLE_SLOTS}?technicianId=${selectedTechnician}&startDate=${startDate}&endDate=${endDate}`),
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
          console.log('Spring Boot slots fetch failed:', error);
        }
      }
      
      // Fallback to empty data if backend unavailable
      console.log('Backend unavailable, using empty booked slots');
      setMonthlyBookedData({});
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

  const clearBookedSlots = useCallback(() => {
    setMonthlyBookedData({});
  }, []);

  useEffect(() => {
    console.log('useBookingData: Initial fetch triggered');
    fetchBeautyServices();
    fetchTechnicians();
  }, []);

  useEffect(() => {
    console.log('Technicians state updated:', technicians);
  }, [technicians]);

  return {
    services: beautyservices, // Keep this alias for backward compatibility
    beautyservices,
    technicians,
    monthlyBookedData,
    isFetchingSlots,
    backendStatus,
    fetchMonthlyBookedData,
    clearBookedSlots,
    refreshBookedSlots
  };
};
