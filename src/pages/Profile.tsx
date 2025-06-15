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

  const loyaltyInfo = {
    points: 850,
    tier: "Silver",
    nextTier: "Gold",
    pointsToNext: 150
  };

  const referrals = [
    { name: "Emma Wilson", date: "2024-01-15", status: "Completed", earned: 10 },
    { name: "Lisa Davis", date: "2024-01-02", status: "Completed", earned: 10 },
    { name: "Maria Garcia", date: "2023-12-20", status: "Pending", earned: 0 }
  ];

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been successfully updated.",
    });
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
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
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
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
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
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle>Loyalty Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{loyaltyInfo.points}</div>
                    <div className="text-sm opacity-90">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{loyaltyInfo.tier}</div>
                    <div className="text-sm opacity-90">Current Tier</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{loyaltyInfo.pointsToNext}</div>
                    <div className="text-sm opacity-90">To {loyaltyInfo.nextTier}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem your points for exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <div>
                      <div className="font-semibold">$10 off next service</div>
                      <div className="text-sm text-gray-600">200 points</div>
                    </div>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">Redeem</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Free eyebrow waxing</div>
                      <div className="text-sm text-gray-600">600 points</div>
                    </div>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">Redeem</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Free classic facial</div>
                      <div className="text-sm text-gray-600">800 points</div>
                    </div>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">Redeem</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share with friends and earn $10 for each successful referral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    value="https://beautyplaza.com/register?ref=SARAH123"
                    readOnly
                    className="flex-1"
                  />
                  <Button className="bg-pink-500 hover:bg-pink-600">Copy</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
                <CardDescription>Track your referrals and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.map((referral, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{referral.name}</div>
                        <div className="text-sm text-gray-600">{referral.date}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={referral.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {referral.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {referral.earned > 0 ? `+$${referral.earned}` : "Pending"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
