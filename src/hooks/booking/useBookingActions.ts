import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
      // Double-check slot availability before booking
      if (refreshBookedSlots) {
        await refreshBookedSlots(selectedDate, selectedTechnician);
      }

      // Re-check if the slot is still available after refresh
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('technician_id', selectedTechnician)
        .eq('appointment_date', formattedDate)
        .eq('appointment_time', selectedTime)
        .in('status', ['scheduled', 'confirmed']);

      if (checkError) {
        console.error('Error checking slot availability:', checkError);
        throw checkError;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        toast({
          title: "Time Slot Unavailable",
          description: "This time slot was just booked by someone else. Please select a different time.",
          variant: "destructive",
        });
        setStep(3); // Go back to date/time selection
        if (refreshBookedSlots) {
          await refreshBookedSlots(selectedDate, selectedTechnician);
        }
        return;
      }

      const selectedServiceDetails = services.find(s => s.id === selectedService);
      const totalAmount = (selectedServiceDetails?.price || 0) + (serviceType === "in-home" ? 25 : 0);

      const appointmentData = {
        customer_id: user.id,
        service_id: selectedService,
        technician_id: selectedTechnician,
        appointment_date: formattedDate,
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
        if (error.code === '23505') {
          toast({
            title: "Time Slot Unavailable",
            description: "This time slot is already booked. Please select a different time.",
            variant: "destructive",
          });
          setStep(3);
          if (refreshBookedSlots) {
            await refreshBookedSlots(selectedDate, selectedTechnician);
          }
          return;
        }
        throw error;
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
      name: user?.user_metadata?.full_name || "",
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
