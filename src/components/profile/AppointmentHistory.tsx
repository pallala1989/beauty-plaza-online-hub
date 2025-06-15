
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Phone, Loader2 } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { supabase } from "@/integrations/supabase/client";

const AppointmentHistory = () => {
  const { toast } = useToast();
  const { appointments, isLoading, error, refetch } = useAppointments();

  const handleReschedule = async (appointmentId: string) => {
    try {
      // Here you could implement actual rescheduling logic
      // For now, we'll just show a message
      toast({
        title: "Reschedule Requested",
        description: "Your reschedule request has been submitted. We'll contact you shortly to confirm new timing.",
      });
      
      console.log('Rescheduling appointment:', appointmentId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });

      // Refresh the appointments list
      refetch();
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
      case "confirmed": 
        return "bg-blue-100 text-blue-800";
      case "completed": 
        return "bg-green-100 text-green-800";
      case "cancelled": 
        return "bg-red-100 text-red-800";
      default: 
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const isUpcoming = (status: string) => {
    return status.toLowerCase() === 'scheduled' || status.toLowerCase() === 'confirmed';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            <p>Error loading appointments: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-pink-600" />
          Appointment History
        </CardTitle>
        <CardDescription>
          View and manage your appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{appointment.service.name}</h3>
                  <p className="text-gray-600">with {appointment.technician.name}</p>
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(appointment.appointment_date)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(appointment.appointment_time)}
                </div>
                <div className="flex items-center text-gray-600">
                  {appointment.service_type === "in-store" ? (
                    <MapPin className="w-4 h-4 mr-2" />
                  ) : (
                    <Phone className="w-4 h-4 mr-2" />
                  )}
                  {appointment.service_type === "in-store" ? "In-Store" : "In-Home"}
                </div>
              </div>

              {appointment.notes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Notes:</strong> {appointment.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="font-semibold text-lg">
                  ${appointment.total_amount}
                </div>
                {isUpcoming(appointment.status) && (
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleReschedule(appointment.id)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      Reschedule
                    </Button>
                    <Button
                      onClick={() => handleCancel(appointment.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No appointments found</p>
            <p className="text-sm">Book your first appointment to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentHistory;
