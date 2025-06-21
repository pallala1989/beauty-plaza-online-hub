
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Heart, Gift } from "lucide-react";
import AppointmentHistory from "@/components/profile/AppointmentHistory";
import LoyaltySection from "@/components/profile/LoyaltySection";
import ReferralSection from "@/components/profile/ReferralSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalInformationForm from "@/components/profile/PersonalInformationForm";
import AccountSettings from "@/components/profile/AccountSettings";

const Profile = () => {
  // Mock user data
  const [userInfo, setUserInfo] = useState({
    firstName: "Sarah",
    lastName: "Johnson", 
    email: "sarah.johnson@email.com",
    phone: "(302) 555-0123",
    address: "123 Main St, Wilmington, DE 19810",
    birthday: "1990-05-15"
  });

  const handleRedeemPoints = (points: number) => {
    console.log(`Redeemed ${points} points`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader />

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
            <PersonalInformationForm 
              userInfo={userInfo}
              onUpdateUserInfo={setUserInfo}
            />
            <AccountSettings />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <AppointmentHistory />
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-6">
            <LoyaltySection onRedeemPoints={handleRedeemPoints} />
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
