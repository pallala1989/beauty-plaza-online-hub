
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, MapPin, Phone } from "lucide-react";
import MultiServiceSelection from "@/components/booking/MultiServiceSelection";
import TechnicianAndTypeSelection from "@/components/booking/TechnicianAndTypeSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import PhoneVerification from "@/components/booking/PhoneVerification";
import CustomerInformation from "@/components/booking/CustomerInformation";

interface BookingFlowProps {
  step: number;
  serviceType: string;
  services: any[];
  technicians: any[];
  bookedSlots: string[];
  isFetchingSlots: boolean;
  fullyBookedDays: string[];
  selectedServices: string[];
  selectedService: string;
  selectedTechnician: string;
  selectedDate?: Date;
  selectedTime: string;
  customerInfo: any;
  loyaltyPointsToUse?: number;
  otp: string;
  otpSent: boolean;
  onServiceToggle: (serviceId: string) => void;
  onRemoveService: (serviceId: string) => void;
  onServiceSelect: (serviceId: string) => void;
  onTechnicianSelect: (technicianId: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onCustomerInfoChange: (info: any) => void;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  onMonthChange: (date: Date) => void;
  onLoyaltyPointsChange?: (points: number) => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
  step,
  serviceType,
  services,
  technicians,
  bookedSlots,
  isFetchingSlots,
  fullyBookedDays,
  selectedServices,
  selectedService,
  selectedTechnician,
  selectedDate,
  selectedTime,
  customerInfo,
  loyaltyPointsToUse,
  otp,
  otpSent,
  onServiceToggle,
  onRemoveService,
  onServiceSelect,
  onTechnicianSelect,
  onServiceTypeChange,
  onDateSelect,
  onTimeSelect,
  onCustomerInfoChange,
  onPhoneChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  onMonthChange,
  onLoyaltyPointsChange
}) => {
  const getStepTitle = () => {
    if (step === 1) return "Step 1: Select Services";
    if (step === 2) return "Step 2: Choose Technician & Type";
    if (step === 3) return "Step 3: Pick Date & Time";
    if (step === 4 && serviceType === "in-home") return "Step 4: Verify Phone";
    return `Step ${serviceType === "in-store" ? 4 : 5}: Your Information`;
  };

  const getStepIcon = () => {
    if (step === 1 || step === 2) return <User className="mr-2" />;
    if (step === 3) return <CalendarDays className="mr-2" />;
    if (step === 4 && serviceType === "in-home") return <Phone className="mr-2" />;
    return <MapPin className="mr-2" />;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStepIcon()}
          {getStepTitle()}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Step 1: Select Services */}
        {step === 1 && (
          <MultiServiceSelection
            services={services}
            selectedServices={selectedServices}
            onServiceToggle={onServiceToggle}
            onRemoveService={onRemoveService}
          />
        )}

        {/* Step 2: Choose Technician & Service Type */}
        {step === 2 && (
          <TechnicianAndTypeSelection
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            serviceType={serviceType}
            onTechnicianSelect={onTechnicianSelect}
            onServiceTypeChange={onServiceTypeChange}
          />
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            bookedSlots={bookedSlots}
            isFetchingSlots={isFetchingSlots}
            fullyBookedDays={fullyBookedDays}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
            onMonthChange={onMonthChange}
          />
        )}

        {/* Step 4: OTP Verification (In-Home Only) */}
        {step === 4 && serviceType === "in-home" && (
          <PhoneVerification
            phone={customerInfo.phone}
            otp={otp}
            otpSent={otpSent}
            onPhoneChange={onPhoneChange}
            onOtpChange={onOtpChange}
            onSendOtp={onSendOtp}
            onVerifyOtp={onVerifyOtp}
          />
        )}

        {/* Step 5 (or 4 for in-store): Customer Information */}
        {((step === 4 && serviceType === "in-store") || (step === 5)) && (
          <CustomerInformation
            customerInfo={customerInfo}
            serviceType={serviceType}
            selectedServices={services.filter(s => selectedServices.includes(s.id.toString()))}
            selectedService={services.find(s => s.id === selectedService)}
            selectedTechnician={technicians.find(t => t.id === selectedTechnician)}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            loyaltyPointsToUse={loyaltyPointsToUse}
            onCustomerInfoChange={onCustomerInfoChange}
            onLoyaltyPointsChange={onLoyaltyPointsChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BookingFlow;
