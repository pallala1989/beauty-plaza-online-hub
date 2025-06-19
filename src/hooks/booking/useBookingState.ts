
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useBookingState = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Auto-select today's date
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceType, setServiceType] = useState("in-store");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    bankAccount: "",
    routingNumber: ""
  });

  // Pre-select service if passed from Services page
  useEffect(() => {
    if (location.state?.preSelectedService) {
      const service = location.state.preSelectedService;
      setSelectedService(service.id.toString());
    }
  }, [location.state]);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || "",
        name: user.name || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  return {
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
    loyaltyPointsToUse,
    setLoyaltyPointsToUse,
    customerInfo,
    setCustomerInfo
  };
};
