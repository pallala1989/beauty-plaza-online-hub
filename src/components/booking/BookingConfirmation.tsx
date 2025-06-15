
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import { generateIcsContent } from '@/utils/icalService';

interface BookingDetails {
  service_name: string;
  technician_name: string;
  selectedDate: Date;
  appointment_time: string;
  service_duration: number;
  service_type: string;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  customer_info: {
    address?: string;
  };
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
  const handleAddToCalendar = async () => {
    if (!bookingDetails) return;

    const icalData = {
      serviceName: bookingDetails.service_name,
      technicianName: bookingDetails.technician_name,
      selectedDate: bookingDetails.selectedDate,
      selectedTime: bookingDetails.appointment_time,
      duration: bookingDetails.service_duration,
      customerName: bookingDetails.customer_name,
      customerEmail: bookingDetails.customer_email,
      serviceType: bookingDetails.service_type,
      address: bookingDetails.customer_info?.address
    };

    try {
      const icsContent = await generateIcsContent(icalData);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'appointment.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate iCal file", error);
    }
  };

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
              {bookingDetails && format(bookingDetails.selectedDate, 'MMMM dd, yyyy')} at {bookingDetails?.appointment_time}
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
        <AlertDialogFooter className="flex-col space-y-2">
          <Button 
            onClick={handleAddToCalendar}
            variant="outline"
            className="w-full"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
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
