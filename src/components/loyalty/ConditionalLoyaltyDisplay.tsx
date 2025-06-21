
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
  
  // Check if loyalty is enabled via navigation settings (default to true if not set)
  const isLoyaltyEnabled = settings?.navigation_settings?.show_loyalty !== false;
  
  if (!isLoyaltyEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default ConditionalLoyaltyDisplay;
