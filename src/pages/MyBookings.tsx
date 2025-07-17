
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, MapPin, Phone, CreditCard } from "lucide-react";
import { format } from 'date-fns';
import AdminBookings from '@/components/admin/AdminBookings';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_type: string;
  notes: string;
  total_amount: number;
  customer_phone: string;
  services: { name: string; price: number; duration: number } | null;
  technicians: { name: string; specialties: string[] } | null;
}

const MyBookings = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show admin bookings for admin users
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              All Appointments
            </h1>
            <p className="text-gray-600 mt-2">Manage all customer appointments</p>
          </div>
          <AdminBookings />
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUserAppointments();
  }, [user]);

  const fetchUserAppointments = async () => {
    if (!user) return;

    try {
      console.log('Fetching appointments for user:', user.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services:service_id(name, price, duration),
          technicians:technician_id(name, specialties)
        `)
        .or(`customer_id.eq.${user.id},customer_email.eq.${user.email}`)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched appointments:', data);
      
      // Transform the data to match expected types, handling potential query errors
      const transformedAppointments: Appointment[] = (data || []).map(appointment => {
        // Handle services relationship
        let servicesData: { name: string; price: number; duration: number } | null = null;
        if (appointment.services && typeof appointment.services === 'object' && !Array.isArray(appointment.services)) {
          const services = appointment.services as any;
          if (services.name) {
            servicesData = {
              name: services.name,
              price: services.price || 0,
              duration: services.duration || 0
            };
          }
        }

        // Handle technicians relationship
        let techniciansData: { name: string; specialties: string[] } | null = null;
        if (appointment.technicians && typeof appointment.technicians === 'object' && !Array.isArray(appointment.technicians)) {
          const technicians = appointment.technicians as any;
          if (technicians && technicians.name) {
            techniciansData = {
              name: technicians.name,
              specialties: technicians.specialties || []
            };
          }
        }

        return {
          id: appointment.id,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
          status: appointment.status || 'scheduled',
          service_type: appointment.service_type || 'in-store',
          notes: appointment.notes,
          total_amount: appointment.total_amount,
          customer_phone: appointment.customer_phone,
          services: servicesData,
          technicians: techniciansData
        };
      });
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load your appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-gray-600 mt-2">View and manage your beauty appointments</p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't booked any appointments. Start by booking your first service!
              </p>
              <Button 
                onClick={() => window.location.href = '/book-online'}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.services?.name || 'Service not found'}
                      </CardTitle>
                      <CardDescription>
                        {appointment.technicians?.name 
                          ? `with ${appointment.technicians.name}` 
                          : 'No technician assigned'
                        }
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(appointment.appointment_date), 'EEEE, MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{appointment.appointment_time}</p>
                          {appointment.services?.duration && (
                            <p className="text-sm text-gray-500">
                              Duration: {appointment.services.duration} minutes
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {appointment.service_type === 'in-home' ? 'In-Home Service' : 'In-Store Service'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {appointment.customer_phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <p>{appointment.customer_phone}</p>
                        </div>
                      )}
                      {appointment.total_amount && (
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <p className="font-medium text-green-600">
                            ${appointment.total_amount}
                          </p>
                        </div>
                      )}
                      {appointment.technicians?.specialties && (
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {appointment.technicians.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm"><strong>Notes:</strong> {appointment.notes}</p>
                    </div>
                  )}

                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <div className="mt-6 flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => cancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel Appointment
                      </Button>
                      <Button variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
