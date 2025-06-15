
import { useEffect } from "react";
import { useBookingData } from "@/hooks/useBookingData";
import { useBookingState } from "./useBookingState";
import { useBookingValidation } from "./useBookingValidation";
import { useBookingActions } from "./useBookingActions";

export const useBookingFlow = () => {
  const { services, technicians, bookedSlots, fetchBookedSlots } = useBookingData();
  
  const {
    step,
    setStep,
    selectedService,
    setSelectedService,
    selectedTechnician,
    setSelectedTechnician,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    serviceType,
    setServiceType,
    otp,
    setOtp,
    otpSent,
    setOtpSent,
    isLoading,
    setIsLoading,
    showConfirmation,
    setShowConfirmation,
    bookingDetails,
    setBookingDetails,
    customerInfo,
    setCustomerInfo
  } = useBookingState();

  const { isNextDisabled } = useBookingValidation();

  const {
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose
  } = useBookingActions(
    step,
    setStep,
    setOtpSent,
    setIsLoading,
    setBookingDetails,
    setShowConfirmation,
    setSelectedService,
    setSelectedTechnician,
    setSelectedDate,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    customerInfo,
    isNextDisabled
  );

  // Fetch booked slots when date/technician changes
  useEffect(() => {
    if (selectedDate && selectedTechnician) {
      fetchBookedSlots(selectedDate, selectedTechnician);
    }
  }, [selectedDate, selectedTechnician, fetchBookedSlots]);

  const wrappedHandleNext = () => {
    handleNext(selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, technicians);
  };

  const wrappedVerifyOtp = () => {
    verifyOtp(otp);
  };

  const wrappedHandleSubmit = async () => {
    if (selectedDate) {
      await handleSubmit(selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, services, technicians);
    }
  };

  const wrappedIsNextDisabled = () => {
    return isNextDisabled(step, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians);
  };

  return {
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
    setSelectedService,
    setSelectedTechnician,
    setSelectedDate,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    handleNext: wrappedHandleNext,
    handleBack,
    sendOtp,
    verifyOtp: wrappedVerifyOtp,
    handleSubmit: wrappedHandleSubmit,
    handleConfirmationClose,
    isNextDisabled: wrappedIsNextDisabled
  };
};
