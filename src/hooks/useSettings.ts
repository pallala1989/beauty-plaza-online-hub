
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
  business_hours?: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  navigation_settings?: {
    show_promotions: boolean;
    show_loyalty: boolean;
    show_gift_cards: boolean;
    show_refer_friend: boolean;
  };
}

const defaultSettings: Settings = {
  service_prices: { facial: 75, haircut: 50, manicure: 35, pedicure: 45 },
  referral_amounts: { referrer_credit: 10, referred_discount: 10 },
  loyalty_settings: { points_per_dollar: 10, min_redemption: 100, redemption_rate: 10 },
  in_home_fee: 25,
  loyalty_tiers: { bronze: 0, silver: 500, gold: 1000, platinum: 2000 },
  contact_phone: '(903) 921-0271',
  contact_email: 'info@beautyplaza.com',
  contact_address_line1: '2604 Jacqueline Dr',
  contact_address_line2: 'Wilmington, DE - 19810',
  business_hours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '10:00', close: '16:00', closed: false }
  },
  navigation_settings: {
    show_promotions: true,
    show_loyalty: true,
    show_gift_cards: true,
    show_refer_friend: true
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings from backend...');
      
      // Try Spring Boot backend first
      const response = await fetch('http://localhost:8080/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Settings fetched from backend:', data);
        setSettings(data);
        return;
      }
    } catch (error) {
      console.log('Backend unavailable, trying Supabase...');
    }

    try {
      // Fallback to Supabase
      const { data, error } = await (supabase as any).rpc('get_settings');
      
      if (error) {
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('settings')
          .select('key, value');
        
        if (fallbackError) throw fallbackError;
        
        const settingsMap: any = {};
        fallbackData?.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });
        
        setSettings({ ...defaultSettings, ...settingsMap });
      } else {
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (error) {
      console.log('Supabase unavailable, using default settings:', error);
      // Final fallback to default settings
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      // Try backend first
      const response = await fetch(`http://localhost:8080/api/admin/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });

      if (response.ok) {
        await fetchSettings();
        return;
      }
    } catch (error) {
      console.log('Backend unavailable, trying Supabase...');
    }

    try {
      // Fallback to Supabase
      const { data, error } = await (supabase as any)
        .from('settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
      
      if (error || !data) {
        const { error: upsertError } = await (supabase as any)
          .from('settings')
          .upsert({ key, value });
        if (upsertError) throw upsertError;
      }
      
      await fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
    
    // Set up an interval to refresh settings every 30 seconds
    const interval = setInterval(fetchSettings, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { settings, isLoading, updateSetting, refetch: fetchSettings };
};
