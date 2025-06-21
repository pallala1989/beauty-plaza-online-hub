
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  MapPin,
  Mail,
  Phone,
  Star,
  Settings
} from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import AppointmentsManagement from "@/components/admin/AppointmentsManagement";
import InvoiceGenerator from "@/components/payment/InvoiceGenerator";

const AdminDashboard = () => {
  const { appointments, isLoading } = useAppointments();
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Calculate real-time statistics from appointments
  const stats = React.useMemo(() => {
    if (!appointments) return { totalRevenue: 0, totalAppointments: 0, pendingAppointments: 0, completedAppointments: 0 };
    
    const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.total_amount || 0), 0);
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    
    return { totalRevenue, totalAppointments, pendingAppointments, completedAppointments };
  }, [appointments]);

  const handlePrintInvoice = (appointment: any) => {
    const invoiceData = {
      id: appointment.id,
      services: [{
        name: appointment.service?.name || 'Service',
        price: appointment.total_amount || 0,
        duration: appointment.service?.duration || 60
      }],
      subtotal: appointment.total_amount || 0,
      tip: 0,
      pointsUsed: 0,
      pointsDiscount: 0,
      total: appointment.total_amount || 0,
      paymentMethod: 'card',
      timestamp: new Date().toISOString()
    };

    setSelectedAppointment({
      ...appointment,
      invoiceData
    });
    setShowInvoice(true);
  };

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showInvoice && selectedAppointment) {
    return (
      <div className="print-invoice">
        <InvoiceGenerator
          invoiceData={selectedAppointment.invoiceData}
          customerInfo={{
            name: 'Customer',
            email: selectedAppointment.customer_email || '',
            phone: selectedAppointment.customer_phone || ''
          }}
          onClose={() => setShowInvoice(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your beauty salon operations</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +8 from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsManagement userRole="admin" />
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest bookings and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center">Loading...</div>
                    ) : (
                      appointments.slice(0, 5).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Customer</span>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {appointment.service?.name} • {appointment.appointment_date} at {appointment.appointment_time}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-pink-600">${appointment.total_amount}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintInvoice(appointment)}
                            >
                              Invoice
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Staff
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Customer Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Business insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
