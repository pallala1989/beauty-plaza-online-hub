
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";

interface Appointment {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  technician: string;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
  serviceType: "in-store" | "in-home";
}

const AppointmentHistory = () => {
  const { toast } = useToast();
  
  // Mock appointment data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      serviceName: "Hair Cut & Style",
      date: "2024-06-20",
      time: "2:00 PM",
      technician: "Sarah Johnson",
      status: "upcoming",
      price: 85,
      serviceType: "in-store"
    },
    {
      id: "2", 
      serviceName: "Manicure & Pedicure",
      date: "2024-06-10",
      time: "10:00 AM",
      technician: "Emily Chen",
      status: "completed",
      price: 65,
      serviceType: "in-store"
    }
  ]);

  const handleReschedule = (appointmentId: string) => {
    // Here you would implement actual reschedule functionality
    toast({
      title: "Reschedule Requested",
      description: "Your reschedule request has been submitted. We'll contact you shortly to confirm new timing.",
    });
    
    // Update appointment status or navigate to reschedule page
    console.log('Rescheduling appointment:', appointmentId);
  };

  const handleCancel = (appointmentId: string) => {
    // Here you would implement actual cancel functionality
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "cancelled" as const }
          : apt
      )
    );
    
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
                  <h3 className="font-semibold text-lg">{appointment.serviceName}</h3>
                  <p className="text-gray-600">with {appointment.technician}</p>
                </div>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {appointment.time}
                </div>
                <div className="flex items-center text-gray-600">
                  {appointment.serviceType === "in-store" ? (
                    <MapPin className="w-4 h-4 mr-2" />
                  ) : (
                    <Phone className="w-4 h-4 mr-2" />
                  )}
                  {appointment.serviceType === "in-store" ? "In-Store" : "In-Home"}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="font-semibold text-lg">
                  ${appointment.price}
                </div>
                {appointment.status === "upcoming" && (
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
