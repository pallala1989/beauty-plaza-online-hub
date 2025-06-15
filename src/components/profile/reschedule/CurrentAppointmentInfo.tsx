
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";

interface CurrentAppointmentInfoProps {
  serviceName: string;
  currentDate: string;
  currentTime: string;
}

const CurrentAppointmentInfo: React.FC<CurrentAppointmentInfoProps> = ({
  serviceName,
  currentDate,
  currentTime
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
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-sm">Current Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          {serviceName}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4 mr-2" />
          {formatDate(currentDate)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          {formatTime(currentTime)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentAppointmentInfo;
