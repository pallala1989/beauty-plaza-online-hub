
import React from "react";
import BookingProgressIndicator from "@/components/booking/BookingProgressIndicator";
import BookingNavigation from "@/components/booking/BookingNavigation";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import MultiServiceSelection from "@/components/booking/MultiServiceSelection";
import TechnicianAndTypeSelection from "@/components/booking/TechnicianAndTypeSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import CustomerInformation from "@/components/booking/CustomerInformation";
import PhoneVerification from "@/components/booking/PhoneVerification";
import PaymentStep from "@/components/booking/PaymentStep";
import { useBookingFlow } from "@/hooks/booking/useBookingFlow";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BookOnline = () => {
  const { user } = useAuth();
  const [isAdminMode, setIsAdminMode] = React.useState(false);

  const {
    step,
    selectedServices,
    selectedTechnician,
    selectedDate,
    selectedTime,
    serviceType,
    otp,
    otpSent,
    isLoading,
    showConfirmation,
    bookingDetails,
    customerInfo,
    loyaltyPointsToUse,
    services,
    technicians,
    bookedSlots,
    isFetchingSlots,
    fullyBookedDays,
    setSelectedTechnician,
    handleDateSelect,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    setLoyaltyPointsToUse,
    handleServiceToggle,
    handleRemoveService,
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose,
    isNextDisabled,
    handleMonthChange
  } = useBookingFlow();

  // Check if user is admin/technician
  const canUseAdminMode = user?.role === 'admin' || user?.role === 'technician';

  // Calculate max step based on admin mode and service type
  const maxStep = React.useMemo(() => {
    if (isAdminMode) {
      // Admin mode: Services -> Technician -> DateTime -> Customer -> Payment -> Confirmation
      return 6;
    } else {
      // Regular mode depends on service type
      return serviceType === "in-home" ? 5 : 4;
    }
  }, [isAdminMode, serviceType]);

  const handleTechnicianSelect = (technicianId: string) => {
    setSelectedTechnician(technicianId);
  };

  const handleServiceTypeChange = (newServiceType: string) => {
    setServiceType(newServiceType);
  };

  const handlePhoneChange = (phone: string) => {
    setCustomerInfo({...customerInfo, phone});
  };

  const handlePaymentComplete = () => {
    console.log('Payment completed');
    handleSubmit();
  };

  const handleSkipPayment = () => {
    console.log('Payment skipped - marked as pending');
    handleSubmit();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MultiServiceSelection
            services={services}
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
            onRemoveService={handleRemoveService}
          />
        );
      case 2:
        return (
          <TechnicianAndTypeSelection
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            serviceType={serviceType}
            onTechnicianSelect={handleTechnicianSelect}
            onServiceTypeChange={handleServiceTypeChange}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            bookedSlots={bookedSlots}
            isFetchingSlots={isFetchingSlots}
            fullyBookedDays={fullyBookedDays}
            onDateSelect={handleDateSelect}
            onTimeSelect={setSelectedTime}
            onMonthChange={handleMonthChange}
          />
        );
      case 4:
        if (!isAdminMode && serviceType === "in-home") {
          return (
            <PhoneVerification
              phone={customerInfo.phone}
              otp={otp}
              otpSent={otpSent}
              onPhoneChange={handlePhoneChange}
              onOtpChange={setOtp}
              onSendOtp={sendOtp}
              onVerifyOtp={verifyOtp}
            />
          );
        } else {
          return (
            <CustomerInformation
              customerInfo={customerInfo}
              serviceType={serviceType}
              selectedServices={services.filter(s => selectedServices.includes(s.id.toString()))}
              selectedTechnician={technicians.find(t => t.id === selectedTechnician)}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              loyaltyPointsToUse={loyaltyPointsToUse}
              onCustomerInfoChange={setCustomerInfo}
              onLoyaltyPointsChange={setLoyaltyPointsToUse}
            />
          );
        }
      case 5:
        if (!isAdminMode && serviceType === "in-home") {
          return (
            <CustomerInformation
              customerInfo={customerInfo}
              serviceType={serviceType}
              selectedServices={services.filter(s => selectedServices.includes(s.id.toString()))}
              selectedTechnician={technicians.find(t => t.id === selectedTechnician)}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              loyaltyPointsToUse={loyaltyPointsToUse}
              onCustomerInfoChange={setCustomerInfo}
              onLoyaltyPointsChange={setLoyaltyPointsToUse}
            />
          );
        } else if (isAdminMode) {
          return (
            <PaymentStep
              selectedServices={services.filter(s => selectedServices.includes(s.id.toString()))}
              customerInfo={customerInfo}
              onPaymentComplete={handlePaymentComplete}
              onSkipPayment={handleSkipPayment}
            />
          );
        }
        break;
      case 6:
        if (isAdminMode) {
          // Show confirmation directly for admin mode
          return (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Created Successfully!</h3>
              <p className="text-gray-500">The appointment has been scheduled for the customer.</p>
            </div>
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {isAdminMode ? 'Book Appointment for Customer' : 'Book Your Appointment'}
          </h1>
          <p className="text-lg text-gray-600">
            {isAdminMode 
              ? 'Create appointments for customers and process payments' 
              : 'Follow these simple steps to schedule your beauty session'
            }
          </p>
          
          {canUseAdminMode && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Switch
                id="admin-mode"
                checked={isAdminMode}
                onCheckedChange={setIsAdminMode}
              />
              <Label htmlFor="admin-mode" className="text-sm font-medium">
                Admin/Technician Mode
              </Label>
            </div>
          )}
        </div>

        <BookingProgressIndicator currentStep={step} maxStep={maxStep} />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderStep()}
        </div>

        <BookingNavigation
          step={step}
          serviceType={serviceType}
          isLoading={isLoading}
          isNextDisabled={isNextDisabled()}
          customerInfo={customerInfo}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={isAdminMode && step === maxStep ? handleSubmit : undefined}
        />

        <BookingConfirmation
          isOpen={showConfirmation}
          bookingDetails={bookingDetails}
          onClose={handleConfirmationClose}
        />
      </div>
    </div>
  );
};

export default BookOnline;
