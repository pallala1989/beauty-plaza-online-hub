
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, User, MapPin, Home, Phone, CheckCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { format } from "date-fns";

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
  const [services, setServices] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
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

  // Pre-select service if passed from Services page
  useEffect(() => {
    if (location.state?.preSelectedService) {
      const service = location.state.preSelectedService;
      setSelectedService(service.id.toString());
    }
  }, [location.state]);

  // Fetch services and technicians from Supabase
  useEffect(() => {
    fetchServices();
    fetchTechnicians();
  }, []);

  // Fetch booked slots when date/technician changes
  useEffect(() => {
    if (selectedDate && selectedTechnician) {
      fetchBookedSlots();
    }
  }, [selectedDate, selectedTechnician]);

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

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const fetchBookedSlots = async () => {
    if (!selectedDate || !selectedTechnician) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('technician_id', selectedTechnician)
        .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['scheduled', 'confirmed']);
      
      if (error) throw error;
      
      const booked = data?.map(appointment => appointment.appointment_time) || [];
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const handleNext = () => {
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

  const sendConfirmationEmail = async (appointmentData: any) => {
    try {
      // Initialize EmailJS
      emailjs.init('UmpeYlneD0XdC7d7D');

      const selectedServiceDetails = services.find(s => s.id === selectedService);
      const selectedTechnicianDetails = technicians.find(t => t.id === selectedTechnician);

      // Send email using EmailJS
      await emailjs.send(
        'service_e4fqv58',
        'template_bvdipdh',
        {
          from_name: customerInfo.name,
          from_email: customerInfo.email,
          to_name: 'Beauty Plaza',
          subject: 'New Appointment Booking',
          message: `
New appointment booking details:

Service: ${selectedServiceDetails?.name}
Technician: ${selectedTechnicianDetails?.name}
Date: ${format(selectedDate!, 'MMMM dd, yyyy')}
Time: ${selectedTime}
Service Type: ${serviceType === 'in-home' ? 'In-Home' : 'In-Store'}
Customer: ${customerInfo.name}
Email: ${customerInfo.email}
Phone: ${customerInfo.phone}
${serviceType === 'in-home' ? `Address: ${customerInfo.address}` : ''}
${customerInfo.notes ? `Notes: ${customerInfo.notes}` : ''}
Total Amount: $${appointmentData.total_amount}
          `
        }
      );

      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
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
      await sendConfirmationEmail(appointmentData);

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
  const maxStep = serviceType === "in-store" ? 4 : 5; // Adjust max step based on service type

  const getStepTitle = () => {
    if (step === 1) return "Step 1: Select Service";
    if (step === 2) return "Step 2: Choose Technician & Type";
    if (step === 3) return "Step 3: Pick Date & Time";
    if (step === 4 && serviceType === "in-home") return "Step 4: Verify Phone";
    return `Step ${serviceType === "in-store" ? 4 : 5}: Your Information`;
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
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {Array.from({ length: maxStep }, (_, i) => i + 1).map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < maxStep && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

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
              <div className="space-y-4">
                <Label>Choose your service:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all ${
                        selectedService === service.id
                          ? "ring-2 ring-pink-500 bg-pink-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-500">{service.duration} min</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-pink-600">${service.price}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Technician & Service Type */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label>Select your technician:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {technicians.map((tech) => (
                      <Card
                        key={tech.id}
                        className={`cursor-pointer transition-all ${
                          selectedTechnician === tech.id
                            ? "ring-2 ring-pink-500 bg-pink-50"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedTechnician(tech.id)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{tech.name}</h3>
                          <p className="text-sm text-gray-500">
                            {tech.specialties?.join(", ") || "Beauty Specialist"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Service type:</Label>
                  <RadioGroup value={serviceType} onValueChange={setServiceType} className="mt-2">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="in-store" id="in-store" />
                      <Label htmlFor="in-store" className="flex items-center cursor-pointer">
                        <MapPin className="w-4 h-4 mr-2" />
                        In-Store Service
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="in-home" id="in-home" />
                      <Label htmlFor="in-home" className="flex items-center cursor-pointer">
                        <Home className="w-4 h-4 mr-2" />
                        In-Home Service (+$25)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Select date:</Label>
                  <div className="mt-2 flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <Label>Select time:</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            disabled={isBooked}
                            className={`text-sm ${
                              selectedTime === time
                                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                                : isBooked
                                ? "opacity-50 cursor-not-allowed"
                                : "border-pink-200 text-pink-600 hover:bg-pink-50"
                            }`}
                            onClick={() => !isBooked && setSelectedTime(time)}
                          >
                            {time}
                            {isBooked && " (Booked)"}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: OTP Verification (In-Home Only) */}
            {step === 4 && serviceType === "in-home" && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Phone Verification Required</h3>
                  <p className="text-gray-600 mb-4">
                    For in-home services, we need to verify your phone number for security purposes.
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="(903) 921-0271"
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendOtp} 
                      disabled={!customerInfo.phone || otpSent}
                      variant="outline"
                    >
                      {otpSent ? "OTP Sent" : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <Label htmlFor="otp">Enter Verification Code *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        className="flex-1"
                      />
                      <Button 
                        onClick={verifyOtp}
                        disabled={otp.length !== 4}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      >
                        Verify
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Demo code: 1234</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5 (or 4 for in-store): Customer Information */}
            {((step === 4 && serviceType === "in-store") || (step === 5)) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">
                      Phone Number {serviceType === "in-home" ? "*" : ""}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required={serviceType === "in-home"}
                    />
                  </div>
                  {serviceType === "in-home" && (
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    placeholder="Any special requests or notes for your appointment..."
                  />
                </div>

                {/* Booking Summary */}
                <Card className="bg-pink-50 border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span>{selectedServiceDetails?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technician:</span>
                        <span>{technicians.find(t => t.id === selectedTechnician)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Time:</span>
                        <span>{selectedDate?.toLocaleDateString()} at {selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Type:</span>
                        <span>{serviceType === "in-home" ? "In-Home" : "In-Store"}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>${(selectedServiceDetails?.price || 0) + (serviceType === "in-home" ? 25 : 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && (!selectedTechnician || !serviceType)) ||
                (step === 3 && (!selectedDate || !selectedTime)) ||
                (step === 4 && serviceType === "in-home" && otp !== "1234")
              }
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
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Booking Confirmed!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-900">
                  {bookingDetails?.service_name}
                </p>
                <p>with {bookingDetails?.technician_name}</p>
                <p className="font-medium">
                  {bookingDetails?.formatted_date} at {bookingDetails?.formatted_time}
                </p>
                <p className="text-sm text-gray-600">
                  Service Type: {bookingDetails?.service_type === 'in-home' ? 'In-Home' : 'In-Store'}
                </p>
                <p className="text-lg font-bold text-pink-600">
                  Total: ${bookingDetails?.total_amount}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  A confirmation email has been sent to {bookingDetails?.customer_email}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button 
                onClick={handleConfirmationClose}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BookOnline;
