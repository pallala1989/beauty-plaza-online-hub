
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_type: string;
  notes?: string;
  total_amount?: number;
  services: {
    name: string;
    price: number;
  };
  technicians: {
    name: string;
  };
}

const MyBookings = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services(name, price),
          technicians(name)
        `)
        .eq('customer_id', user?.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div>Loading your bookings...</div>
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
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{appointment.services?.name}</CardTitle>
                      <CardDescription>
                        {format(new Date(appointment.appointment_date), 'MMMM dd, yyyy')} at{' '}
                        {appointment.appointment_time}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Technician</p>
                      <p className="text-sm text-gray-600">{appointment.technicians?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Service Type</p>
                      <p className="text-sm text-gray-600 capitalize">{appointment.service_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amount</p>
                      <p className="text-sm text-gray-600">
                        ${appointment.total_amount || appointment.services?.price}
                      </p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">Notes</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 flex space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
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
