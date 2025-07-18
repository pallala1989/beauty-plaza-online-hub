
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
  const { 
    services, 
    beautyservices,
    technicians, 
    monthlyBookedData, 
    isFetchingSlots, 
    fetchMonthlyBookedData, 
    clearBookedSlots, 
    refreshBookedSlots 
  } = useBookingData();
  
  const {
    step,
    setStep,
    selectedServices,
    setSelectedServices,
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
    loyaltyPointsToUse,
    setLoyaltyPointsToUse,
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

  // Auto-select first available technician when technicians are loaded
  useEffect(() => {
    if (technicians.length > 0 && !selectedTechnician) {
      console.log('Auto-selecting first available technician:', technicians[0].id);
      setSelectedTechnician(technicians[0].id);
    }
  }, [technicians, selectedTechnician, setSelectedTechnician]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Always reset time when date changes

    if (date) {
      if (date.getMonth() !== currentMonth.getMonth() || date.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(date);
      }
    }
  };

  // Fixed service selection logic
  const handleServiceSelect = (serviceId: string) => {
    console.log('handleServiceSelect called with:', serviceId);
    setSelectedService(serviceId);
    // Update selectedServices array to include the selected service
    setSelectedServices([serviceId]);
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        // Remove service
        const newServices = prev.filter(id => id !== serviceId);
        // If removing the currently selected service, update selectedService
        if (serviceId === selectedService) {
          setSelectedService(newServices[0] || "");
        }
        return newServices;
      } else {
        // Add service (max 5)
        if (prev.length < 5) {
          const newServices = [...prev, serviceId];
          // If this is the first service, make it the selected service
          if (prev.length === 0) {
            setSelectedService(serviceId);
          }
          return newServices;
        }
        return prev;
      }
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = prev.filter(id => id !== serviceId);
      // If removing the currently selected service, update selectedService
      if (serviceId === selectedService) {
        setSelectedService(newServices[0] || "");
      }
      return newServices;
    });
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
    if (selectedTechnician && fetchMonthlyBookedData) {
      fetchMonthlyBookedData(currentMonth, selectedTechnician);
    } else if (clearBookedSlots) {
      clearBookedSlots();
    }
  }, [selectedTechnician, currentMonth, fetchMonthlyBookedData, clearBookedSlots]);

  useEffect(() => {
    if (selectedTechnician && step === 3 && fetchMonthlyBookedData) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing monthly booked slots...');
        fetchMonthlyBookedData(currentMonth, selectedTechnician);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentMonth, selectedTechnician, step, fetchMonthlyBookedData]);

  const wrappedHandleNext = () => {
    handleNext(selectedServices, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, technicians);
  };

  const wrappedVerifyOtp = () => {
    verifyOtp(otp);
  };

  const wrappedHandleSubmit = async () => {
    if (selectedDate) {
      await handleSubmit(selectedServices, selectedTechnician, selectedDate, selectedTime, serviceType, services, technicians, loyaltyPointsToUse);
    }
  };

  const wrappedIsNextDisabled = () => {
    return isNextDisabled(step, selectedServices, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians);
  };

  return {
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
    beautyservices,
    technicians,
    bookedSlots,
    isFetchingSlots,
    fullyBookedDays,
    setSelectedServices,
    setSelectedService: handleServiceSelect, // Use the fixed handler
    setSelectedTechnician,
    handleDateSelect,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    setLoyaltyPointsToUse,
    handleServiceToggle,
    handleRemoveService,
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
