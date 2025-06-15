
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail } from "@/components/auth/EmailValidation";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

interface PersonalInformationFormProps {
  userInfo: UserInfo;
  onUpdateUserInfo: (userInfo: UserInfo) => void;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  userInfo,
  onUpdateUserInfo
}) => {
  const { toast } = useToast();
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onUpdateUserInfo({...userInfo, email});
    
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

  return (
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
              onChange={(e) => onUpdateUserInfo({...userInfo, firstName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={userInfo.lastName}
              onChange={(e) => onUpdateUserInfo({...userInfo, lastName: e.target.value})}
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
              onChange={(e) => onUpdateUserInfo({...userInfo, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={userInfo.address}
            onChange={(e) => onUpdateUserInfo({...userInfo, address: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="birthday">Birthday</Label>
          <Input
            id="birthday"
            type="date"
            value={userInfo.birthday}
            onChange={(e) => onUpdateUserInfo({...userInfo, birthday: e.target.value})}
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
  );
};

export default PersonalInformationForm;
