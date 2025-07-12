
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingFlow } from '@/hooks/booking/useBookingFlow';
import { useBookingData } from '@/hooks/useBookingData';
import BookingProgressIndicator from './BookingProgressIndicator';
import MultiServiceSelection from './MultiServiceSelection';
import TechnicianAndTypeSelection from './TechnicianAndTypeSelection';
import DateTimeSelection from './DateTimeSelection';
import CustomerInformation from './CustomerInformation';
import PaymentStep from './PaymentStep';
import BookingConfirmation from './BookingConfirmation';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

const BookingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const {
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
    technicians,
    bookedSlots,
    isFetchingSlots,
    fullyBookedDays,
    setSelectedServices,
    setSelectedService,
    setSelectedTechnician,
    handleDateSelect,
    setSelectedTime,
    setServiceType,
    setOtp,
    setCustomerInfo,
    setLoyaltyPointsToUse,
    handleServiceToggle,
    handleRemoveService,
    handleNext,
    handleBack,
    sendOtp,
    verifyOtp,
    handleSubmit,
    handleConfirmationClose,
    isNextDisabled,
    handleMonthChange
  } = useBookingFlow();

  const {
    services: dataServices,
    technicians: dataTechnicians,
    timeSlots,
    isLoading: dataLoading,
    error: dataError,
    fetchTimeSlots
  } = useBookingData();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedServices([service.id]);
        setSelectedService(service.id);
      }
    }
  }, [serviceId, services, setSelectedServices, setSelectedService]);

  const handleStepSubmit = async (stepData: any) => {
    try {
      setError(null);
      
      switch (step) {
        case 1:
          handleServiceToggle(stepData.selectedServices[0]);
          handleNext();
          break;
        case 2:
          setSelectedTechnician(stepData.technician);
          setServiceType(stepData.serviceType);
          if (stepData.technician && stepData.serviceType && selectedServices.length > 0) {
            await fetchTimeSlots(
              selectedServices[0],
              stepData.technician,
              stepData.serviceType
            );
          }
          handleNext();
          break;
        case 3:
          handleDateSelect(stepData.date);
          setSelectedTime(stepData.time);
          handleNext();
          break;
        case 4:
          setCustomerInfo(stepData);
          handleNext();
          break;
        case 5:
          setCustomerInfo({ ...customerInfo, ...stepData });
          await handleBookingSubmission();
          break;
        default:
          break;
      }
    } catch (error: any) {
      console.error('Step submission error:', error);
      setError(error.message || 'An error occurred while processing your booking');
    }
  };

  const handleBookingSubmission = async () => {
    try {
      await handleSubmit();
    } catch (error: any) {
      console.error('Booking submission error:', error);
      setError(error.message || 'Failed to submit booking');
    }
  };

  const steps = [
    { number: 1, title: 'Select Services', description: 'Choose your services' },
    { number: 2, title: 'Technician & Type', description: 'Select technician and service type' },
    { number: 3, title: 'Date & Time', description: 'Pick your preferred time' },
    { number: 4, title: 'Your Information', description: 'Provide contact details' },
    { number: 5, title: 'Payment', description: 'Complete your booking' },
    { number: 6, title: 'Confirmation', description: 'Booking confirmed' }
  ];

  if (dataLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {dataError}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderCurrentStep = () => {
    const commonProps = {
      onSubmit: handleStepSubmit,
      onBack: step > 1 ? handleBack : undefined,
      isSubmitting: isLoading
    };

    switch (step) {
      case 1:
        return (
          <MultiServiceSelection
            services={services}
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
            onRemoveService={handleRemoveService}
          />
        );
      case 2:
        return (
          <TechnicianAndTypeSelection
            {...commonProps}
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            serviceType={serviceType}
            onTechnicianSelect={setSelectedTechnician}
            onServiceTypeChange={setServiceType}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            {...commonProps}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            bookedSlots={bookedSlots}
            isFetchingSlots={isFetchingSlots}
            fullyBookedDays={fullyBookedDays}
            onDateSelect={handleDateSelect}
            onTimeSelect={setSelectedTime}
            onMonthChange={handleMonthChange}
          />
        );
      case 4:
        return (
          <CustomerInformation
            {...commonProps}
            customerInfo={customerInfo}
            serviceType={serviceType}
            selectedServices={services.filter(s => selectedServices.includes(s.id))}
            selectedTechnician={technicians.find(t => t.id === selectedTechnician)}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            loyaltyPointsToUse={loyaltyPointsToUse}
            onCustomerInfoChange={setCustomerInfo}
            onLoyaltyPointsChange={setLoyaltyPointsToUse}
          />
        );
      case 5:
        return (
          <PaymentStep
            {...commonProps}
            selectedServices={services.filter(s => selectedServices.includes(s.id))}
            customerInfo={customerInfo}
            onPaymentComplete={() => handleNext()}
            onSkipPayment={() => handleNext()}
          />
        );
      case 6:
        return (
          <BookingConfirmation
            isOpen={true}
            bookingDetails={bookingDetails}
            onClose={() => {
              navigate('/book-online');
              window.location.reload();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BookingProgressIndicator
            currentStep={step}
            maxStep={6}
          />

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
