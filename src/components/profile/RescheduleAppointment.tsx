
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface RescheduleAppointmentProps {
  appointmentId: string;
  currentDate: string;
  currentTime: string;
  currentTechnician: string;
  serviceName: string;
  onRescheduleSuccess: () => void;
}

interface Technician {
  id: string;
  name: string;
  is_available: boolean;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({
  appointmentId,
  currentDate,
  currentTime,
  currentTechnician,
  serviceName,
  onRescheduleSuccess
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available technicians
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
      toast({
        title: "Error",
        description: "Failed to load technicians. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch booked slots for selected technician and date
  const fetchBookedSlots = async (date: Date, technicianId: string) => {
    if (!date || !technicianId) return;

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('technician_id', technicianId)
        .eq('appointment_date', formattedDate)
        .in('status', ['scheduled', 'confirmed'])
        .neq('id', appointmentId); // Exclude current appointment
      
      if (error) throw error;
      
      const booked = data?.map(appointment => appointment.appointment_time) || [];
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

  // Handle reschedule submission
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !selectedTechnicianId) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time, and technician.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('appointments')
        .update({
          appointment_date: formattedDate,
          appointment_time: selectedTime,
          technician_id: selectedTechnicianId,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Rescheduled",
        description: "Your appointment has been successfully rescheduled.",
      });

      setIsOpen(false);
      onRescheduleSuccess();
    } catch (error: any) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTechnicians();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate && selectedTechnicianId) {
      fetchBookedSlots(selectedDate, selectedTechnicianId);
    }
  }, [selectedDate, selectedTechnicianId]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-blue-50 hover:border-blue-300"
        >
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-pink-600" />
            Reschedule Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Appointment Info */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <Label className="text-base font-semibold">Select New Date:</Label>
              <div className="mt-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0;
                  }}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Technician & Time Selection */}
            <div className="space-y-4">
              {/* Technician Selection */}
              <div>
                <Label className="text-base font-semibold">Select Technician:</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {technicians.map((technician) => (
                    <Button
                      key={technician.id}
                      variant={selectedTechnicianId === technician.id ? "default" : "outline"}
                      className={`justify-start ${
                        selectedTechnicianId === technician.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "border-pink-200 text-pink-600 hover:bg-pink-50"
                      }`}
                      onClick={() => setSelectedTechnicianId(technician.id)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {technician.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && selectedTechnicianId && (
                <div>
                  <Label className="text-base font-semibold">Select New Time:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = selectedTime === time;
                      
                      return (
                        <Button
                          key={time}
                          variant={isSelected ? "default" : "outline"}
                          disabled={isBooked}
                          className={`text-sm ${
                            isSelected
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                              : isBooked
                              ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
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
                  {bookedSlots.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Unavailable times are marked as "Booked"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* New Appointment Summary */}
          {selectedDate && selectedTime && selectedTechnicianId && (
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
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || !selectedTechnicianId || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? "Rescheduling..." : "Confirm Reschedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleAppointment;
