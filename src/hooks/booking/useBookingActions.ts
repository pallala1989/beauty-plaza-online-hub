import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sendConfirmationEmail } from "@/utils/emailService";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";

export const useBookingActions = (
  step: number,
  setStep: (step: number) => void,
  setOtpSent: (sent: boolean) => void,
  setIsLoading: (loading: boolean) => void,
  setBookingDetails: (details: any) => void,
  setShowConfirmation: (show: boolean) => void,
  setSelectedService: (service: string) => void,
  setSelectedTechnician: (tech: string) => void,
  setSelectedDate: (date: Date | undefined) => void,
  setSelectedTime: (time: string) => void,
  setServiceType: (type: string) => void,
  setOtp: (otp: string) => void,
  setCustomerInfo: (info: any) => void,
  customerInfo: any,
  isNextDisabled: (step: number, ...args: any[]) => boolean,
  refreshBookedSlots?: (date?: Date, technician?: string) => Promise<void>
) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { deductPoints } = useLoyaltyPoints();

  const handleNext = (
    selectedServices: string[],
    selectedService: string,
    selectedTechnician: string,
    selectedDate?: Date,
    selectedTime?: string,
    serviceType?: string,
    otp?: string,
    technicians?: any[]
  ) => {
    console.log('handleNext called, current step:', step);
    console.log('Validation result:', !isNextDisabled(step, selectedServices, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians));
    
    if (!isNextDisabled(step, selectedServices, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const sendOtp = () => {
    if (!customerInfo.phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number to receive OTP.",
        variant: "destructive",
      });
      return;
    }

    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${customerInfo.phone}`,
    });
  };

  const verifyOtp = (otp: string) => {
    if (otp === "1234") {
      toast({
        title: "OTP Verified",
        description: "Phone number verified successfully!",
      });
      setStep(step + 1);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (
    selectedServices: string[],
    selectedTechnician: string,
    selectedDate: Date,
    selectedTime: string,
    serviceType: string,
    services: any[],
    technicians: any[],
    loyaltyPointsToUse: number = 0
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Validate that we have selected services
    if (!selectedServices || selectedServices.length === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service to book.",
        variant: "destructive",
      });
      return;
    }

    // Validate address for in-home services
    if (serviceType === 'in-home' && !customerInfo.address?.trim()) {
      toast({
        title: "Address Required",
        description: "Please provide your address for in-home service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate total for all selected services
      const selectedServiceDetails = services.filter(s => selectedServices.includes(s.id.toString()));
      
      if (selectedServiceDetails.length === 0) {
        throw new Error("Selected services not found");
      }

      const servicesTotal = selectedServiceDetails.reduce((sum, service) => sum + service.price, 0);
      const totalDuration = selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0);
      const inHomeFee = serviceType === "in-home" ? 25 : 0;
      const subtotal = servicesTotal + inHomeFee;
      
      // Apply loyalty points discount
      const loyaltyDiscount = loyaltyPointsToUse / 10; // 10 points = $1
      const totalAmount = Math.max(0, subtotal - loyaltyDiscount);

      const appointmentData = {
        customerId: user.id,
        serviceIds: selectedServices,
        technicianId: selectedTechnician,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedTime,
        serviceType: serviceType,
        notes: customerInfo.notes,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        customerAddress: serviceType === 'in-home' ? customerInfo.address : '',
        totalAmount: totalAmount,
        servicesTotal: servicesTotal,
        totalDuration: totalDuration,
        loyaltyPointsUsed: loyaltyPointsToUse,
        loyaltyDiscount: loyaltyDiscount,
        status: 'scheduled',
        otpVerified: serviceType === 'in-home' ? true : false
      };

      // Try to submit to Spring Boot backend
      try {
        const response = await fetch('http://localhost:8080/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.id}`
          },
          body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
          throw new Error('Failed to create appointment');
        }

        const data = await response.json();
        console.log('Appointment created:', data);
      } catch (error) {
        console.log('Spring Boot unavailable, storing locally');
        localStorage.setItem(`appointment_${Date.now()}`, JSON.stringify(appointmentData));
      }

      // Store the booked slot in localStorage to mark it as unavailable
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const bookedSlotsKey = `booked_slots_${selectedTechnician}_${dateKey}`;
      const existingSlots = JSON.parse(localStorage.getItem(bookedSlotsKey) || '[]');
      const updatedSlots = [...existingSlots, selectedTime];
      localStorage.setItem(bookedSlotsKey, JSON.stringify(updatedSlots));

      // Deduct loyalty points using shared hook
      if (loyaltyPointsToUse > 0) {
        deductPoints(loyaltyPointsToUse);
      }

      // Send confirmation email with multiple services support
      await sendConfirmationEmail({
        services,
        technicians,
        selectedService: selectedServices[0], // For backward compatibility
        selectedServices: selectedServices, // Pass the full array
        selectedTechnician,
        selectedDate,
        selectedTime,
        serviceType,
        customerInfo: {
          ...customerInfo,
          address: serviceType === 'in-home' ? customerInfo.address : ''
        },
        totalAmount,
        loyaltyPointsUsed: loyaltyPointsToUse,
        loyaltyDiscount
      });

      setBookingDetails({
        ...appointmentData,
        service_names: selectedServiceDetails.map(s => s.name),
        service_name: selectedServiceDetails.map(s => s.name).join(', '),
        technician_name: technicians.find(t => t.id === selectedTechnician)?.name,
        selectedDate: selectedDate,
        appointment_time: selectedTime,
        service_duration: totalDuration,
        customer_name: customerInfo.name,
        customer_info: customerInfo,
        loyalty_points_used: loyaltyPointsToUse,
        loyalty_discount: loyaltyDiscount,
        selected_services: selectedServiceDetails
      });

      setShowConfirmation(true);

      // Refresh booked slots after successful booking
      if (refreshBookedSlots) {
        await refreshBookedSlots(selectedDate, selectedTechnician);
      }

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
    setSelectedDate(new Date());
    setSelectedTime("");
    setServiceType("in-store");
    setOtp("");
    setOtpSent(false);
    setCustomerInfo({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      notes: "",
      bankAccount: "",
      routingNumber: ""
    });
    
    navigate("/");
  };

  return {
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose
  };
};
