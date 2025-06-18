
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";

interface LoyaltySectionProps {
  points: number;
  onRedeemPoints: (points: number) => void;
}

const LoyaltySection = ({ points = 850, onRedeemPoints }: LoyaltySectionProps) => {
  const [redeemAmount, setRedeemAmount] = useState("");
  const [currentPoints, setCurrentPoints] = useState(points);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();
  const { settings, isLoading: settingsLoading } = useSettings();
  const { user } = useAuth();

  // Get settings with defaults
  const loyaltySettings = settings?.loyalty_settings || { 
    points_per_dollar: 10, 
    min_redemption: 100, 
    redemption_rate: 10 
  };
  const loyaltyTiers = settings?.loyalty_tiers || { 
    bronze: 0, 
    silver: 500, 
    gold: 1000, 
    platinum: 2000 
  };

  useEffect(() => {
    setCurrentPoints(points);
  }, [points]);

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmount);
    
    if (!redeemAmount || isNaN(amount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of points to redeem.",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive number of points.",
        variant: "destructive",
      });
      return;
    }

    if (amount > currentPoints) {
      toast({
        title: "Insufficient Points",
        description: `You only have ${currentPoints} points available.`,
        variant: "destructive",
      });
      return;
    }

    if (amount < loyaltySettings.min_redemption) {
      toast({
        title: "Minimum Required",
        description: `Minimum redemption is ${loyaltySettings.min_redemption} points ($${(loyaltySettings.min_redemption / loyaltySettings.redemption_rate).toFixed(2)}).`,
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Simulate points redemption with local storage for demo
      const newPoints = currentPoints - amount;
      
      // Store user points in localStorage for demo
      const userPointsKey = `user_points_${user.id}`;
      localStorage.setItem(userPointsKey, newPoints.toString());

      const dollarValue = (amount / loyaltySettings.redemption_rate).toFixed(2);
      
      // Update local state
      setCurrentPoints(newPoints);
      
      // Call parent function if provided
      if (onRedeemPoints) {
        onRedeemPoints(amount);
      }
      
      toast({
        title: "Points Redeemed!",
        description: `${amount} points redeemed for $${dollarValue} credit.`,
      });
      
      setRedeemAmount("");
    } catch (error: any) {
      console.error('Error redeeming points:', error);
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const getNextRewardLevel = () => {
    const tiers = Object.entries(loyaltyTiers).sort(([,a], [,b]) => a - b);
    
    for (let i = 0; i < tiers.length; i++) {
      const [tierName, threshold] = tiers[i];
      if (currentPoints < threshold) {
        const prevTier = i > 0 ? tiers[i-1] : null;
        return { 
          level: prevTier ? prevTier[0] : "Bronze", 
          needed: threshold - currentPoints, 
          next: tierName 
        };
      }
    }
    
    // User has reached highest tier
    const highestTier = tiers[tiers.length - 1];
    return { level: highestTier[0], needed: 0, next: "VIP" };
  };

  const rewardInfo = getNextRewardLevel();

  const isRedeemDisabled = () => {
    const amount = parseInt(redeemAmount);
    return !redeemAmount || 
           isNaN(amount) || 
           amount < loyaltySettings.min_redemption || 
           amount > currentPoints ||
           isRedeeming ||
           settingsLoading;
  };

  if (settingsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading loyalty settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Loyalty Points
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100">
            {rewardInfo.level} Member
          </Badge>
        </CardTitle>
        <CardDescription>
          Earn points with every purchase and redeem for discounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">{currentPoints}</div>
          <div className="text-sm text-gray-600">Available Points</div>
          <div className="text-xs text-gray-500 mt-1">
            = ${(currentPoints / loyaltySettings.redemption_rate).toFixed(2)} in rewards
          </div>
        </div>

        {rewardInfo.needed > 0 && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-800 mb-2">
              Next Level: {rewardInfo.next}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentPoints % 500) / 500) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {rewardInfo.needed} more points to reach {rewardInfo.next}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Redeem Points ({loyaltySettings.min_redemption} points minimum = ${(loyaltySettings.min_redemption / loyaltySettings.redemption_rate).toFixed(2)})
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter points"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              min={loyaltySettings.min_redemption}
              step="10"
              max={currentPoints}
              disabled={isRedeeming}
            />
            <Button
              onClick={handleRedeem}
              disabled={isRedeemDisabled()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Gift className="w-4 h-4 mr-2" />
              {isRedeeming ? "Redeeming..." : "Redeem"}
            </Button>
          </div>
          {redeemAmount && parseInt(redeemAmount) >= loyaltySettings.min_redemption && parseInt(redeemAmount) <= currentPoints && (
            <div className="text-sm text-green-600">
              = ${(parseInt(redeemAmount) / loyaltySettings.redemption_rate).toFixed(2)} credit
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">How to earn points:</p>
          <ul className="space-y-1">
            <li>• {loyaltySettings.points_per_dollar} points for every $1 spent</li>
            <li>• 100 bonus points for new account</li>
            <li>• 50 points for each referral</li>
            <li>• 25 points for social media shares</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltySection;
