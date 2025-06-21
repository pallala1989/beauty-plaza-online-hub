
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Edit, 
  Trash2, 
  CreditCard,
  Phone,
  MapPin,
  CheckCircle,
  XCircle
} from "lucide-react";
import PaymentStep from "@/components/booking/PaymentStep";

interface AppointmentsManagementProps {
  userRole?: string;
  userId?: string;
}

const AppointmentsManagement: React.FC<AppointmentsManagementProps> = ({ userRole, userId }) => {
  const { toast } = useToast();
  const { appointments, isLoading, refetch } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    technician: ''
  });

  // Mock technicians data - in real app, this would come from API
  const technicians = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'Emma Davis' },
    { id: '3', name: 'Lisa Chen' }
  ];

  // Mock services for payment
  const mockServices = [
    { id: '1', name: 'Classic Facial', price: 75, duration: 60 },
    { id: '2', name: 'Hair Color', price: 85, duration: 120 },
    { id: '3', name: 'Bridal Makeup', price: 150, duration: 90 }
  ];

  // Filter appointments based on user role - since technician only has name, we'll filter by name
  const filteredAppointments = userRole === 'admin' 
    ? appointments 
    : appointments.filter(apt => apt.technician?.name === userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'scheduled':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      case 'completed':
        return "bg-blue-100 text-blue-800";
      case 'paid':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if appointment can be modified based on status
  const canModifyAppointment = (appointment: any) => {
    const restrictedStatuses = ['paid', 'completed', 'cancelled'];
    return !restrictedStatuses.includes(appointment.status);
  };

  // Check if payment can be processed
  const canProcessPayment = (appointment: any) => {
    const allowedStatuses = ['confirmed', 'scheduled', 'completed'];
    return allowedStatuses.includes(appointment.status) && appointment.status !== 'paid';
  };

  const handlePayment = (appointment: any) => {
    if (!canProcessPayment(appointment)) {
      toast({
        title: "Payment Not Available",
        description: "Payment cannot be processed for this appointment status.",
        variant: "destructive",
      });
      return;
    }
    setSelectedAppointment(appointment);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    setSelectedAppointment(null);
    toast({
      title: "Payment Processed",
      description: "Payment has been successfully processed.",
    });
    refetch();
  };

  const handleSkipPayment = () => {
    setShowPayment(false);
    setSelectedAppointment(null);
    toast({
      title: "Payment Marked as Pending",
      description: "Payment has been marked as pending for later processing.",
    });
  };

  const handleReschedule = (appointment: any) => {
    if (!canModifyAppointment(appointment)) {
      toast({
        title: "Cannot Reschedule",
        description: "This appointment cannot be rescheduled due to its current status.",
        variant: "destructive",
      });
      return;
    }
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      technician: appointment.technician?.name || ''
    });
    setShowReschedule(true);
  };

  const handleRescheduleSubmit = () => {
    // In real app, this would call an API to update the appointment
    console.log('Rescheduling appointment:', selectedAppointment.id, rescheduleData);
    setShowReschedule(false);
    setSelectedAppointment(null);
    toast({
      title: "Appointment Rescheduled",
      description: "The appointment has been successfully rescheduled.",
    });
    refetch();
  };

  const handleCancel = (appointmentId: string, appointment: any) => {
    if (!canModifyAppointment(appointment)) {
      toast({
        title: "Cannot Cancel",
        description: "This appointment cannot be cancelled due to its current status.",
        variant: "destructive",
      });
      return;
    }
    // In real app, this would call an API to cancel the appointment
    console.log('Cancelling appointment:', appointmentId);
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
    });
    refetch();
  };

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    // In real app, this would call an API to update the appointment status
    console.log('Updating appointment status:', appointmentId, newStatus);
    toast({
      title: "Status Updated",
      description: `Appointment status updated to ${newStatus}.`,
    });
    refetch();
  };

  if (showPayment && selectedAppointment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentStep
            selectedServices={[mockServices[0]]} // Mock service data
            customerInfo={{
              name: 'Customer',
              email: selectedAppointment.customer_email || '',
              phone: ''
            }}
            onPaymentComplete={handlePaymentComplete}
            onSkipPayment={handleSkipPayment}
          />
          <Button 
            variant="outline" 
            onClick={() => setShowPayment(false)}
            className="mt-4"
          >
            Back to Appointments
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {userRole === 'admin' ? 'All Appointments' : 'My Appointments'}
        </h2>
        <Button onClick={refetch} variant="outline">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading appointments...</div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        Customer
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{appointment.appointment_date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Service:</span>
                      <span className="ml-1 font-medium">{appointment.service?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Technician:</span>
                      <span className="ml-1 font-medium">{appointment.technician?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="font-medium">${appointment.total_amount}</span>
                    </div>
                  </div>

                  {appointment.service_type === 'in-home' && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">In-Home Service</span>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  
                  {/* Admin only - Status update buttons */}
                  {userRole === 'admin' && canModifyAppointment(appointment) && (
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                        className="text-green-600 border-green-200"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                        className="text-blue-600 border-blue-200"
                      >
                        Complete
                      </Button>
                    </div>
                  )}
                  
                  {canProcessPayment(appointment) && (
                    <Button
                      size="sm"
                      onClick={() => handlePayment(appointment)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Payment
                    </Button>
                  )}

                  {canModifyAppointment(appointment) && (
                    <>
                      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReschedule(appointment)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Reschedule
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reschedule Appointment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="reschedule-date">New Date</Label>
                              <Input
                                id="reschedule-date"
                                type="date"
                                value={rescheduleData.date}
                                onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="reschedule-time">New Time</Label>
                              <Input
                                id="reschedule-time"
                                type="time"
                                value={rescheduleData.time}
                                onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="reschedule-technician">Technician</Label>
                              <Select
                                value={rescheduleData.technician}
                                onValueChange={(value) => setRescheduleData({...rescheduleData, technician: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select technician" />
                                </SelectTrigger>
                                <SelectContent>
                                  {technicians.map((tech) => (
                                    <SelectItem key={tech.id} value={tech.name}>
                                      {tech.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowReschedule(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleRescheduleSubmit}>
                                Reschedule
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(appointment.id, appointment)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {!canModifyAppointment(appointment) && (
                    <span className="text-sm text-gray-500">
                      {appointment.status === 'paid' ? 'Paid - No changes allowed' : 
                       appointment.status === 'completed' ? 'Completed' : 
                       'Cancelled'}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredAppointments.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No appointments found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsManagement;
