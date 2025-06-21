import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/hooks/useAppointments";
import { useServices } from "@/hooks/useServices";
import AppointmentsManagement from "@/components/admin/AppointmentsManagement";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserPlus
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { appointments, isLoading: appointmentsLoading } = useAppointments();
  const { services: servicesFromHook, isLoading: servicesLoading } = useServices();
  
  // Calculate real stats from data
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
    growthRate: 0
  });

  useEffect(() => {
    if (appointments.length > 0) {
      const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.total_amount || 0), 0);
      const uniqueCustomers = new Set(appointments.map(apt => apt.customer_email)).size;
      
      setStats({
        totalCustomers: uniqueCustomers,
        totalAppointments: appointments.length,
        monthlyRevenue: totalRevenue,
        growthRate: 12.5 // This would be calculated based on historical data
      });
    }
  }, [appointments]);

  // Generate revenue data from appointments
  const revenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 19200 },
    { month: 'Mar', revenue: 21000 },
    { month: 'Apr', revenue: 22300 },
    { month: 'May', revenue: stats.monthlyRevenue || 23480 },
  ];

  const appointmentData = [
    { day: 'Mon', appointments: 25 },
    { day: 'Tue', appointments: 32 },
    { day: 'Wed', appointments: 28 },
    { day: 'Thu', appointments: 35 },
    { day: 'Fri', appointments: 42 },
    { day: 'Sat', appointments: 38 },
    { day: 'Sun', appointments: 18 },
  ];

  const [services, setServices] = useState([
    { id: 1, name: "Classic Facial", price: 75, duration: 60, category: "Facial", description: "Deep cleansing facial treatment" },
    { id: 2, name: "Hair Color", price: 85, duration: 120, category: "Hair", description: "Professional hair coloring service" },
    { id: 3, name: "Bridal Makeup", price: 150, duration: 90, category: "Makeup", description: "Complete bridal makeup package" },
  ]);

  const [technicians, setTechnicians] = useState([
    { id: 1, name: "Sarah Johnson", specialties: ["Facial", "Anti-Aging"], phone: "(302) 555-0123", email: "sarah@beautyplaza.com", isAvailable: true },
    { id: 2, name: "Emma Davis", specialties: ["Hair", "Color"], phone: "(302) 555-0124", email: "emma@beautyplaza.com", isAvailable: true },
    { id: 3, name: "Lisa Chen", specialties: ["Makeup", "Bridal"], phone: "(302) 555-0125", email: "lisa@beautyplaza.com", isAvailable: false },
  ]);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
    category: "",
    description: ""
  });

  const [newTechnician, setNewTechnician] = useState({
    name: "",
    specialties: "",
    phone: "",
    email: "",
    isAvailable: true
  });

  const [editingService, setEditingService] = useState(null);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isTechnicianDialogOpen, setIsTechnicianDialogOpen] = useState(false);

  const [systemSettings, setSystemSettings] = useState({
    businessHours: "9:00 AM - 7:00 PM",
    bookingLeadTime: "24 hours",
    cancellationPolicy: "Cancellations must be made 24 hours in advance.",
    maxAdvanceBooking: "60 days",
    timeSlotInterval: "30 minutes",
    autoConfirmBookings: true,
    emailNotifications: true,
    smsNotifications: false,
    loyaltyPointsEnabled: true,
    referralProgramEnabled: true,
    inHomeFee: "25",
    serviceTax: "8.5",
    lateCancellationFee: "15",
    noShowFee: "25"
  });

  // Get unique customers from appointments
  const customers = Array.from(
    new Map(
      appointments.map(apt => [
        apt.customer_email,
        {
          id: apt.customer_email,
          name: apt.customer_name || 'Customer',
          email: apt.customer_email,
          phone: apt.customer_phone || '',
          visits: appointments.filter(a => a.customer_email === apt.customer_email).length,
          status: 'Active',
          totalSpent: appointments
            .filter(a => a.customer_email === apt.customer_email)
            .reduce((sum, a) => sum + (a.total_amount || 0), 0)
        }
      ])
    ).values()
  );

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const service = {
      id: services.length + 1,
      name: newService.name,
      price: parseInt(newService.price),
      duration: parseInt(newService.duration),
      category: newService.category || "Other",
      description: newService.description
    };

    setServices([...services, service]);
    setNewService({ name: "", price: "", duration: "", category: "", description: "" });
    setIsServiceDialogOpen(false);
    
    toast({
      title: "Service Added!",
      description: "New service has been successfully added.",
    });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      description: service.description
    });
    setIsServiceDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!editingService) return;

    const updatedServices = services.map(service => 
      service.id === editingService.id 
        ? {
            ...service,
            name: newService.name,
            price: parseInt(newService.price),
            duration: parseInt(newService.duration),
            category: newService.category,
            description: newService.description
          }
        : service
    );

    setServices(updatedServices);
    setEditingService(null);
    setNewService({ name: "", price: "", duration: "", category: "", description: "" });
    setIsServiceDialogOpen(false);
    
    toast({
      title: "Service Updated!",
      description: "Service has been successfully updated.",
    });
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service Deleted",
      description: "Service has been removed from the system.",
    });
  };

  const handleAddTechnician = () => {
    if (!newTechnician.name || !newTechnician.email || !newTechnician.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const technician = {
      id: technicians.length + 1,
      name: newTechnician.name,
      specialties: newTechnician.specialties.split(',').map(s => s.trim()),
      phone: newTechnician.phone,
      email: newTechnician.email,
      isAvailable: newTechnician.isAvailable
    };

    setTechnicians([...technicians, technician]);
    setNewTechnician({ name: "", specialties: "", phone: "", email: "", isAvailable: true });
    setIsTechnicianDialogOpen(false);
    
    toast({
      title: "Technician Added!",
      description: "New technician has been successfully added.",
    });
  };

  const handleEditTechnician = (technician) => {
    setEditingTechnician(technician);
    setNewTechnician({
      name: technician.name,
      specialties: technician.specialties.join(', '),
      phone: technician.phone,
      email: technician.email,
      isAvailable: technician.isAvailable
    });
    setIsTechnicianDialogOpen(true);
  };

  const handleUpdateTechnician = () => {
    if (!editingTechnician) return;

    const updatedTechnicians = technicians.map(tech => 
      tech.id === editingTechnician.id 
        ? {
            ...tech,
            name: newTechnician.name,
            specialties: newTechnician.specialties.split(',').map(s => s.trim()),
            phone: newTechnician.phone,
            email: newTechnician.email,
            isAvailable: newTechnician.isAvailable
          }
        : tech
    );

    setTechnicians(updatedTechnicians);
    setEditingTechnician(null);
    setNewTechnician({ name: "", specialties: "", phone: "", email: "", isAvailable: true });
    setIsTechnicianDialogOpen(false);
    
    toast({
      title: "Technician Updated!",
      description: "Technician has been successfully updated.",
    });
  };

  const handleDeleteTechnician = (id) => {
    setTechnicians(technicians.filter(tech => tech.id !== id));
    toast({
      title: "Technician Deleted",
      description: "Technician has been removed from the system.",
    });
  };

  const handleViewAppointmentDetails = (appointment) => {
    toast({
      title: "Appointment Details",
      description: `${appointment.customer} - ${appointment.service} with ${appointment.technician}`,
    });
  };

  const handleViewCustomerDetails = (customer) => {
    toast({
      title: "Customer Details",
      description: `${customer.name} - ${customer.visits} visits, $${customer.totalSpent} total spent`,
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "confirmed":
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your beauty salon operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.growthRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Appointments Management - Now First Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentsManagement userRole={user?.role} userId={user?.id} />
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Services Management</h2>
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-500 hover:bg-pink-600" onClick={() => {
                    setEditingService(null);
                    setNewService({ name: "", price: "", duration: "", category: "", description: "" });
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    <DialogDescription>
                      {editingService ? 'Update the service details below.' : 'Fill in the service details below.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        placeholder="e.g., Deep Cleansing Facial"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="servicePrice">Price ($)</Label>
                        <Input
                          id="servicePrice"
                          type="number"
                          value={newService.price}
                          onChange={(e) => setNewService({...newService, price: e.target.value})}
                          placeholder="75"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceDuration">Duration (min)</Label>
                        <Input
                          id="serviceDuration"
                          type="number"
                          value={newService.duration}
                          onChange={(e) => setNewService({...newService, duration: e.target.value})}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="serviceCategory">Category</Label>
                      <Input
                        id="serviceCategory"
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        placeholder="e.g., Facial, Hair, Makeup"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="serviceDescription">Description</Label>
                      <Textarea
                        id="serviceDescription"
                        value={newService.description}
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                        placeholder="Describe the service..."
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={editingService ? handleUpdateService : handleAddService} 
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      {editingService ? 'Update Service' : 'Add Service'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.category}</p>
                          <p className="text-sm text-gray-600">${service.price} • {service.duration} min</p>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditService(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technicians Management */}
          <TabsContent value="technicians" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Technicians Management</h2>
              <Dialog open={isTechnicianDialogOpen} onOpenChange={setIsTechnicianDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => {
                    setEditingTechnician(null);
                    setNewTechnician({ name: "", specialties: "", phone: "", email: "", isAvailable: true });
                  }}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Technician
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingTechnician ? 'Edit Technician' : 'Add New Technician'}</DialogTitle>
                    <DialogDescription>
                      {editingTechnician ? 'Update the technician details below.' : 'Fill in the technician details below.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="technicianName">Name</Label>
                      <Input
                        id="technicianName"
                        value={newTechnician.name}
                        onChange={(e) => setNewTechnician({...newTechnician, name: e.target.value})}
                        placeholder="e.g., Sarah Johnson"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="technicianEmail">Email</Label>
                      <Input
                        id="technicianEmail"
                        type="email"
                        value={newTechnician.email}
                        onChange={(e) => setNewTechnician({...newTechnician, email: e.target.value})}
                        placeholder="sarah@beautyplaza.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="technicianPhone">Phone</Label>
                      <Input
                        id="technicianPhone"
                        value={newTechnician.phone}
                        onChange={(e) => setNewTechnician({...newTechnician, phone: e.target.value})}
                        placeholder="(302) 555-0123"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="technicianSpecialties">Specialties (comma separated)</Label>
                      <Input
                        id="technicianSpecialties"
                        value={newTechnician.specialties}
                        onChange={(e) => setNewTechnician({...newTechnician, specialties: e.target.value})}
                        placeholder="e.g., Facial, Anti-Aging, Skincare"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="technicianAvailable"
                        checked={newTechnician.isAvailable}
                        onCheckedChange={(checked) => setNewTechnician({...newTechnician, isAvailable: checked})}
                      />
                      <Label htmlFor="technicianAvailable">Available for bookings</Label>
                    </div>
                    
                    <Button 
                      onClick={editingTechnician ? handleUpdateTechnician : handleAddTechnician} 
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      {editingTechnician ? 'Update Technician' : 'Add Technician'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {technicians.map((technician) => (
                    <div key={technician.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{technician.name}</h3>
                          <p className="text-sm text-gray-600">{technician.email}</p>
                          <p className="text-sm text-gray-600">{technician.phone}</p>
                          <p className="text-sm text-gray-500">Specialties: {technician.specialties.join(', ')}</p>
                          <Badge className={technician.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {technician.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditTechnician(technician)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteTechnician(technician.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Management */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                          <p className="text-sm text-gray-600">{customer.visits} visits • ${customer.totalSpent.toFixed(2)} total spent</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewCustomerDetails(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Business Hours</Label>
                      <Input 
                        value={systemSettings.businessHours}
                        onChange={(e) => setSystemSettings({...systemSettings, businessHours: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Booking Lead Time</Label>
                      <Input 
                        value={systemSettings.bookingLeadTime}
                        onChange={(e) => setSystemSettings({...systemSettings, bookingLeadTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Max Advance Booking</Label>
                      <Input 
                        value={systemSettings.maxAdvanceBooking}
                        onChange={(e) => setSystemSettings({...systemSettings, maxAdvanceBooking: e.target.value})}
                        placeholder="60 days"
                      />
                    </div>
                    <div>
                      <Label>Time Slot Interval</Label>
                      <Input 
                        value={systemSettings.timeSlotInterval}
                        onChange={(e) => setSystemSettings({...systemSettings, timeSlotInterval: e.target.value})}
                        placeholder="30 minutes"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pricing & Fees</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>In-Home Service Fee ($)</Label>
                      <Input 
                        type="number"
                        value={systemSettings.inHomeFee}
                        onChange={(e) => setSystemSettings({...systemSettings, inHomeFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Service Tax (%)</Label>
                      <Input 
                        type="number"
                        value={systemSettings.serviceTax}
                        onChange={(e) => setSystemSettings({...systemSettings, serviceTax: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Late Cancellation Fee ($)</Label>
                      <Input 
                        type="number"
                        value={systemSettings.lateCancellationFee}
                        onChange={(e) => setSystemSettings({...systemSettings, lateCancellationFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>No-Show Fee ($)</Label>
                      <Input 
                        type="number"
                        value={systemSettings.noShowFee}
                        onChange={(e) => setSystemSettings({...systemSettings, noShowFee: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoConfirm"
                        checked={systemSettings.autoConfirmBookings}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoConfirmBookings: checked})}
                      />
                      <Label htmlFor="autoConfirm">Auto-confirm bookings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emailNotifications"
                        checked={systemSettings.emailNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                      />
                      <Label htmlFor="emailNotifications">Email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smsNotifications"
                        checked={systemSettings.smsNotifications}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, smsNotifications: checked})}
                      />
                      <Label htmlFor="smsNotifications">SMS notifications</Label>
                    </div>
                  </div>
                </div>

                {/* Program Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Programs</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="loyaltyProgram"
                        checked={systemSettings.loyaltyPointsEnabled}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, loyaltyPointsEnabled: checked})}
                      />
                      <Label htmlFor="loyaltyProgram">Loyalty points program</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="referralProgram"
                        checked={systemSettings.referralProgramEnabled}
                        onCheckedChange={(checked) => setSystemSettings({...systemSettings, referralProgramEnabled: checked})}
                      />
                      <Label htmlFor="referralProgram">Referral program</Label>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Policies</h3>
                  <div>
                    <Label>Cancellation Policy</Label>
                    <Textarea 
                      value={systemSettings.cancellationPolicy}
                      onChange={(e) => setSystemSettings({...systemSettings, cancellationPolicy: e.target.value})}
                      rows={4}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings} className="bg-pink-500 hover:bg-pink-600">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
