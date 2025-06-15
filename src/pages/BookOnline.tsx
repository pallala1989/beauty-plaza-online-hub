
import React from "react";
import BookingProgressIndicator from "@/components/booking/BookingProgressIndicator";
import BookingFlow from "@/components/booking/BookingFlow";
import BookingNavigation from "@/components/booking/BookingNavigation";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import { useBookingFlow } from "@/hooks/booking/useBookingFlow";

const BookOnline = () => {
  const {
    step,
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
    services,
    technicians,
    bookedSlots,
    isFetchingSlots,
    setSelectedService,
    setSelectedTechnician,
    setSelectedDate,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose,
    isNextDisabled
  } = useBookingFlow();

  const maxStep = serviceType === "in-store" ? 4 : 5;

  const handleTechnicianSelect = (technicianId: string) => {
    setSelectedTechnician(technicianId);
  };

  const handleServiceTypeChange = (newServiceType: string) => {
    setServiceType(newServiceType);
  };

  const handlePhoneChange = (phone: string) => {
    setCustomerInfo({...customerInfo, phone});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Follow these simple steps to schedule your beauty session
          </p>
        </div>

        <BookingProgressIndicator currentStep={step} maxStep={maxStep} />

        <BookingFlow
          step={step}
          serviceType={serviceType}
          services={services}
          technicians={technicians}
          bookedSlots={bookedSlots}
          isFetchingSlots={isFetchingSlots}
          selectedService={selectedService}
          selectedTechnician={selectedTechnician}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          customerInfo={customerInfo}
          otp={otp}
          otpSent={otpSent}
          onServiceSelect={setSelectedService}
          onTechnicianSelect={handleTechnicianSelect}
          onServiceTypeChange={handleServiceTypeChange}
          onDateSelect={setSelectedDate}
          onTimeSelect={setSelectedTime}
          onCustomerInfoChange={setCustomerInfo}
          onPhoneChange={handlePhoneChange}
          onOtpChange={setOtp}
          onSendOtp={sendOtp}
          onVerifyOtp={verifyOtp}
        />

        <BookingNavigation
          step={step}
          serviceType={serviceType}
          isLoading={isLoading}
          isNextDisabled={isNextDisabled()}
          customerInfo={customerInfo}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
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
