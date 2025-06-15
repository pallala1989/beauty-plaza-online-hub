
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Technician {
  id: string;
  name: string;
}

interface CustomerInformationProps {
  customerInfo: CustomerInfo;
  serviceType: string;
  selectedService: Service | undefined;
  selectedTechnician: Technician | undefined;
  selectedDate?: Date;
  selectedTime: string;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  customerInfo,
  serviceType,
  selectedService,
  selectedTechnician,
  selectedDate,
  selectedTime,
  onCustomerInfoChange
}) => {
  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
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
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">
            Phone Number {serviceType === "in-home" ? "*" : ""}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required={serviceType === "in-home"}
          />
        </div>
        {serviceType === "in-home" && (
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Special Requests (Optional)</Label>
        <Textarea
          id="notes"
          value={customerInfo.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any special requests or notes for your appointment..."
        />
      </div>

      {/* Booking Summary */}
      <Card className="bg-pink-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Technician:</span>
              <span>{selectedTechnician?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{selectedDate?.toLocaleDateString()} at {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Type:</span>
              <span>{serviceType === "in-home" ? "In-Home" : "In-Store"}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Total:</span>
              <span>${(selectedService?.price || 0) + (serviceType === "in-home" ? 25 : 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInformation;
