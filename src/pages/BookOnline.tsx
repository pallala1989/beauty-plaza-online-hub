
import React from "react";
import BookingProgressIndicator from "@/components/booking/BookingProgressIndicator";
import BookingFlow from "@/components/booking/BookingFlow";
import BookingNavigation from "@/components/booking/BookingNavigation";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import { useBookingFlow } from "@/hooks/booking/useBookingFlow";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BookOnline = () => {
  const { user } = useAuth();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const {
    step,
    selectedServices,
    selectedService,
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
    setSelectedService,
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

  // Check if user is admin/technician - fixed role comparison
  const canUseAdminMode = user?.role === 'admin';

  const maxStep = React.useMemo(() => {
    if (isAdminMode) {
      return serviceType === "in-store" ? 5 : 6;
    }
    return serviceType === "in-store" ? 4 : 5;
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

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerInfo({
        ...customerInfo,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      });
    }
  };

  const handleCreateNewCustomer = (customerData: any) => {
    // In a real app, this would create the customer in the database
    console.log('Creating new customer:', customerData);
  };

  const handlePaymentComplete = () => {
    console.log('Payment completed');
    // Continue with booking confirmation
    handleSubmit();
  };

  const handleSkipPayment = () => {
    console.log('Payment skipped - marked as pending');
    // Continue with booking confirmation
    handleSubmit();
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

        <BookingFlow
          step={step}
          serviceType={serviceType}
          services={services}
          technicians={technicians}
          bookedSlots={bookedSlots}
          isFetchingSlots={isFetchingSlots}
          fullyBookedDays={fullyBookedDays}
          selectedServices={selectedServices}
          selectedService={selectedService}
          selectedTechnician={selectedTechnician}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          customerInfo={customerInfo}
          loyaltyPointsToUse={loyaltyPointsToUse}
          otp={otp}
          otpSent={otpSent}
          isAdminMode={isAdminMode}
          selectedCustomer={selectedCustomer}
          onServiceToggle={handleServiceToggle}
          onRemoveService={handleRemoveService}
          onServiceSelect={setSelectedService}
          onTechnicianSelect={handleTechnicianSelect}
          onServiceTypeChange={handleServiceTypeChange}
          onDateSelect={handleDateSelect}
          onTimeSelect={setSelectedTime}
          onCustomerInfoChange={setCustomerInfo}
          onPhoneChange={handlePhoneChange}
          onOtpChange={setOtp}
          onSendOtp={sendOtp}
          onVerifyOtp={verifyOtp}
          onMonthChange={handleMonthChange}
          onLoyaltyPointsChange={setLoyaltyPointsToUse}
          onCustomerSelect={handleCustomerSelect}
          onCreateNewCustomer={handleCreateNewCustomer}
          onPaymentComplete={handlePaymentComplete}
          onSkipPayment={handleSkipPayment}
        />

        <BookingNavigation
          step={step}
          serviceType={serviceType}
          isLoading={isLoading}
          isNextDisabled={isNextDisabled()}
          customerInfo={customerInfo}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={isAdminMode && ((step === 5 && serviceType === "in-store") || (step === 6 && serviceType === "in-home")) ? undefined : handleSubmit}
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
