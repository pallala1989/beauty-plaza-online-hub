
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useBookingData } from "@/hooks/useBookingData";
import { sendConfirmationEmail } from "@/utils/emailService";

export const useBookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { services, technicians, bookedSlots, fetchBookedSlots } = useBookingData();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceType, setServiceType] = useState("in-store");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  // Pre-select service if passed from Services page
  useEffect(() => {
    if (location.state?.preSelectedService) {
      const service = location.state.preSelectedService;
      setSelectedService(service.id.toString());
    }
  }, [location.state]);

  // Fetch booked slots when date/technician changes
  useEffect(() => {
    if (selectedDate && selectedTechnician) {
      fetchBookedSlots(selectedDate, selectedTechnician);
    }
  }, [selectedDate, selectedTechnician, fetchBookedSlots]);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || "",
        name: user.user_metadata?.full_name || ""
      }));
    }
  }, [user]);

  const handleNext = () => {
    console.log('handleNext called - current step:', step);
    // Skip step 4 for in-store appointments
    if (step === 3 && serviceType === "in-store") {
      setStep(5);
    } else if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    // Handle back navigation considering skipped step 4 for in-store
    if (step === 5 && serviceType === "in-store") {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const sendOtp = async () => {
    if (!customerInfo.phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number to receive OTP.",
        variant: "destructive",
      });
      return;
    }

    // Simulate OTP sending
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${customerInfo.phone}`,
    });
  };

  const verifyOtp = () => {
    if (otp === "1234") { // Demo OTP
      toast({
        title: "OTP Verified",
        description: "Phone number verified successfully!",
      });
      handleNext();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const selectedServiceDetails = services.find(s => s.id === selectedService);
      const totalAmount = (selectedServiceDetails?.price || 0) + (serviceType === "in-home" ? 25 : 0);

      const appointmentData = {
        customer_id: user.id,
        service_id: selectedService,
        technician_id: selectedTechnician,
        appointment_date: format(selectedDate!, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        service_type: serviceType,
        notes: customerInfo.notes,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        total_amount: totalAmount,
        status: 'scheduled',
        otp_verified: serviceType === 'in-home' ? true : false
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Time Slot Unavailable",
            description: "This time slot is already booked. Please select a different time.",
            variant: "destructive",
          });
          setStep(3); // Go back to date/time selection
          return;
        }
        throw error;
      }

      // Send confirmation email
      await sendConfirmationEmail({
        services,
        technicians,
        selectedService,
        selectedTechnician,
        selectedDate: selectedDate!,
        selectedTime,
        serviceType,
        customerInfo,
        totalAmount
      });

      // Set booking details for confirmation dialog
      setBookingDetails({
        ...appointmentData,
        service_name: selectedServiceDetails?.name,
        technician_name: technicians.find(t => t.id === selectedTechnician)?.name,
        formatted_date: format(selectedDate!, 'MMMM dd, yyyy'),
        formatted_time: selectedTime
      });

      setShowConfirmation(true);

    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    
    // Reset form
    setStep(1);
    setSelectedService("");
    setSelectedTechnician("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setServiceType("in-store");
    setOtp("");
    setOtpSent(false);
    setCustomerInfo({
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      notes: ""
    });
    
    // Navigate to home
    navigate("/");
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedService;
    if (step === 2) return !selectedTechnician || !serviceType;
    if (step === 3) return !selectedDate || !selectedTime;
    if (step === 4 && serviceType === "in-home") return otp !== "1234";
    return false;
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
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose,
    isNextDisabled
  };
};
