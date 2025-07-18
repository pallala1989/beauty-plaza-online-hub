import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Settings, DollarSign, Gift, Users, Award, Contact, Navigation } from "lucide-react";

const AdminSettings = () => {
  const { user, profile } = useAuth();
  const { settings, isLoading, updateSetting } = useSettings();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Form states
  const [referralAmounts, setReferralAmounts] = useState({
    referrer_credit: 10,
    referred_discount: 10
  });
  const [loyaltySettings, setLoyaltySettings] = useState({
    points_per_dollar: 10,
    min_redemption: 100,
    redemption_rate: 10
  });
  const [loyaltyTiers, setLoyaltyTiers] = useState({
    bronze: 0,
    silver: 500,
    gold: 1000,
    platinum: 2000
  });
  const [inHomeFee, setInHomeFee] = useState(25);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress1, setContactAddress1] = useState("");
  const [contactAddress2, setContactAddress2] = useState("");
  const [navigationSettings, setNavigationSettings] = useState({
    show_promotions: true,
    show_loyalty: true,
    show_gift_cards: true,
    show_refer_friend: true
  });

  useEffect(() => {
    // Debugging for admin role
    console.log("AdminSettings Auth Check:", { user, profile, isAdmin: profile?.role === 'admin' });

    if (settings) {
      setReferralAmounts(settings.referral_amounts || { referrer_credit: 10, referred_discount: 10 });
      setLoyaltySettings(settings.loyalty_settings || { points_per_dollar: 10, min_redemption: 100, redemption_rate: 10 });
      setLoyaltyTiers(settings.loyalty_tiers || { bronze: 0, silver: 500, gold: 1000, platinum: 2000 });
      setInHomeFee(settings.in_home_fee || 25);
      setContactPhone(settings.contact_phone || "");
      setContactEmail(settings.contact_email || "");
      setContactAddress1(settings.contact_address_line1 || "");
      setContactAddress2(settings.contact_address_line2 || "");
      setNavigationSettings(settings.navigation_settings || {
        show_promotions: true,
        show_loyalty: true,
        show_gift_cards: true,
        show_refer_friend: true
      });
    }
  }, [settings, user, profile]);

  // Check if user is admin
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleUpdateSettings = async () => {
    setIsUpdating(true);
    try {
      await Promise.all([
        updateSetting('referral_amounts', referralAmounts),
        updateSetting('loyalty_settings', loyaltySettings),
        updateSetting('loyalty_tiers', loyaltyTiers),
        updateSetting('in_home_fee', inHomeFee),
        updateSetting('contact_phone', contactPhone),
        updateSetting('contact_email', contactEmail),
        updateSetting('contact_address_line1', contactAddress1),
        updateSetting('contact_address_line2', contactAddress2),
        updateSetting('navigation_settings', navigationSettings),
      ]);

      toast({
        title: "Settings Updated",
        description: "All settings have been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Admin Settings
          </h1>
          <p className="text-gray-600 mt-2">Configure pricing and program settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Navigation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                Navigation Settings
              </CardTitle>
              <CardDescription>Control which menu items are visible to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show_promotions">Show Promotions</Label>
                <Switch
                  id="show_promotions"
                  checked={navigationSettings.show_promotions}
                  onCheckedChange={(checked) => setNavigationSettings(prev => ({
                    ...prev,
                    show_promotions: checked
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show_loyalty">Show Loyalty Program</Label>
                <Switch
                  id="show_loyalty"
                  checked={navigationSettings.show_loyalty}
                  onCheckedChange={(checked) => setNavigationSettings(prev => ({
                    ...prev,
                    show_loyalty: checked
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show_gift_cards">Show Gift Cards</Label>
                <Switch
                  id="show_gift_cards"
                  checked={navigationSettings.show_gift_cards}
                  onCheckedChange={(checked) => setNavigationSettings(prev => ({
                    ...prev,
                    show_gift_cards: checked
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show_refer_friend">Show Refer Friend</Label>
                <Switch
                  id="show_refer_friend"
                  checked={navigationSettings.show_refer_friend}
                  onCheckedChange={(checked) => setNavigationSettings(prev => ({
                    ...prev,
                    show_refer_friend: checked
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Contact className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>Update public contact details for the website</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_address1">Address Line 1</Label>
                <Input
                  id="contact_address1"
                  type="text"
                  value={contactAddress1}
                  onChange={(e) => setContactAddress1(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact_address2">Address Line 2</Label>
                <Input
                  id="contact_address2"
                  type="text"
                  value={contactAddress2}
                  onChange={(e) => setContactAddress2(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Referral Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-600" />
                Referral Program
              </CardTitle>
              <CardDescription>Configure referral rewards and discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="referrer_credit">Referrer Credit ($)</Label>
                <Input
                  id="referrer_credit"
                  type="number"
                  value={referralAmounts.referrer_credit}
                  onChange={(e) => setReferralAmounts(prev => ({
                    ...prev,
                    referrer_credit: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="referred_discount">Referred User Discount ($)</Label>
                <Input
                  id="referred_discount"
                  type="number"
                  value={referralAmounts.referred_discount}
                  onChange={(e) => setReferralAmounts(prev => ({
                    ...prev,
                    referred_discount: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2 text-purple-600" />
                Loyalty Program
              </CardTitle>
              <CardDescription>Configure points and redemption settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="points_per_dollar">Points per Dollar Spent</Label>
                <Input
                  id="points_per_dollar"
                  type="number"
                  value={loyaltySettings.points_per_dollar}
                  onChange={(e) => setLoyaltySettings(prev => ({
                    ...prev,
                    points_per_dollar: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="min_redemption">Minimum Redemption Points</Label>
                <Input
                  id="min_redemption"
                  type="number"
                  value={loyaltySettings.min_redemption}
                  onChange={(e) => setLoyaltySettings(prev => ({
                    ...prev,
                    min_redemption: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="redemption_rate">Points per Dollar Value</Label>
                <Input
                  id="redemption_rate"
                  type="number"
                  value={loyaltySettings.redemption_rate}
                  onChange={(e) => setLoyaltySettings(prev => ({
                    ...prev,
                    redemption_rate: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Loyalty Tiers
              </CardTitle>
              <CardDescription>Set point thresholds for each tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bronze">Bronze Tier (Points)</Label>
                <Input
                  id="bronze"
                  type="number"
                  value={loyaltyTiers.bronze}
                  onChange={(e) => setLoyaltyTiers(prev => ({
                    ...prev,
                    bronze: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="silver">Silver Tier (Points)</Label>
                <Input
                  id="silver"
                  type="number"
                  value={loyaltyTiers.silver}
                  onChange={(e) => setLoyaltyTiers(prev => ({
                    ...prev,
                    silver: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="gold">Gold Tier (Points)</Label>
                <Input
                  id="gold"
                  type="number"
                  value={loyaltyTiers.gold}
                  onChange={(e) => setLoyaltyTiers(prev => ({
                    ...prev,
                    gold: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="platinum">Platinum Tier (Points)</Label>
                <Input
                  id="platinum"
                  type="number"
                  value={loyaltyTiers.platinum}
                  onChange={(e) => setLoyaltyTiers(prev => ({
                    ...prev,
                    platinum: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Service Pricing
              </CardTitle>
              <CardDescription>Configure additional service fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="in_home_fee">In-Home Service Fee ($)</Label>
                <Input
                  id="in_home_fee"
                  type="number"
                  value={inHomeFee}
                  onChange={(e) => setInHomeFee(parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleUpdateSettings}
            disabled={isUpdating}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            {isUpdating ? "Updating..." : "Update Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
