
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneVerificationProps {
  phone: string;
  otp: string;
  otpSent: boolean;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phone,
  otp,
  otpSent,
  onPhoneChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Phone Verification Required</h3>
        <p className="text-gray-600 mb-4">
          For in-home services, we need to verify your phone number for security purposes.
        </p>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(903) 921-0271"
            className="flex-1"
          />
          <Button 
            onClick={onSendOtp} 
            disabled={!phone || otpSent}
            variant="outline"
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </Button>
        </div>
      </div>

      {otpSent && (
        <div>
          <Label htmlFor="otp">Enter Verification Code *</Label>
          <div className="flex gap-2">
            <Input
              id="otp"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value)}
              placeholder="Enter 4-digit code"
              maxLength={4}
              className="flex-1"
            />
            <Button 
              onClick={onVerifyOtp}
              disabled={otp.length !== 4}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            >
              Verify
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Demo code: 1234</p>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
