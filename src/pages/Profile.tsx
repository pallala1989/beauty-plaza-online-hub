
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Heart, Gift, Settings } from "lucide-react";
import AppointmentHistory from "@/components/profile/AppointmentHistory";
import LoyaltySection from "@/components/profile/LoyaltySection";
import ReferralSection from "@/components/profile/ReferralSection";
import { isValidEmail } from "@/components/auth/EmailValidation";

const Profile = () => {
  const { toast } = useToast();
  
  // Mock user data
  const [userInfo, setUserInfo] = useState({
    firstName: "Sarah",
    lastName: "Johnson", 
    email: "sarah.johnson@email.com",
    phone: "(302) 555-0123",
    address: "123 Main St, Wilmington, DE 19810",
    birthday: "1990-05-15"
  });

  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserInfo({...userInfo, email});
    
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleUpdateProfile = () => {
    if (!isValidEmail(userInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profile Updated!",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleRedeemPoints = (points: number) => {
    console.log(`Redeemed ${points} points`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and track your beauty journey</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={handleEmailChange}
                      className={emailError ? "border-red-500" : ""}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={userInfo.birthday}
                    onChange={(e) => setUserInfo({...userInfo, birthday: e.target.value})}
                  />
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={!!emailError}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about appointments and promotions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-pink-600" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">SMS Reminders</h3>
                    <p className="text-sm text-gray-600">Get text reminders for your appointments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-pink-600" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Newsletter</h3>
                    <p className="text-sm text-gray-600">Stay updated with beauty tips and special offers</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentHistory />
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <LoyaltySection points={850} onRedeemPoints={handleRedeemPoints} />
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <ReferralSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
