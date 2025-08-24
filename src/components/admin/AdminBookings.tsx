
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, Phone, Mail, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_amount: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  services?: {
    name: string;
    price: number;
  } | null;
  technicians?: {
    name: string;
  } | null;
}

const AdminBookings = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAllAppointments = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching all appointments for admin...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          services (
            name,
            price
          ),
          technicians (
            name
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        return;
      }

      // Transform data to match expected format with proper null checks
      const transformedData = (data || []).map(appointment => ({
        ...appointment,
        services: appointment.services ? {
          name: appointment.services.name || 'Unknown Service',
          price: appointment.services.price || 0
        } : null,
        technicians: appointment.technicians ? {
          name: appointment.technicians.name || 'Unknown Technician'
        } : null
      }));

      console.log('Appointments loaded:', transformedData);
      setAppointments(transformedData);
    } catch (error: any) {
      console.error('Error in fetchAllAppointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter by search term with proper null checks
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customer_phone?.includes(searchTerm) ||
        apt.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.technicians?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment status:', error);
        toast.error('Failed to update appointment status');
        return;
      }

      toast.success('Appointment status updated successfully');
      fetchAllAppointments(); // Refresh the data
    } catch (error: any) {
      console.error('Error in updateAppointmentStatus:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
        return;
      }

      toast.success('Appointment deleted successfully');
      fetchAllAppointments(); // Refresh the data
    } catch (error: any) {
      console.error('Error in deleteAppointment:', error);
      toast.error('Failed to delete appointment');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by customer, service, or technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {appointments.length === 0 ? 'No appointments found' : 'No appointments match your filters'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {appointment.services?.name || 'Unknown Service'}
                    </CardTitle>
                    <CardDescription>
                      {appointment.technicians?.name || 'Unknown Technician'}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusBadgeColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.customer_name || 'Unknown Customer'}</span>
                    </div>
                    {appointment.customer_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.customer_email}</span>
                      </div>
                    )}
                    {appointment.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.customer_phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.appointment_date} at {appointment.appointment_time}</span>
                    </div>
                    {appointment.total_amount && (
                      <div className="text-sm font-medium">
                        Total: ${appointment.total_amount}
                      </div>
                    )}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Select value={appointment.status} onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAppointment(appointment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
