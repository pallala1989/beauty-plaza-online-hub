
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarDays, Clock, User, MapPin, Home } from 'lucide-react';
import RescheduleAppointment from '@/components/profile/RescheduleAppointment';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_type: string;
  notes?: string;
  total_amount?: number;
  customer_phone?: string;
  services: {
    name: string;
    price: number;
    duration: number;
  } | null;
  technicians: {
    name: string;
    specialties: string[];
  } | null;
}

const MyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      console.log('Fetching appointments for user:', user?.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services(name, price, duration),
          technicians(name, specialties)
        `)
        .eq('customer_id', user?.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      
      console.log('Fetched appointments:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      
      fetchAppointments(); // Refresh the list
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
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      // Parse time string (HH:mm format) and format it nicely
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to view your bookings.</p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600 mt-2">View and manage your appointments</p>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
              <Button 
                onClick={() => window.location.href = '/book-online'}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-pink-600" />
                        {appointment.services?.name || 'Service'}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                      </CardDescription>
                      {appointment.services?.duration && (
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.services.duration} minutes
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        {appointment.service_type === 'in-home' ? (
                          <><Home className="w-4 h-4 mr-1" /> In-Home</>
                        ) : (
                          <><MapPin className="w-4 h-4 mr-1" /> In-Store</>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Technician</p>
                      <p className="text-sm text-gray-600">
                        {appointment.technicians?.name || 'Not assigned'}
                      </p>
                      {appointment.technicians?.specialties && (
                        <p className="text-xs text-gray-500">
                          {appointment.technicians.specialties.join(', ')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact</p>
                      <p className="text-sm text-gray-600">
                        {appointment.customer_phone || 'No phone provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amount</p>
                      <p className="text-sm text-gray-600">
                        ${appointment.total_amount || appointment.services?.price || 0}
                      </p>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Notes</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-2">
                    {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                      <>
                        <RescheduleAppointment
                          appointmentId={appointment.id}
                          currentDate={appointment.appointment_date}
                          currentTime={appointment.appointment_time}
                          currentTechnician={appointment.technicians?.name || ''}
                          serviceName={appointment.services?.name || ''}
                          onRescheduleSuccess={fetchAppointments}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
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
