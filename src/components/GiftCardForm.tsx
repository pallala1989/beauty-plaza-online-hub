
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "@/components/auth/EmailValidation";

const GiftCardForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    recipientName: "",
    recipientEmail: "",
    buyerEmail: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.recipientName || !formData.recipientEmail || !formData.buyerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(formData.recipientEmail)) {
      toast({
        title: "Invalid Recipient Email",
        description: "Please enter a valid recipient email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidEmail(formData.buyerEmail)) {
      toast({
        title: "Invalid Buyer Email",
        description: "Please enter a valid buyer email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would integrate with your payment processor and gift card system
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Gift Card Purchased!",
        description: "Your gift card has been sent to the recipient's email.",
      });

      // Reset form
      setFormData({
        amount: "",
        recipientName: "",
        recipientEmail: "",
        buyerEmail: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase gift card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Purchase Gift Card</CardTitle>
        <CardDescription>
          Give the gift of beauty to someone special
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="amount">Gift Card Amount *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="25"
              step="5"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount (minimum $25)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                required
                placeholder="Who is this for?"
              />
            </div>
            <div>
              <Label htmlFor="recipientEmail">Recipient Email *</Label>
              <Input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={handleChange}
                required
                placeholder="recipient@example.com"
                className={!isValidEmail(formData.recipientEmail) && formData.recipientEmail ? "border-red-300" : ""}
              />
              {!isValidEmail(formData.recipientEmail) && formData.recipientEmail && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="buyerEmail">Your Email *</Label>
            <Input
              id="buyerEmail"
              name="buyerEmail"
              type="email"
              value={formData.buyerEmail}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className={!isValidEmail(formData.buyerEmail) && formData.buyerEmail ? "border-red-300" : ""}
            />
            {!isValidEmail(formData.buyerEmail) && formData.buyerEmail && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add a personal message..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          >
            {isSubmitting ? "Processing..." : `Purchase Gift Card ($${formData.amount || "0"})`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GiftCardForm;
