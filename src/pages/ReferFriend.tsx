
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Users, Gift, DollarSign, Heart } from "lucide-react";

const ReferFriend = () => {
  const [friendEmail, setFriendEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const { toast } = useToast();

  // Mock user data - in real app this would come from authentication
  const userReferralCode = "BEAUTY2024USER123";
  const totalReferrals = 3;
  const totalEarned = 30;
  const availableCredits = 30;
  const yearlyLimit = 50;

  const referralHistory = [
    { name: "Sarah Johnson", date: "2024-01-15", status: "Completed", earned: 10 },
    { name: "Emma Davis", date: "2024-01-02", status: "Completed", earned: 10 },
    { name: "Lisa Chen", date: "2023-12-20", status: "Completed", earned: 10 },
    { name: "Maria Rodriguez", date: "2023-12-05", status: "Pending", earned: 0 },
  ];

  const handleCopyLink = () => {
    const referralLink = `https://beautyplaza.com/register?ref=${userReferralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const handleShareEmail = () => {
    if (!friendEmail || !friendName) {
      toast({
        title: "Missing Information",
        description: "Please enter your friend's name and email.",
        variant: "destructive",
      });
      return;
    }

    // Here you would send an email invitation
    toast({
      title: "Invitation Sent!",
      description: `Referral invitation has been sent to ${friendEmail}`,
    });

    setFriendEmail("");
    setFriendName("");
  };

  const handleSocialShare = (platform: string) => {
    const referralLink = `https://beautyplaza.com/register?ref=${userReferralCode}`;
    const message = `Hey! I found this amazing beauty salon - Beauty Plaza. Use my referral link and we both get $10 off! ${referralLink}`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Refer a Friend
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share the beauty experience with your friends and earn rewards together. Both you and your friend get $10 when they book their first appointment!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-6 h-6 mr-2 text-pink-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Share2 className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                    <p className="text-sm text-gray-600">
                      Send your unique referral link to friends via email, text, or social media
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Friend Books</h3>
                    <p className="text-sm text-gray-600">
                      Your friend signs up and books their first appointment using your link
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Both Earn</h3>
                    <p className="text-sm text-gray-600">
                      You get $10 credit, your friend gets $10 off their first appointment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share this link with your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={`https://beautyplaza.com/register?ref=${userReferralCode}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button onClick={handleCopyLink} className="bg-pink-500 hover:bg-pink-600">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Or share directly on social media:</p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare("facebook")}
                      className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare("twitter")}
                      className="bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100"
                    >
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialShare("whatsapp")}
                      className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Send Personal Invitation */}
            <Card>
              <CardHeader>
                <CardTitle>Send Personal Invitation</CardTitle>
                <CardDescription>Send a personalized referral email to your friend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="friend-name">Friend's Name</Label>
                    <Input
                      id="friend-name"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Enter friend's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="friend-email">Friend's Email</Label>
                    <Input
                      id="friend-email"
                      type="email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      placeholder="Enter friend's email"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleShareEmail}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                >
                  Send Invitation
                </Button>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
                <CardDescription>Track your referrals and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referralHistory.map((referral, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{referral.name}</div>
                        <div className="text-sm text-gray-600">{referral.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          referral.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {referral.status}
                        </div>
                        <div className="text-sm text-gray-600">
                          {referral.earned > 0 ? `+$${referral.earned}` : "Pending"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-6 h-6 mr-2" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalReferrals}</div>
                  <div className="text-sm opacity-90">Friends Referred</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">${totalEarned}</div>
                  <div className="text-sm opacity-90">Total Earned</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">${availableCredits}</div>
                  <div className="text-sm opacity-90">Available Credits</div>
                </div>
              </CardContent>
            </Card>

            {/* Program Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Program Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>Both you and your friend receive $10 when they complete their first appointment</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>Maximum earning of $50 per year per customer</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>Credits expire 1 year from issue date</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>Referred friends must be new customers</div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>Credits can be used toward any service</div>
                </div>
              </CardContent>
            </Card>

            {/* Yearly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Yearly Progress</CardTitle>
                <CardDescription>Your earnings this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Earned</span>
                    <span>${totalEarned} / $50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${(totalEarned / yearlyLimit) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    ${yearlyLimit - totalEarned} remaining this year
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;
