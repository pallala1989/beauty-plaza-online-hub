import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Gift, Heart, Star } from "lucide-react";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";

const GiftCard = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    senderEmail: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    amount: "",
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    senderEmail: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();

  const presetAmounts = [25, 50, 75, 100, 150, 200];

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      amount: "",
      recipientName: "",
      recipientEmail: "",
      senderName: "",
      senderEmail: ""
    };

    if (!formData.amount || parseFloat(formData.amount) < 25) {
      newErrors.amount = "Minimum amount is $25";
    } else if (parseFloat(formData.amount) > 500) {
      newErrors.amount = "Maximum amount is $500";
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email is required";
    } else if (!isValidEmail(formData.recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid email address";
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Your name is required";
    }

    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = "Your email is required";
    } else if (!isValidEmail(formData.senderEmail)) {
      newErrors.senderEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
    
    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: ""
      }));
    }
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please correct the highlighted fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentData: any) => {
    setIsProcessing(true);

    try {
      // Simulate gift card creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Gift Card Purchased!",
        description: `Gift card for $${formData.amount} has been sent to ${formData.recipientEmail}`,
      });

      // Reset form
      setFormData({
        amount: "",
        recipientName: "",
        recipientEmail: "",
        senderName: "",
        senderEmail: "",
        message: ""
      });
      setShowPayment(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error creating your gift card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentMethodSelector
            amount={formData.amount}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setShowPayment(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Gift Cards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Give the gift of beauty and self-care. Perfect for any occasion!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Card Preview */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Beauty Plaza</h3>
                    <p className="text-pink-100">Gift Card</p>
                  </div>
                  <Heart className="w-8 h-8 text-pink-200" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-pink-100 text-sm">Amount</p>
                    <p className="text-3xl font-bold">
                      ${formData.amount || "0"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-pink-100 text-sm">To</p>
                    <p className="text-lg font-semibold">
                      {formData.recipientName || "Recipient Name"}
                    </p>
                  </div>
                  
                  {formData.message && (
                    <div>
                      <p className="text-pink-100 text-sm">Message</p>
                      <p className="text-sm italic">"{formData.message}"</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-pink-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-pink-100 text-xs">From</p>
                      <p className="text-sm">{formData.senderName || "Your Name"}</p>
                    </div>
                    <Star className="w-6 h-6 text-pink-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Our Gift Cards?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Never expires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Can be used for any service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Digital delivery within minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Perfect for any occasion</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gift Card Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Gift Card</CardTitle>
              <CardDescription>
                Fill in the details below to create a personalized gift card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Selection */}
              <div>
                <Label>Gift Card Amount *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      variant={formData.amount === amount.toString() ? "default" : "outline"}
                      className={formData.amount === amount.toString() 
                        ? "bg-pink-600 hover:bg-pink-700" 
                        : "hover:bg-pink-50"
                      }
                      type="button"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  name="amount"
                  min="25"
                  max="500"
                  className={errors.amount ? "border-red-300" : ""}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum $25, Maximum $500</p>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Recipient Information</h3>
                
                <div>
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Enter recipient's full name"
                    className={errors.recipientName ? "border-red-300" : ""}
                  />
                  {errors.recipientName && <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>}
                </div>

                <div>
                  <Label htmlFor="recipientEmail">Recipient Email *</Label>
                  <Input
                    id="recipientEmail"
                    name="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={handleInputChange}
                    placeholder="recipient@example.com"
                    className={errors.recipientEmail ? "border-red-300" : ""}
                  />
                  {errors.recipientEmail && <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>}
                </div>
              </div>

              {/* Sender Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Your Information</h3>
                
                <div>
                  <Label htmlFor="senderName">Your Name *</Label>
                  <Input
                    id="senderName"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.senderName ? "border-red-300" : ""}
                  />
                  {errors.senderName && <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>}
                </div>

                <div>
                  <Label htmlFor="senderEmail">Your Email *</Label>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={errors.senderEmail ? "border-red-300" : ""}
                  />
                  {errors.senderEmail && <p className="text-red-500 text-sm mt-1">{errors.senderEmail}</p>}
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write a personal message for the recipient..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">This message will appear on the gift card</p>
              </div>

              <Button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
