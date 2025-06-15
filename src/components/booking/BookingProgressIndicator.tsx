
import React from 'react';

interface BookingProgressIndicatorProps {
  currentStep: number;
  maxStep: number;
}

const BookingProgressIndicator: React.FC<BookingProgressIndicatorProps> = ({ currentStep, maxStep }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {Array.from({ length: maxStep }, (_, i) => i + 1).map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= stepNumber
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < maxStep && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > stepNumber ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressIndicator;
