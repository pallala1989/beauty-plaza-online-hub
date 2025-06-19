
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import LoyaltyPointsUsage from "@/components/booking/LoyaltyPointsUsage";

interface CustomerInformationProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    bankAccount: string;
    routingNumber: string;
  };
  serviceType: string;
  selectedServices?: any[];
  selectedService?: any;
  selectedTechnician?: any;
  selectedDate?: Date;
  selectedTime?: string;
  loyaltyPointsToUse?: number;
  onCustomerInfoChange: (info: any) => void;
  onLoyaltyPointsChange?: (points: number) => void;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  customerInfo,
  serviceType,
  selectedServices = [],
  selectedService,
  selectedTechnician,
  selectedDate,
  selectedTime,
  loyaltyPointsToUse = 0,
  onCustomerInfoChange,
  onLoyaltyPointsChange
}) => {
  const servicesToDisplay = selectedServices.length > 0 ? selectedServices : (selectedService ? [selectedService] : []);
  
  const servicesTotal = servicesToDisplay.reduce((sum, service) => sum + (service?.price || 0), 0);
  const totalDuration = servicesToDisplay.reduce((sum, service) => sum + (service?.duration || 0), 0);
  const inHomeFee = serviceType === "in-home" ? 25 : 0;
  const subtotal = servicesTotal + inHomeFee;
  const loyaltyDiscount = loyaltyPointsToUse / 10;
  const totalAmount = Math.max(0, subtotal - loyaltyDiscount);

  const handleInputChange = (field: string, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-800">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Services:</span>
              </div>
              <div className="ml-6 space-y-1">
                {servicesToDisplay.map((service, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{service?.name}</span>
                    <span className="text-gray-600 ml-2">${service?.price} • {service?.duration} min</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-sm">
                <User className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Technician:</span>
                <span className="ml-2">{selectedTechnician?.name}</span>
              </div>

              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Type:</span>
                <span className="ml-2">{serviceType === 'in-home' ? 'In-Home Service' : 'In-Store Service'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CalendarDays className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">{selectedDate && format(selectedDate, 'MMMM dd, yyyy')}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Time:</span>
                <span className="ml-2">{selectedTime}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-pink-600" />
                <span className="font-medium">Duration:</span>
                <span className="ml-2">{totalDuration} minutes</span>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-200 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Services Total:</span>
                <span>${servicesTotal.toFixed(2)}</span>
              </div>
              {serviceType === "in-home" && (
                <div className="flex justify-between">
                  <span>In-Home Service Fee:</span>
                  <span>$25.00</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {loyaltyPointsToUse > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Discount ({loyaltyPointsToUse} points):</span>
                  <span>-${loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-pink-200 pt-2">
                <span>Total:</span>
                <span className="text-pink-600">${totalAmount.toFixed(2)}</span>
              </div>
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
          <CardTitle>Your Information</CardTitle>
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
                placeholder="Enter your phone number"
                required
              />
            </div>

            {serviceType === "in-home" && (
              <div>
                <Label htmlFor="address">Service Address *</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter service address"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Special Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={customerInfo.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requests or notes for your appointment..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInformation;
