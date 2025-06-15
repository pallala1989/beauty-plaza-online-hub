
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  is_available: boolean;
}

interface NewAppointmentSummaryProps {
  selectedDate: Date;
  selectedTime: string;
  selectedTechnicianId: string;
  technicians: Technician[];
}

const NewAppointmentSummary: React.FC<NewAppointmentSummaryProps> = ({
  selectedDate,
  selectedTime,
  selectedTechnicianId,
  technicians
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-sm text-green-800">New Appointment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-green-700">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {formatDate(selectedDate.toISOString())}
        </div>
        <div className="flex items-center text-sm text-green-700">
          <Clock className="w-4 h-4 mr-2" />
          {formatTime(selectedTime)}
        </div>
        <div className="flex items-center text-sm text-green-700">
          <User className="w-4 h-4 mr-2" />
          {technicians.find(t => t.id === selectedTechnicianId)?.name}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAppointmentSummary;
