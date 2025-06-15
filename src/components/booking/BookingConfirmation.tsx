
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface BookingDetails {
  service_name: string;
  technician_name: string;
  formatted_date: string;
  formatted_time: string;
  service_type: string;
  total_amount: number;
  customer_email: string;
}

interface BookingConfirmationProps {
  isOpen: boolean;
  bookingDetails: BookingDetails | null;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  isOpen,
  bookingDetails,
  onClose
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
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
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BookingConfirmation;
