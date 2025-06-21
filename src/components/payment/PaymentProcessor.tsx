
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Wallet, DollarSign, Star } from "lucide-react";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";

interface PaymentProcessorProps {
  serviceDetails: {
    name: string;
    price: number;
    duration: number;
  }[];
  totalAmount: number;
  onPaymentComplete: (paymentData: any) => void;
  onCancel: () => void;
}

const PaymentProcessor = ({ serviceDetails, totalAmount, onPaymentComplete, onCancel }: PaymentProcessorProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { points: availablePoints, deductPoints } = useLoyaltyPoints();

  const tipOptions = [0, 5, 10, 15, 20];
  const maxPointsUsable = Math.min(availablePoints, Math.floor(totalAmount * 10)); // Assuming 10 points = $1
  const pointsDiscount = pointsToUse / 10;
  const finalAmount = totalAmount + tipAmount - pointsDiscount;

  const handleTipSelect = (tip: number) => {
    setTipAmount(tip);
    setCustomTip("");
  };

  const handleCustomTip = (value: string) => {
    const amount = parseFloat(value) || 0;
    setCustomTip(value);
    setTipAmount(amount);
  };

  const handlePointsToggle = (checked: boolean) => {
    setUsePoints(checked);
    if (!checked) {
      setPointsToUse(0);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Deduct loyalty points if used
      if (usePoints && pointsToUse > 0) {
        deductPoints(pointsToUse);
      }

      // Generate invoice data
      const invoiceData = {
        id: `INV-${Date.now()}`,
        services: serviceDetails,
        subtotal: totalAmount,
        tip: tipAmount,
        pointsUsed: pointsToUse,
        pointsDiscount: pointsDiscount,
        total: finalAmount,
        paymentMethod,
        timestamp: new Date().toISOString(),
      };

      toast({
        title: "Payment Successful!",
        description: `Payment of $${finalAmount.toFixed(2)} processed successfully.`,
      });

      onPaymentComplete(invoiceData);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Service Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Service Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceDetails.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({service.duration} min)</span>
                </div>
                <span className="font-bold text-pink-600">${service.price}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tip Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add Tip (Optional)</CardTitle>
          <CardDescription>Show your appreciation for great service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {tipOptions.map((tip) => (
              <Button
                key={tip}
                variant={tipAmount === tip ? "default" : "outline"}
                onClick={() => handleTipSelect(tip)}
                className={tipAmount === tip ? "bg-pink-600 hover:bg-pink-700" : ""}
              >
                ${tip}
              </Button>
            ))}
          </div>
          <div>
            <Label htmlFor="customTip">Custom Amount</Label>
            <Input
              id="customTip"
              type="number"
              placeholder="Enter custom tip amount"
              value={customTip}
              onChange={(e) => handleCustomTip(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Points */}
      {availablePoints > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Use Loyalty Points
            </CardTitle>
            <CardDescription>
              You have {availablePoints} points available (${(availablePoints / 10).toFixed(2)} value)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="usePoints"
                checked={usePoints}
                onChange={(e) => handlePointsToggle(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="usePoints">Use loyalty points for discount</Label>
            </div>
            {usePoints && (
              <div>
                <Label htmlFor="pointsAmount">Points to use (max {maxPointsUsable})</Label>
                <Input
                  id="pointsAmount"
                  type="number"
                  value={pointsToUse}
                  onChange={(e) => setPointsToUse(Math.min(parseInt(e.target.value) || 0, maxPointsUsable))}
                  max={maxPointsUsable}
                  min="0"
                  step="10"
                />
                {pointsToUse > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Discount: -${pointsDiscount.toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="apple" id="apple" />
              <Label htmlFor="apple" className="flex items-center cursor-pointer">
                <Smartphone className="w-4 h-4 mr-2 text-black" />
                Apple Pay
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="google" />
              <Label htmlFor="google" className="flex items-center cursor-pointer">
                <Wallet className="w-4 h-4 mr-2 text-blue-600" />
                Google Pay
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center cursor-pointer">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Cash
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-pink-800 mb-4">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between">
                <span>Tip:</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
            )}
            {pointsToUse > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Points Discount ({pointsToUse} points):</span>
                <span>-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-pink-600">${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing || finalAmount < 0}
          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          {isProcessing ? "Processing..." : `Pay $${finalAmount.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentProcessor;
