
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
  const [errors, setErrors] = useState({
    amount: "",
    recipientName: "",
    recipientEmail: "",
    buyerEmail: ""
  });

  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {
      amount: "",
      recipientName: "",
      recipientEmail: "",
      buyerEmail: ""
    };

    if (!formData.amount || parseFloat(formData.amount) < 25) {
      newErrors.amount = "Minimum amount is $25";
    }

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email is required";
    } else if (!isValidEmail(formData.recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid recipient email address";
    }

    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = "Your email is required";
    } else if (!isValidEmail(formData.buyerEmail)) {
      newErrors.buyerEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before submitting.",
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
      setErrors({
        amount: "",
        recipientName: "",
        recipientEmail: "",
        buyerEmail: ""
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
              placeholder="Enter amount (minimum $25)"
              className={errors.amount ? "border-red-300" : ""}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Who is this for?"
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
                onChange={handleChange}
                placeholder="recipient@example.com"
                className={errors.recipientEmail ? "border-red-300" : ""}
              />
              {errors.recipientEmail && <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>}
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
              placeholder="your.email@example.com"
              className={errors.buyerEmail ? "border-red-300" : ""}
            />
            {errors.buyerEmail && <p className="text-red-500 text-sm mt-1">{errors.buyerEmail}</p>}
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
