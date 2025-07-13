
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppointmentsManagement from '@/components/admin/AppointmentsManagement';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Settings,
  BarChart3,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Mock data for dashboard
  const dashboardStats = {
    totalAppointments: 24,
    todayAppointments: 8,
    totalRevenue: 2450,
    activeCustomers: 156
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your beauty salon operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="staff">Manage Staff</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.todayAppointments}</div>
                  <p className="text-xs text-muted-foreground">4 completed, 4 pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats.totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeCustomers}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New appointment booked</p>
                      <p className="text-xs text-gray-500">Sarah Johnson - Facial Treatment - 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment completed</p>
                      <p className="text-xs text-gray-500">Emma Davis - Hair Color - $85</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Appointment rescheduled</p>
                      <p className="text-xs text-gray-500">Lisa Chen - Makeup Session - Tomorrow 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsManagement userRole="admin" />
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Management</h3>
                  <p className="text-gray-500">
                    Manage your technicians and staff members.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Current Staff:</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <li>• Yashu - All Services</li>
                        <li>• Maneesha - All Services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                  <p className="text-gray-500">
                    Configure your salon settings and preferences.
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Business Hours</h4>
                      <p className="text-sm text-gray-600 mt-1">Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-sm text-gray-600">Sat: 9:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-600">Sun: Closed</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">Contact Information</h4>
                      <p className="text-sm text-gray-600 mt-1">Phone: +1-555-BEAUTY</p>
                      <p className="text-sm text-gray-600">Email: admin-beatyplaza@gmail.com</p>
                    </div>
                  </div>
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
