
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, User, MapPin, Home, Phone } from "lucide-react";
import { format } from "date-fns";

// Import new components
import BookingProgressIndicator from "@/components/booking/BookingProgressIndicator";
import ServiceSelection from "@/components/booking/ServiceSelection";
import TechnicianAndTypeSelection from "@/components/booking/TechnicianAndTypeSelection";
import DateTimeSelection from "@/components/booking/DateTimeSelection";
import PhoneVerification from "@/components/booking/PhoneVerification";
import CustomerInformation from "@/components/booking/CustomerInformation";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import { useBookingData } from "@/hooks/useBookingData";
import { sendConfirmationEmail } from "@/utils/emailService";

const BookOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  
  const { toast } = useToast();
  const { services, technicians, bookedSlots, fetchBookedSlots } = useBookingData();

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

  console.log('BookOnline - Current state:', {
    step,
    selectedService,
    selectedTechnician,
    serviceType,
    selectedDate,
    selectedTime
  });

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

  const selectedServiceDetails = services.find(s => s.id === selectedService);
  const selectedTechnicianDetails = technicians.find(t => t.id === selectedTechnician);
  const maxStep = serviceType === "in-store" ? 4 : 5; // Adjust max step based on service type

  const getStepTitle = () => {
    if (step === 1) return "Step 1: Select Service";
    if (step === 2) return "Step 2: Choose Technician & Type";
    if (step === 3) return "Step 3: Pick Date & Time";
    if (step === 4 && serviceType === "in-home") return "Step 4: Verify Phone";
    return `Step ${serviceType === "in-store" ? 4 : 5}: Your Information`;
  };

  // Check if next button should be enabled
  const isNextDisabled = () => {
    console.log('Checking if next is disabled for step:', step);
    console.log('Current values:', { selectedService, selectedTechnician, serviceType, selectedDate, selectedTime });
    
    if (step === 1) {
      const disabled = !selectedService;
      console.log('Step 1 - selectedService:', selectedService, 'disabled:', disabled);
      return disabled;
    }
    if (step === 2) {
      const disabled = !selectedTechnician || !serviceType;
      console.log('Step 2 - selectedTechnician:', selectedTechnician, 'serviceType:', serviceType, 'disabled:', disabled);
      return disabled;
    }
    if (step === 3) {
      const disabled = !selectedDate || !selectedTime;
      console.log('Step 3 - selectedDate:', selectedDate, 'selectedTime:', selectedTime, 'disabled:', disabled);
      return disabled;
    }
    if (step === 4 && serviceType === "in-home") {
      const disabled = otp !== "1234";
      console.log('Step 4 - otp:', otp, 'disabled:', disabled);
      return disabled;
    }
    return false;
  };

  const handleTechnicianSelect = (technicianId: string) => {
    console.log('Technician selected in parent:', technicianId);
    setSelectedTechnician(technicianId);
  };

  const handleServiceTypeChange = (newServiceType: string) => {
    console.log('Service type changed in parent:', newServiceType);
    setServiceType(newServiceType);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Follow these simple steps to schedule your beauty session
          </p>
        </div>

        {/* Progress Indicator */}
        <BookingProgressIndicator currentStep={step} maxStep={maxStep} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && <><User className="mr-2" /> {getStepTitle()}</>}
              {step === 2 && <><User className="mr-2" /> {getStepTitle()}</>}
              {step === 3 && <><CalendarDays className="mr-2" /> {getStepTitle()}</>}
              {step === 4 && serviceType === "in-home" && <><Phone className="mr-2" /> {getStepTitle()}</>}
              {((step === 4 && serviceType === "in-store") || (step === 5)) && <><MapPin className="mr-2" /> {getStepTitle()}</>}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Step 1: Select Service */}
            {step === 1 && (
              <ServiceSelection
                services={services}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />
            )}

            {/* Step 2: Choose Technician & Service Type */}
            {step === 2 && (
              <TechnicianAndTypeSelection
                technicians={technicians}
                selectedTechnician={selectedTechnician}
                serviceType={serviceType}
                onTechnicianSelect={handleTechnicianSelect}
                onServiceTypeChange={handleServiceTypeChange}
              />
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <DateTimeSelection
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                bookedSlots={bookedSlots}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
              />
            )}

            {/* Step 4: OTP Verification (In-Home Only) */}
            {step === 4 && serviceType === "in-home" && (
              <PhoneVerification
                phone={customerInfo.phone}
                otp={otp}
                otpSent={otpSent}
                onPhoneChange={(phone) => setCustomerInfo({...customerInfo, phone})}
                onOtpChange={setOtp}
                onSendOtp={sendOtp}
                onVerifyOtp={verifyOtp}
              />
            )}

            {/* Step 5 (or 4 for in-store): Customer Information */}
            {((step === 4 && serviceType === "in-store") || (step === 5)) && (
              <CustomerInformation
                customerInfo={customerInfo}
                serviceType={serviceType}
                selectedService={selectedServiceDetails}
                selectedTechnician={selectedTechnicianDetails}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onCustomerInfoChange={setCustomerInfo}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            Back
          </Button>
          
          {((step < 4 && serviceType === "in-store") || (step < 5 && serviceType === "in-home")) ? (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!customerInfo.name || !customerInfo.email || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          )}
        </div>

        {/* Confirmation Dialog */}
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
