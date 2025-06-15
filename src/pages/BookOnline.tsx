import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, User, MapPin, Home, Phone } from "lucide-react";

const BookOnline = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceType, setServiceType] = useState("in-store");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
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

  const services = [
    { id: "1", name: "Classic Facial", price: 75, duration: "60 min" },
    { id: "2", name: "Anti-Aging Facial", price: 120, duration: "75 min" },
    { id: "3", name: "Haircut & Style", price: 45, duration: "45 min" },
    { id: "4", name: "Hair Color", price: 85, duration: "120 min" },
    { id: "5", name: "Bridal Makeup", price: 150, duration: "90 min" },
    { id: "6", name: "Special Event Makeup", price: 60, duration: "45 min" },
    { id: "7", name: "Eyebrow Waxing", price: 25, duration: "20 min" },
    { id: "8", name: "Full Leg Waxing", price: 65, duration: "45 min" },
  ];

  const technicians = [
    { id: "1", name: "Sarah Johnson", specialty: "Facial Specialist" },
    { id: "2", name: "Emma Davis", specialty: "Hair Stylist" },
    { id: "3", name: "Lisa Chen", specialty: "Makeup Artist" },
    { id: "4", name: "Maria Rodriguez", specialty: "Waxing Specialist" },
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM"
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
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

  const handleSubmit = () => {
    toast({
      title: "Appointment Booked!",
      description: "Your appointment has been confirmed. You'll receive a confirmation email with calendar invite shortly.",
    });

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
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: ""
    });
  };

  const selectedServiceDetails = services.find(s => s.id === selectedService);

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
            {[1, 2, 3, 4, 5].map((stepNumber) => (
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
                {stepNumber < 5 && (
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
              {step === 1 && <><User className="mr-2" /> Step 1: Select Service</>}
              {step === 2 && <><User className="mr-2" /> Step 2: Choose Technician & Type</>}
              {step === 3 && <><CalendarDays className="mr-2" /> Step 3: Pick Date & Time</>}
              {step === 4 && <><Phone className="mr-2" /> Step 4: Verify Phone (In-Home Only)</>}
              {step === 5 && <><MapPin className="mr-2" /> Step 5: Your Information</>}
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
                            <p className="text-sm text-gray-500">{service.duration}</p>
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
                          <p className="text-sm text-gray-500">{tech.specialty}</p>
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
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`text-sm ${
                            selectedTime === time
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                              : "border-pink-200 text-pink-600 hover:bg-pink-50"
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
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

            {/* Step 5: Customer Information */}
            {step === 5 && (
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
                      Phone Number {serviceType === "in-home" && "*"}
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
          
          {step < 5 ? (
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
              {step === 4 && serviceType === "in-store" ? "Skip" : "Next"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!customerInfo.name || !customerInfo.email}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOnline;
