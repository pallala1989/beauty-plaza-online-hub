
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ReferralSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralEmail, setReferralEmail] = useState("");
  
  const referralLink = `${window.location.origin}/register?ref=${user?.id}`;

  const copyReferralLink = async () => {
    try {
      // Use the Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
        toast({
          title: "Link Copied!",
          description: "Referral link has been copied to your clipboard.",
        });
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = referralLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
          toast({
            title: "Link Copied!",
            description: "Referral link has been copied to your clipboard.",
          });
        } catch (err) {
          textArea.remove();
          toast({
            title: "Copy Failed",
            description: "Unable to copy link. Please copy it manually.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy it manually.",
        variant: "destructive",
      });
    }
  };

  const sendReferral = () => {
    if (!referralEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the referral.",
        variant: "destructive",
      });
      return;
    }

    const subject = "Join Beauty Plaza - Special Offer Inside!";
    const body = `Hi there!\n\nI wanted to share Beauty Plaza with you. They offer amazing beauty services and you'll get $10 off your first appointment when you sign up using my referral link:\n\n${referralLink}\n\nCheck them out - you won't be disappointed!\n\nBest regards`;
    
    window.open(`mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    toast({
      title: "Email Opened",
      description: "Your email client has been opened with the referral message.",
    });
    
    setReferralEmail("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-pink-600" />
          Refer Friends
        </CardTitle>
        <CardDescription>
          Share Beauty Plaza with friends and earn $10 credit for each successful referral!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Your Referral Link
          </label>
          <div className="flex space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-gray-50"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              size="sm"
              className="px-3"
              type="button"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Send to a Friend
          </label>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
            />
            <Button
              onClick={sendReferral}
              className="bg-pink-600 hover:bg-pink-700"
              type="button"
            >
              Send
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-pink-50 p-3 rounded-lg">
          <p className="font-semibold text-pink-800 mb-1">How it works:</p>
          <ul className="space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• They get $10 off their first appointment</li>
            <li>• You earn $10 credit when they book</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
