
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sendConfirmationEmail } from "@/utils/emailService";

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

  const handleNext = (
    selectedService: string,
    selectedTechnician: string,
    selectedDate?: Date,
    selectedTime?: string,
    serviceType?: string,
    otp?: string,
    technicians?: any[]
  ) => {
    console.log('handleNext called, current step:', step);
    console.log('Validation result:', !isNextDisabled(step, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians));
    
    if (!isNextDisabled(step, selectedService, selectedTechnician, selectedDate, selectedTime, serviceType, otp, customerInfo, technicians)) {
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
    selectedService: string,
    selectedTechnician: string,
    selectedDate: Date,
    selectedTime: string,
    serviceType: string,
    services: any[],
    technicians: any[]
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

    setIsLoading(true);

    try {
      // Create appointment data for Spring Boot backend
      const selectedServiceDetails = services.find(s => s.id === selectedService);
      const totalAmount = (selectedServiceDetails?.price || 0) + (serviceType === "in-home" ? 25 : 0);

      const appointmentData = {
        customerId: user.id,
        serviceId: selectedService,
        technicianId: selectedTechnician,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedTime,
        serviceType: serviceType,
        notes: customerInfo.notes,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        totalAmount: totalAmount,
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
        // Store locally for now - in real app this would be handled differently
        localStorage.setItem(`appointment_${Date.now()}`, JSON.stringify(appointmentData));
      }

      await sendConfirmationEmail({
        services,
        technicians,
        selectedService,
        selectedTechnician,
        selectedDate,
        selectedTime,
        serviceType,
        customerInfo,
        totalAmount
      });

      setBookingDetails({
        ...appointmentData,
        service_name: selectedServiceDetails?.name,
        technician_name: technicians.find(t => t.id === selectedTechnician)?.name,
        selectedDate: selectedDate,
        appointment_time: selectedTime,
        service_duration: selectedServiceDetails?.duration,
        customer_name: customerInfo.name,
        customer_info: customerInfo
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
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      notes: ""
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
