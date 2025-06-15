
import React from 'react';
import { Button } from "@/components/ui/button";

interface BookingNavigationProps {
  step: number;
  serviceType: string;
  isLoading: boolean;
  isNextDisabled: boolean;
  customerInfo: any;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const BookingNavigation: React.FC<BookingNavigationProps> = ({
  step,
  serviceType,
  isLoading,
  isNextDisabled,
  customerInfo,
  onBack,
  onNext,
  onSubmit
}) => {
  const isLastStep = (step === 4 && serviceType === "in-store") || (step === 5 && serviceType === "in-home");

  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="border-pink-200 text-pink-600 hover:bg-pink-50"
      >
        Back
      </Button>
      
      {!isLastStep ? (
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </Button>
      )}
    </div>
  );
};

export default BookingNavigation;
