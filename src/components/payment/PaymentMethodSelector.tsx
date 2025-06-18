
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import CreditCardForm from "./CreditCardForm";
import PayPalForm from "./PayPalForm";
import ApplePayForm from "./ApplePayForm";

interface PaymentMethodSelectorProps {
  amount: string;
  onPaymentComplete: (paymentData: any) => void;
  onBack: () => void;
}

const PaymentMethodSelector = ({ amount, onPaymentComplete, onBack }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentMethods = [
    { 
      id: "card", 
      name: "Credit/Debit Card", 
      icon: CreditCard, 
      description: "Visa, Mastercard, American Express",
      component: CreditCardForm
    },
    { 
      id: "paypal", 
      name: "PayPal", 
      icon: Wallet, 
      description: "Pay with your PayPal account",
      component: PayPalForm
    },
    { 
      id: "apple", 
      name: "Apple Pay", 
      icon: Smartphone, 
      description: "Quick and secure payment",
      component: ApplePayForm
    },
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  if (selectedMethod && selectedPaymentMethod) {
    const PaymentComponent = selectedPaymentMethod.component;
    return (
      <PaymentComponent
        amount={amount}
        onPaymentComplete={onPaymentComplete}
        onBack={() => setSelectedMethod("")}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-pink-600" />
          Choose Payment Method
        </CardTitle>
        <CardDescription>
          Complete your gift card purchase for ${amount}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-pink-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Gift Card Amount:</span>
              <span>${amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${amount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className="w-full justify-start h-auto p-4 border-2 border-gray-200 bg-white text-gray-900 hover:border-pink-300 hover:bg-pink-50"
                variant="outline"
              >
                <Icon className="w-6 h-6 mr-3 text-pink-600" />
                <div className="text-left">
                  <div className="font-semibold">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
        >
          Back to Gift Card Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
