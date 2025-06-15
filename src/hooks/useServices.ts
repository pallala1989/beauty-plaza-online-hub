
import { useState, useEffect } from 'react';
import localServices from '@/data/services.json';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  popular: boolean;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) {
          throw new Error('Backend not available. Falling back to local data.');
        }
        const data = await response.json();
        setServices(data);
        console.log('Services fetched from backend.');
      } catch (err) {
        console.warn((err as Error).message);
        setServices(localServices as Service[]);
        console.log('Services loaded from local fallback data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, isLoading, error };
};
