
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
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');
      
      if (error) throw error;
      
      const settingsMap: any = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
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
