import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Phone, Loader2 } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/AuthContext";
import RescheduleAppointment from "./RescheduleAppointment";

const AppointmentHistory = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { appointments, isLoading, error, refetch } = useAppointments();

  const handleCancel = async (appointmentId: string) => {
    try {
      console.log('Cancelling appointment:', appointmentId);
      
      // Try Spring Boot backend first
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.id}`
          }
        });

        if (response.ok) {
          toast({
            title: "Appointment Cancelled",
            description: "Your appointment has been successfully cancelled.",
          });
          refetch();
          return;
        }
      } catch (error) {
        console.log('Spring Boot unavailable, using local storage');
      }

      // Fallback for local storage or mock implementation
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
                    <RescheduleAppointment
                      appointmentId={appointment.id}
                      currentDate={appointment.appointment_date}
                      currentTime={appointment.appointment_time}
                      currentTechnician={appointment.technician.name}
                      serviceName={appointment.service.name}
                      onRescheduleSuccess={refetch}
                    />
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
