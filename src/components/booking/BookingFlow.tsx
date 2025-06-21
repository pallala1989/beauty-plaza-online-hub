
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, MapPin, Phone, DollarSign, Users } from "lucide-react";
import MultiServiceSelection from "@/components/booking/MultiServiceSelection";
import TechnicianAndTypeSelection from "@/components/booking/TechnicianAndTypeSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import PhoneVerification from "@/components/booking/PhoneVerification";
import CustomerInformation from "@/components/booking/CustomerInformation";
import CustomerSelection from "@/components/booking/CustomerSelection";
import PaymentStep from "@/components/booking/PaymentStep";

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
  isAdminMode?: boolean;
  selectedCustomer?: any;
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
  onCustomerSelect?: (customer: any) => void;
  onCreateNewCustomer?: (customerData: any) => void;
  onPaymentComplete?: () => void;
  onSkipPayment?: () => void;
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
  isAdminMode = false,
  selectedCustomer,
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
  onLoyaltyPointsChange,
  onCustomerSelect,
  onCreateNewCustomer,
  onPaymentComplete,
  onSkipPayment
}) => {
  const getStepTitle = () => {
    if (isAdminMode) {
      if (step === 1) return "Step 1: Select Customer";
      if (step === 2) return "Step 2: Select Services";
      if (step === 3) return "Step 3: Choose Technician & Type";
      if (step === 4) return "Step 4: Pick Date & Time";
      if (step === 5 && serviceType === "in-home") return "Step 5: Verify Phone";
      if (step === 5) return "Step 5: Process Payment";
      if (step === 6) return "Step 6: Process Payment";
    } else {
      if (step === 1) return "Step 1: Select Services";
      if (step === 2) return "Step 2: Choose Technician & Type";
      if (step === 3) return "Step 3: Pick Date & Time";
      if (step === 4 && serviceType === "in-home") return "Step 4: Verify Phone";
      return `Step ${serviceType === "in-store" ? 4 : 5}: Your Information`;
    }
  };

  const getStepIcon = () => {
    if (isAdminMode && step === 1) return <Users className="mr-2" />;
    if ((isAdminMode && step === 2) || (!isAdminMode && step === 1)) return <User className="mr-2" />;
    if ((isAdminMode && step === 3) || (!isAdminMode && step === 2)) return <User className="mr-2" />;
    if ((isAdminMode && step === 4) || (!isAdminMode && step === 3)) return <CalendarDays className="mr-2" />;
    if (step === 4 && serviceType === "in-home" && !isAdminMode) return <Phone className="mr-2" />;
    if (step === 5 && serviceType === "in-home" && isAdminMode) return <Phone className="mr-2" />;
    if ((step === 5 && !isAdminMode) || (step === 6 && isAdminMode) || (step === 5 && serviceType === "in-store" && isAdminMode)) return <DollarSign className="mr-2" />;
    return <MapPin className="mr-2" />;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStepIcon()}
          {getStepTitle()}
          {isAdminMode && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin Mode</span>}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Admin Mode: Step 1 - Select Customer */}
        {isAdminMode && step === 1 && (
          <CustomerSelection
            selectedCustomer={selectedCustomer}
            onCustomerSelect={onCustomerSelect!}
            onCreateNewCustomer={onCreateNewCustomer!}
          />
        )}

        {/* Step 1 (Regular) / Step 2 (Admin): Select Services */}
        {((step === 1 && !isAdminMode) || (step === 2 && isAdminMode)) && (
          <MultiServiceSelection
            services={services}
            selectedServices={selectedServices}
            onServiceToggle={onServiceToggle}
            onRemoveService={onRemoveService}
          />
        )}

        {/* Step 2 (Regular) / Step 3 (Admin): Choose Technician & Service Type */}
        {((step === 2 && !isAdminMode) || (step === 3 && isAdminMode)) && (
          <TechnicianAndTypeSelection
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            serviceType={serviceType}
            onTechnicianSelect={onTechnicianSelect}
            onServiceTypeChange={onServiceTypeChange}
          />
        )}

        {/* Step 3 (Regular) / Step 4 (Admin): Date & Time */}
        {((step === 3 && !isAdminMode) || (step === 4 && isAdminMode)) && (
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

        {/* Step 4 (Regular In-Home) / Step 5 (Admin In-Home): OTP Verification */}
        {((step === 4 && serviceType === "in-home" && !isAdminMode) || (step === 5 && serviceType === "in-home" && isAdminMode)) && (
          <PhoneVerification
            phone={isAdminMode ? selectedCustomer?.phone || '' : customerInfo.phone}
            otp={otp}
            otpSent={otpSent}
            onPhoneChange={onPhoneChange}
            onOtpChange={onOtpChange}
            onSendOtp={onSendOtp}
            onVerifyOtp={onVerifyOtp}
          />
        )}

        {/* Step 4 (Regular In-Store) / Step 5 (Regular In-Home): Customer Information */}
        {((step === 4 && serviceType === "in-store" && !isAdminMode) || (step === 5 && !isAdminMode)) && (
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

        {/* Payment Step for Admin Mode */}
        {isAdminMode && ((step === 5 && serviceType === "in-store") || (step === 6 && serviceType === "in-home")) && (
          <PaymentStep
            selectedServices={services.filter(s => selectedServices.includes(s.id.toString()))}
            customerInfo={selectedCustomer || customerInfo}
            onPaymentComplete={onPaymentComplete!}
            onSkipPayment={onSkipPayment!}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BookingFlow;
