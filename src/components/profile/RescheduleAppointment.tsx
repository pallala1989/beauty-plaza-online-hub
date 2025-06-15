
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import CurrentAppointmentInfo from "./reschedule/CurrentAppointmentInfo";
import DateSelection from "./reschedule/DateSelection";
import TechnicianSelection from "./reschedule/TechnicianSelection";
import TimeSlotSelection from "./reschedule/TimeSlotSelection";
import NewAppointmentSummary from "./reschedule/NewAppointmentSummary";

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
        .neq('id', appointmentId);
      
      if (error) throw error;
      
      const booked = data?.map(appointment => appointment.appointment_time) || [];
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
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
          <CurrentAppointmentInfo
            serviceName={serviceName}
            currentDate={currentDate}
            currentTime={currentTime}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DateSelection
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            <div className="space-y-4">
              <TechnicianSelection
                technicians={technicians}
                selectedTechnicianId={selectedTechnicianId}
                onTechnicianSelect={setSelectedTechnicianId}
              />

              {selectedDate && selectedTechnicianId && (
                <TimeSlotSelection
                  timeSlots={timeSlots}
                  bookedSlots={bookedSlots}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              )}
            </div>
          </div>

          {selectedDate && selectedTime && selectedTechnicianId && (
            <NewAppointmentSummary
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedTechnicianId={selectedTechnicianId}
              technicians={technicians}
            />
          )}

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
              className="bg-green-500 text-white hover:bg-green-600"
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
