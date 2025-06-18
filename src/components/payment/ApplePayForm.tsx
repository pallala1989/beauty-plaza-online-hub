
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Smartphone } from "lucide-react";

interface ApplePayFormProps {
  amount: string;
  onPaymentComplete: (paymentData: any) => void;
  onBack: () => void;
}

const ApplePayForm = ({ amount, onPaymentComplete, onBack }: ApplePayFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleApplePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate Apple Pay processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const paymentData = {
        method: "apple_pay",
        amount: parseFloat(amount),
        transactionId: `ap_${Date.now()}`,
        status: "completed"
      };

      onPaymentComplete(paymentData);
      
      toast({
        title: "Payment Successful!",
        description: `Your Apple Pay payment for $${amount} has been processed.`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your Apple Pay payment. Please try again.",
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
          <Smartphone className="w-6 h-6 mr-2 text-gray-800" />
          Apple Pay
        </CardTitle>
        <CardDescription>
          Complete your payment using Touch ID or Face ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
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
          <div className="w-16 h-16 mx-auto bg-black rounded-lg flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          
          <p className="text-gray-600">
            Use your fingerprint or face to authorize this payment securely.
          </p>
          
          <Button
            onClick={handleApplePayment}
            disabled={isProcessing}
            className="w-full bg-black hover:bg-gray-800 text-white"
            size="lg"
          >
            {isProcessing ? "Processing..." : `Pay $${amount} with Apple Pay`}
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

export default ApplePayForm;
