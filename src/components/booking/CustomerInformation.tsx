
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MapPin, User } from "lucide-react";
import { format } from "date-fns";
import LoyaltyPointsUsage from "./LoyaltyPointsUsage";
import { useSettings } from "@/hooks/useSettings";

interface CustomerInformationProps {
  customerInfo: any;
  serviceType: string;
  selectedService?: any;
  selectedTechnician?: any;
  selectedDate?: Date;
  selectedTime: string;
  loyaltyPointsToUse?: number;
  onCustomerInfoChange: (info: any) => void;
  onLoyaltyPointsChange?: (points: number) => void;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  customerInfo,
  serviceType,
  selectedService,
  selectedTechnician,
  selectedDate,
  selectedTime,
  loyaltyPointsToUse = 0,
  onCustomerInfoChange,
  onLoyaltyPointsChange
}) => {
  const { settings } = useSettings();
  const inHomeFee = settings?.in_home_fee || 25;

  const handleInputChange = (field: string, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value
    });
  };

  // Calculate total amount
  const servicePrice = selectedService?.price || 0;
  const serviceFee = serviceType === "in-home" ? inHomeFee : 0;
  const subtotal = servicePrice + serviceFee;
  
  // Apply loyalty points discount
  const loyaltySettings = settings?.loyalty_settings || { redemption_rate: 10 };
  const pointsDiscount = loyaltyPointsToUse / loyaltySettings.redemption_rate;
  const finalTotal = Math.max(0, subtotal - pointsDiscount);

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Service:</span>
              <p>{selectedService?.name}</p>
            </div>
            <div>
              <span className="font-medium">Technician:</span>
              <p>{selectedTechnician?.name}</p>
            </div>
            <div>
              <span className="font-medium">Date:</span>
              <p>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}</p>
            </div>
            <div>
              <span className="font-medium">Time:</span>
              <p>{selectedTime}</p>
            </div>
            <div>
              <span className="font-medium">Duration:</span>
              <p>{selectedService?.duration} minutes</p>
            </div>
            <div>
              <span className="font-medium">Type:</span>
              <p className="capitalize">{serviceType}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service Price:</span>
              <span>${servicePrice.toFixed(2)}</span>
            </div>
            {serviceType === "in-home" && (
              <div className="flex justify-between">
                <span>In-Home Service Fee:</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {loyaltyPointsToUse > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Loyalty Points Discount:</span>
                <span>-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-pink-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Points Usage */}
      {onLoyaltyPointsChange && (
        <LoyaltyPointsUsage
          totalAmount={subtotal}
          loyaltyPointsToUse={loyaltyPointsToUse}
          onPointsChange={onLoyaltyPointsChange}
        />
      )}

      {/* Customer Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          {serviceType === "in-home" && (
            <div>
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Service Address *
              </Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter the full address where service will be provided"
                rows={3}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Special Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requests or notes for your appointment"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInformation;
