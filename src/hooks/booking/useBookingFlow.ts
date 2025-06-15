
import { useEffect, useState, useMemo } from "react";
import { useBookingData } from "@/hooks/useBookingData";
import { useBookingState } from "./useBookingState";
import { useBookingValidation } from "./useBookingValidation";
import { useBookingActions } from "./useBookingActions";
import { format } from 'date-fns';

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export const useBookingFlow = () => {
  const { services, technicians, monthlyBookedData, isFetchingSlots, fetchMonthlyBookedData, clearBookedSlots, refreshBookedSlots } = useBookingData();
  
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
    isNextDisabled,
    refreshBookedSlots
  );

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const bookedSlots = useMemo(() => {
    if (!selectedDate || !monthlyBookedData) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return monthlyBookedData[dateKey] || [];
  }, [selectedDate, monthlyBookedData]);

  const fullyBookedDays = useMemo(() => {
    if (!monthlyBookedData) return [];
    return Object.keys(monthlyBookedData).filter(dateStr => 
        monthlyBookedData[dateStr].length >= timeSlots.length
    );
  }, [monthlyBookedData]);

  useEffect(() => {
    if (selectedTechnician) {
      fetchMonthlyBookedData(currentMonth, selectedTechnician);
    } else {
      clearBookedSlots();
    }
  }, [selectedTechnician, currentMonth, fetchMonthlyBookedData, clearBookedSlots]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(selectedDate);
      }
    }
  }, [selectedDate, currentMonth]);

  useEffect(() => {
    if (selectedTechnician && step === 3) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing monthly booked slots...');
        fetchMonthlyBookedData(currentMonth, selectedTechnician);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentMonth, selectedTechnician, step, fetchMonthlyBookedData]);

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
    isFetchingSlots,
    fullyBookedDays,
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
    isNextDisabled: wrappedIsNextDisabled,
    handleMonthChange
  };
};
