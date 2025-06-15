
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Mock data
  const stats = {
    totalCustomers: 1247,
    totalAppointments: 3654,
    monthlyRevenue: 23480,
    growthRate: 12.5
  };

  const revenueData = [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 19200 },
    { month: 'Mar', revenue: 21000 },
    { month: 'Apr', revenue: 22300 },
    { month: 'May', revenue: 23480 },
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
    { id: 1, name: "Classic Facial", price: 75, duration: 60, category: "Facial" },
    { id: 2, name: "Hair Color", price: 85, duration: 120, category: "Hair" },
    { id: 3, name: "Bridal Makeup", price: 150, duration: 90, category: "Makeup" },
  ]);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
    category: "",
    description: ""
  });

  const customers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "(302) 555-0123", visits: 8, status: "Active" },
    { id: 2, name: "Emma Davis", email: "emma@email.com", phone: "(302) 555-0124", visits: 3, status: "Active" },
    { id: 3, name: "Lisa Chen", email: "lisa@email.com", phone: "(302) 555-0125", visits: 12, status: "VIP" },
  ];

  const appointments = [
    { id: 1, customer: "Sarah Johnson", service: "Classic Facial", date: "2024-02-15", time: "2:00 PM", status: "Confirmed" },
    { id: 2, customer: "Emma Davis", service: "Hair Color", date: "2024-02-15", time: "3:00 PM", status: "Pending" },
    { id: 3, customer: "Lisa Chen", service: "Bridal Makeup", date: "2024-02-16", time: "10:00 AM", status: "Confirmed" },
  ];

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
      category: newService.category || "Other"
    };

    setServices([...services, service]);
    setNewService({ name: "", price: "", duration: "", category: "", description: "" });
    
    toast({
      title: "Service Added!",
      description: "New service has been successfully added.",
    });
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service Deleted",
      description: "Service has been removed from the system.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
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
                  <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
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
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <Button onClick={handleAddService} className="w-full bg-pink-500 hover:bg-pink-600">
                    Add Service
                  </Button>
                </CardContent>
              </Card>

              {/* Services List */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Services</CardTitle>
                  <CardDescription>Manage your existing services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div key={service.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.category}</p>
                            <p className="text-sm text-gray-600">${service.price} • {service.duration} min</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
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
            </div>
          </TabsContent>

          {/* Appointments Management */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Manage upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{appointment.customer}</h3>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                          <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Button size="sm" variant="outline">
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
                          <p className="text-sm text-gray-600">{customer.visits} visits</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                          <Button size="sm" variant="outline">
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Hours</Label>
                    <Input placeholder="9:00 AM - 7:00 PM" />
                  </div>
                  <div>
                    <Label>Booking Lead Time</Label>
                    <Input placeholder="24 hours" />
                  </div>
                </div>
                
                <div>
                  <Label>Cancellation Policy</Label>
                  <Textarea placeholder="Describe your cancellation policy..." rows={3} />
                </div>
                
                <Button className="bg-pink-500 hover:bg-pink-600">
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
