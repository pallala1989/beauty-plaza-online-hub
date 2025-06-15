import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

interface Settings {
  service_prices: Record<string, number>;
  referral_amounts: { referrer_credit: number; referred_discount: number };
  loyalty_settings: { points_per_dollar: number; min_redemption: number; redemption_rate: number };
  in_home_fee: number;
  loyalty_tiers: { bronze: number; silver: number; gold: number; platinum: number };
  contact_phone?: string;
  contact_email?: string;
  contact_address_line1?: string;
  contact_address_line2?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default values if fetch fails
      setSettings({
        service_prices: { facial: 75, haircut: 50, manicure: 35, pedicure: 45 },
        referral_amounts: { referrer_credit: 10, referred_discount: 10 },
        loyalty_settings: { points_per_dollar: 10, min_redemption: 100, redemption_rate: 10 },
        in_home_fee: 25,
        loyalty_tiers: { bronze: 0, silver: 500, gold: 1000, platinum: 2000 },
        contact_phone: '(903) 921-0271',
        contact_email: 'info@beautyplaza.com',
        contact_address_line1: '2604 Jacqueline Dr',
        contact_address_line2: 'Wilmington, DE - 19810'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
      
      // Refresh settings
      await fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, isLoading, updateSetting, refetch: fetchSettings };
};
