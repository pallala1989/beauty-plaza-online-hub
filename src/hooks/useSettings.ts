
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Settings {
  service_prices: Record<string, number>;
  referral_amounts: { referrer_credit: number; referred_discount: number };
  loyalty_settings: { points_per_dollar: number; min_redemption: number; redemption_rate: number };
  in_home_fee: number;
  loyalty_tiers: { bronze: number; silver: number; gold: number; platinum: number };
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      // Use rpc call to fetch settings with type assertion
      const { data, error } = await (supabase as any).rpc('get_settings');
      
      if (error) {
        // Fallback to direct query with type assertion
        const { data: fallbackData, error: fallbackError } = await (supabase as any)
          .from('settings')
          .select('key, value');
        
        if (fallbackError) throw fallbackError;
        
        const settingsMap: any = {};
        fallbackData?.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });
        
        setSettings(settingsMap);
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default values if fetch fails
      setSettings({
        service_prices: { facial: 75, haircut: 50, manicure: 35, pedicure: 45 },
        referral_amounts: { referrer_credit: 10, referred_discount: 10 },
        loyalty_settings: { points_per_dollar: 10, min_redemption: 100, redemption_rate: 10 },
        in_home_fee: 25,
        loyalty_tiers: { bronze: 0, silver: 500, gold: 1000, platinum: 2000 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      // Use type assertion to bypass TypeScript checking
      const { error } = await (supabase as any)
        .from('settings')
        .upsert({ key, value });
      
      if (error) throw error;
      
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
