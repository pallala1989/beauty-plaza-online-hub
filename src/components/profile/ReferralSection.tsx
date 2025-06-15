
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
  const [isCopying, setIsCopying] = useState(false);
  
  const referralLink = `${window.location.origin}/register?ref=${user?.id || 'demo-user'}`;

  const copyReferralLink = async () => {
    setIsCopying(true);
    
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
          const successful = document.execCommand('copy');
          textArea.remove();
          if (successful) {
            toast({
              title: "Link Copied!",
              description: "Referral link has been copied to your clipboard.",
            });
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          textArea.remove();
          // Show fallback message
          toast({
            title: "Copy Link",
            description: `Please copy this link manually: ${referralLink}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to copy text: ', error);
      // Show fallback message
      toast({
        title: "Copy Link",
        description: `Please copy this link manually: ${referralLink}`,
      });
    } finally {
      setIsCopying(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!isValidEmail(referralEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const subject = "Join Beauty Plaza - Special Offer Inside!";
    const body = `Hi there!\n\nI wanted to share Beauty Plaza with you. They offer amazing beauty services and you'll get $10 off your first appointment when you sign up using my referral link:\n\n${referralLink}\n\nCheck them out - you won't be disappointed!\n\nBest regards`;
    
    const mailtoLink = `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
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
              className="bg-gray-50 flex-1"
            />
            <Button
              onClick={copyReferralLink}
              variant="outline"
              size="sm"
              className="px-3 hover:bg-gray-50"
              type="button"
              disabled={isCopying}
            >
              <Copy className="w-4 h-4" />
              {isCopying ? " Copying..." : ""}
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
