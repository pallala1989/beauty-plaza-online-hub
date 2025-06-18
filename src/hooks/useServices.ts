
import { useState, useEffect } from 'react';
import servicesData from '@/data/services.json';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
}

const SPRING_BOOT_BASE_URL = 'http://localhost:8080';
const SERVICES_CACHE_KEY = 'services_cache';
const CACHE_EXPIRY_KEY = 'services_cache_expiry';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'spring-boot' | 'supabase' | 'local' | 'cache'>('local');

  const getCachedServices = (): Service[] | null => {
    try {
      const cached = localStorage.getItem(SERVICES_CACHE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cached && expiry && Date.now() < parseInt(expiry)) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.log('Cache retrieval failed:', error);
    }
    return null;
  };

  const setCachedServices = (servicesData: Service[]) => {
    try {
      localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(servicesData));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } catch (error) {
      console.log('Cache storage failed:', error);
    }
  };

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${SPRING_BOOT_BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Spring Boot health check failed:', error);
      return false;
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check cache first
      const cachedServices = getCachedServices();
      if (cachedServices) {
        console.log('Services loaded from cache');
        setServices(cachedServices);
        setDataSource('cache');
        setIsLoading(false);
        return;
      }
      
      console.log('Attempting to fetch services from Spring Boot backend...');
      
      // Try Spring Boot backend first
      const isBackendHealthy = await checkBackendHealth();
      
      if (isBackendHealthy) {
        try {
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
            setCachedServices(data);
            setDataSource('spring-boot');
            return;
          }
        } catch (fetchError) {
          console.log('Spring Boot fetch failed:', fetchError);
        }
      }
      
      console.log('Spring Boot unavailable, trying Supabase...');
      
      // Fallback to Supabase
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        
        console.log('Services fetched from Supabase:', data);
        const supabaseServices = data || [];
        setServices(supabaseServices);
        setCachedServices(supabaseServices);
        setDataSource('supabase');
        return;
      } catch (supabaseError) {
        console.log('Supabase unavailable:', supabaseError);
      }
      
      // Final fallback to local JSON data
      console.log('Using local services data as fallback');
      setServices(servicesData);
      setCachedServices(servicesData);
      setDataSource('local');
      
    } catch (error: any) {
      console.error('Error in fetchServices:', error);
      setError(error.message);
      
      // Use local data as final fallback
      setServices(servicesData);
      setDataSource('local');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(SERVICES_CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    dataSource,
    refetch: fetchServices,
    clearCache
  };
};
