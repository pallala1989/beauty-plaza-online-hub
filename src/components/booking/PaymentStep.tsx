
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard } from "lucide-react";
import PaymentProcessor from "@/components/payment/PaymentProcessor";
import InvoiceGenerator from "@/components/payment/InvoiceGenerator";

interface PaymentStepProps {
  selectedServices: any[];
  customerInfo: any;
  onPaymentComplete: () => void;
  onSkipPayment: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedServices,
  customerInfo,
  onPaymentComplete,
  onSkipPayment
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const handlePaymentComplete = (paymentData: any) => {
    setInvoiceData(paymentData);
    setShowPayment(false);
    setShowInvoice(true);
  };

  const handleInvoiceClose = () => {
    setShowInvoice(false);
    onPaymentComplete();
  };

  if (showInvoice && invoiceData) {
    return (
      <InvoiceGenerator
        invoiceData={invoiceData}
        customerInfo={customerInfo}
        onClose={handleInvoiceClose}
      />
    );
  }

  if (showPayment) {
    return (
      <PaymentProcessor
        serviceDetails={selectedServices}
        totalAmount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Payment Processing</h2>
        <p className="text-sm text-gray-600 mt-1">Process payment for the completed services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Service Total: ${totalAmount.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Services Provided:</h3>
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{service.name} ({service.duration} min)</span>
                <span className="font-medium">${service.price}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
            
            <Button
              variant="outline"
              onClick={onSkipPayment}
              className="w-full"
            >
              Skip Payment (Mark as Pending)
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Process payment after service completion or mark as pending for later payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStep;
