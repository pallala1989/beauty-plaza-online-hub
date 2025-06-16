
import { useState, useEffect } from 'react';
import servicesData from '@/data/services.json';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      console.log('Attempting to fetch services from backend...');
      
      // Try to fetch from Spring Boot backend first
      const response = await fetch('http://localhost:8080/api/services');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Services fetched from backend:', data);
        setServices(data);
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.log('Backend unavailable, using local data:', error);
      // Fallback to local JSON data
      setServices(servicesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    refetch: fetchServices
  };
};
