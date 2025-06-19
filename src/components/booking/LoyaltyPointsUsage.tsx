
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Minus, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";

interface LoyaltyPointsUsageProps {
  totalAmount: number;
  loyaltyPointsToUse: number;
  onPointsChange: (points: number) => void;
}

const LoyaltyPointsUsage: React.FC<LoyaltyPointsUsageProps> = ({
  totalAmount,
  loyaltyPointsToUse,
  onPointsChange
}) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { points: availablePoints } = useLoyaltyPoints();
  
  // Get loyalty settings
  const loyaltySettings = settings?.loyalty_settings || { redemption_rate: 10 };
  
  // Calculate max points that can be used (can't exceed total amount)
  const maxPointsForAmount = Math.floor(totalAmount * loyaltySettings.redemption_rate);
  const maxUsablePoints = Math.min(availablePoints, maxPointsForAmount);
  
  // Calculate discount from points
  const pointsDiscount = loyaltyPointsToUse / loyaltySettings.redemption_rate;
  const finalAmount = Math.max(0, totalAmount - pointsDiscount);

  const handlePointsInputChange = (value: string) => {
    const points = parseInt(value) || 0;
    const validPoints = Math.min(Math.max(0, points), maxUsablePoints);
    onPointsChange(validPoints);
  };

  const adjustPoints = (delta: number) => {
    const newPoints = Math.min(Math.max(0, loyaltyPointsToUse + delta), maxUsablePoints);
    onPointsChange(newPoints);
  };

  const useMaxPoints = () => {
    onPointsChange(maxUsablePoints);
  };

  if (!user || availablePoints === 0) {
    return null;
  }

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Use Loyalty Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span>Available Points:</span>
          <span className="font-semibold text-pink-600">{availablePoints} points</span>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="pointsToUse">Points to use (max {maxUsablePoints}):</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustPoints(-10)}
              disabled={loyaltyPointsToUse <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              id="pointsToUse"
              type="number"
              value={loyaltyPointsToUse}
              onChange={(e) => handlePointsInputChange(e.target.value)}
              min={0}
              max={maxUsablePoints}
              step={10}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustPoints(10)}
              disabled={loyaltyPointsToUse >= maxUsablePoints}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {maxUsablePoints > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useMaxPoints}
              className="w-full"
            >
              Use Maximum Points ({maxUsablePoints})
            </Button>
          )}
        </div>

        {loyaltyPointsToUse > 0 && (
          <div className="bg-green-50 p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span>Points Discount:</span>
              <span className="text-green-600 font-semibold">-${pointsDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>New Total:</span>
              <span className="text-green-600">${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-600">
          {loyaltySettings.redemption_rate} points = $1.00 discount
        </p>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsUsage;
