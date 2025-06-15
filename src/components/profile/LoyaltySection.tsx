
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Gift, Star } from "lucide-react";

interface LoyaltySectionProps {
  points: number;
  onRedeemPoints: (points: number) => void;
}

const LoyaltySection = ({ points, onRedeemPoints }: LoyaltySectionProps) => {
  const [redeemAmount, setRedeemAmount] = useState("");
  const { toast } = useToast();

  const handleRedeem = () => {
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

    if (amount > points) {
      toast({
        title: "Insufficient Points",
        description: `You only have ${points} points available.`,
        variant: "destructive",
      });
      return;
    }

    if (amount < 100) {
      toast({
        title: "Minimum Required",
        description: "Minimum redemption is 100 points ($10).",
        variant: "destructive",
      });
      return;
    }

    const dollarValue = (amount / 10).toFixed(2);
    
    // Call the parent function to handle the actual redemption
    onRedeemPoints(amount);
    
    toast({
      title: "Points Redeemed!",
      description: `${amount} points redeemed for $${dollarValue} credit.`,
    });
    
    setRedeemAmount("");
  };

  const getNextRewardLevel = () => {
    if (points < 500) return { level: "Bronze", needed: 500 - points, next: "Silver" };
    if (points < 1000) return { level: "Silver", needed: 1000 - points, next: "Gold" };
    return { level: "Gold", needed: 0, next: "VIP" };
  };

  const rewardInfo = getNextRewardLevel();

  const isRedeemDisabled = () => {
    const amount = parseInt(redeemAmount);
    return !redeemAmount || 
           isNaN(amount) || 
           amount < 100 || 
           amount > points;
  };

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
          <div className="text-3xl font-bold text-pink-600">{points}</div>
          <div className="text-sm text-gray-600">Available Points</div>
          <div className="text-xs text-gray-500 mt-1">
            = ${(points / 10).toFixed(2)} in rewards
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
                style={{ width: `${((points % 500) / 500) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {rewardInfo.needed} more points to reach {rewardInfo.next}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Redeem Points (100 points minimum = $10)
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter points"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              min="100"
              step="10"
              max={points}
            />
            <Button
              onClick={handleRedeem}
              disabled={isRedeemDisabled()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          </div>
          {redeemAmount && parseInt(redeemAmount) >= 100 && parseInt(redeemAmount) <= points && (
            <div className="text-sm text-green-600">
              = ${(parseInt(redeemAmount) / 10).toFixed(2)} credit
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">How to earn points:</p>
          <ul className="space-y-1">
            <li>• 10 points for every $1 spent</li>
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
