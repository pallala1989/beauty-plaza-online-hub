
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { buildApiUrl } from '@/config/environment';

interface ApiRequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiRequestOptions {
  requiresAuth?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApiRequest = <T = any>() => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    isLoading: false,
    error: null
  });

  const makeRequest = useCallback(async (
    endpoint: string,
    options: RequestInit & ApiRequestOptions = {}
  ) => {
    const {
      requiresAuth = false,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      ...fetchOptions
    } = options;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions.headers
      };

      // Add auth header if required
      if (requiresAuth && user) {
        headers['Authorization'] = `Bearer ${user.id}`;
      }

      const response = await fetch(buildApiUrl(endpoint), {
        ...fetchOptions,
        headers
      });

      // Handle authentication errors
      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        signOut();
        navigate('/login');
        throw new Error('Authentication required');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      
      setState(prev => ({ ...prev, data, isLoading: false }));
      
      // Show success message
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
      
    } catch (error: any) {
      console.error('API Request failed:', error);
      
      const errorMsg = error.message || errorMessage || 'An unexpected error occurred';
      setState(prev => ({ ...prev, error: errorMsg, isLoading: false }));
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      
      // Call error callback
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [user, signOut, navigate, toast]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    makeRequest,
    reset
  };
};
