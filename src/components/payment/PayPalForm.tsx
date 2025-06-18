
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

interface PayPalFormProps {
  amount: string;
  onPaymentComplete: (paymentData: any) => void;
  onBack: () => void;
}

const PayPalForm = ({ amount, onPaymentComplete, onBack }: PayPalFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayPalPayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: "paypal",
        amount: parseFloat(amount),
        transactionId: `pp_${Date.now()}`,
        status: "completed"
      };

      onPaymentComplete(paymentData);
      
      toast({
        title: "Payment Successful!",
        description: `Your PayPal payment for $${amount} has been processed.`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your PayPal payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="w-6 h-6 mr-2 text-blue-600" />
          PayPal Payment
        </CardTitle>
        <CardDescription>
          You will be redirected to PayPal to complete your payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Gift Card Amount:</span>
              <span>${amount}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${amount}</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Click the button below to continue with PayPal. You'll be redirected to PayPal's secure checkout page.
          </p>
          
          <Button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            {isProcessing ? "Redirecting to PayPal..." : `Pay $${amount} with PayPal`}
          </Button>
          
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
            disabled={isProcessing}
          >
            Back to Payment Methods
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalForm;
