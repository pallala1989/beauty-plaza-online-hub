
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBookingFlow } from '@/hooks/booking/useBookingFlow';
import { useBookingData } from '@/hooks/useBookingData';
import { BookingProgressIndicator } from './BookingProgressIndicator';
import { ServiceSelection } from './ServiceSelection';
import { TechnicianAndTypeSelection } from './TechnicianAndTypeSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { CustomerInformation } from './CustomerInformation';
import { PaymentStep } from './PaymentStep';
import { BookingConfirmation } from './BookingConfirmation';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const BookingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const {
    currentStep,
    bookingData,
    goToStep,
    nextStep,
    previousStep,
    updateBookingData,
    submitBooking,
    isSubmitting
  } = useBookingFlow();

  const {
    services,
    technicians,
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
        updateBookingData({ selectedServices: [service] });
      }
    }
  }, [serviceId, services, updateBookingData]);

  const handleStepSubmit = async (stepData: any) => {
    try {
      setError(null);
      
      switch (currentStep) {
        case 1:
          updateBookingData({ selectedServices: stepData.selectedServices });
          nextStep();
          break;
        case 2:
          updateBookingData({ 
            selectedTechnician: stepData.technician,
            serviceType: stepData.serviceType 
          });
          // Fetch available time slots when technician and service type are selected
          if (stepData.technician && stepData.serviceType && bookingData.selectedServices.length > 0) {
            await fetchTimeSlots(
              bookingData.selectedServices[0].id,
              stepData.technician.id,
              stepData.serviceType
            );
          }
          nextStep();
          break;
        case 3:
          updateBookingData({ 
            selectedDate: stepData.date,
            selectedTime: stepData.time 
          });
          nextStep();
          break;
        case 4:
          updateBookingData({ customerInfo: stepData });
          nextStep();
          break;
        case 5:
          updateBookingData({ paymentInfo: stepData });
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
      const result = await submitBooking();
      if (result.success) {
        nextStep(); // Go to confirmation step
      } else {
        setError(result.error || 'Failed to submit booking');
      }
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

  if (dataLoading) {
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
      onBack: currentStep > 1 ? previousStep : undefined,
      isSubmitting
    };

    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            {...commonProps}
            services={services}
            selectedServices={bookingData.selectedServices}
          />
        );
      case 2:
        return (
          <TechnicianAndTypeSelection
            {...commonProps}
            technicians={technicians}
            selectedTechnician={bookingData.selectedTechnician}
            selectedServiceType={bookingData.serviceType}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            {...commonProps}
            timeSlots={timeSlots}
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
          />
        );
      case 4:
        return (
          <CustomerInformation
            {...commonProps}
            initialData={bookingData.customerInfo}
            user={user}
          />
        );
      case 5:
        return (
          <PaymentStep
            {...commonProps}
            bookingData={bookingData}
          />
        );
      case 6:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={() => {
              navigate('/book-online');
              window.location.reload();
            }}
            onViewBookings={() => navigate('/my-bookings')}
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
            steps={steps}
            currentStep={currentStep}
            onStepClick={goToStep}
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
