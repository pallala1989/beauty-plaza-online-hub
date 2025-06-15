
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AccountSettings = () => {
  return (
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
  );
};

export default AccountSettings;
