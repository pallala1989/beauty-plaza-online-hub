
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Gift, Heart, Star, Sparkles } from "lucide-react";

const GiftCard = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: ""
  });

  const { toast } = useToast();

  const predefinedAmounts = [50, 75, 100, 150, 200, 300];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handlePurchase = () => {
    const amount = getFinalAmount();
    
    if (!amount || amount < 25) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be at least $25.",
        variant: "destructive",
      });
      return;
    }

    if (!recipientInfo.name || !recipientInfo.email || !buyerInfo.name || !buyerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would integrate with Stripe or PayPal
    toast({
      title: "Purchase Successful!",
      description: `Gift card for $${amount} has been sent to ${recipientInfo.email}`,
    });

    // Reset form
    setSelectedAmount(0);
    setCustomAmount("");
    setRecipientInfo({ name: "", email: "", message: "" });
    setBuyerInfo({ name: "", email: "" });
  };

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
            Give the gift of beauty and relaxation. Perfect for any occasion, our gift cards never expire and can be used for any of our premium services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Card Preview */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white overflow-hidden">
              <CardContent className="p-8 relative">
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles className="w-16 h-16" />
                </div>
                <div className="space-y-4">
                  <div className="text-2xl font-bold">Beauty Plaza</div>
                  <div className="text-lg">Gift Card</div>
                  <div className="text-3xl font-bold">
                    ${getFinalAmount() || "00"}
                  </div>
                  <div className="text-sm opacity-90">
                    {recipientInfo.name || "Recipient Name"}
                  </div>
                  {recipientInfo.message && (
                    <div className="text-sm opacity-90 italic">
                      "{recipientInfo.message}"
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gift Card Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-pink-600" />
                  Gift Card Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <span>Never expires</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <span>Can be used for any service</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <span>Transferable to others</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <span>Digital delivery via email</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <span>Physical card available upon request</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Form */}
          <div className="space-y-6">
            {/* Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Amount</CardTitle>
                <CardDescription>Choose a predefined amount or enter a custom value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`h-12 ${
                        selectedAmount === amount
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "border-pink-200 text-pink-600 hover:bg-pink-50"
                      }`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="custom-amount">Custom Amount (minimum $25)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="25"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle>Recipient Information</CardTitle>
                <CardDescription>Who is this gift card for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient-name">Recipient Name *</Label>
                  <Input
                    id="recipient-name"
                    value={recipientInfo.name}
                    onChange={(e) => setRecipientInfo({...recipientInfo, name: e.target.value})}
                    placeholder="Enter recipient's name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="recipient-email">Recipient Email *</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    value={recipientInfo.email}
                    onChange={(e) => setRecipientInfo({...recipientInfo, email: e.target.value})}
                    placeholder="Enter recipient's email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={recipientInfo.message}
                    onChange={(e) => setRecipientInfo({...recipientInfo, message: e.target.value})}
                    placeholder="Write a personal message..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>We need your details for the purchase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="buyer-name">Your Name *</Label>
                  <Input
                    id="buyer-name"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="buyer-email">Your Email *</Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={!getFinalAmount() || getFinalAmount() < 25}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 text-lg font-semibold"
            >
              Purchase Gift Card - ${getFinalAmount() || "0"}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Gift cards will be delivered instantly via email after payment confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
