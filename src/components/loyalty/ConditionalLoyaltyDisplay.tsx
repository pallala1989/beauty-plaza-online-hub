
import React from 'react';
import { useSettings } from '@/hooks/useSettings';

interface ConditionalLoyaltyDisplayProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ConditionalLoyaltyDisplay: React.FC<ConditionalLoyaltyDisplayProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { settings, isLoading } = useSettings();
  
  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Check if loyalty is enabled (default to true if not set)
  const isLoyaltyEnabled = settings?.loyalty_enabled !== false;
  
  if (!isLoyaltyEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default ConditionalLoyaltyDisplay;
