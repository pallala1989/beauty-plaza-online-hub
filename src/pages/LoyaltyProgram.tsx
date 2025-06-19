import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown, Star, Gift, Award, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { useSettings } from "@/hooks/useSettings";

const LoyaltyProgram = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { points: userPoints, deductPoints } = useLoyaltyPoints();
  const { settings } = useSettings();
  
  // Check if loyalty is enabled in admin settings
  const isLoyaltyEnabled = settings?.loyalty_enabled !== false;
  
  // Get loyalty settings with defaults
  const loyaltyTiers = settings?.loyalty_tiers || { 
    bronze: 0, 
    silver: 500, 
    gold: 1000, 
    platinum: 2000 
  };
  
  const pointsToNextTier = Math.max(0, 1000 - userPoints);
  const currentTier = userPoints >= 2000 ? "Platinum" : userPoints >= 1000 ? "Gold" : userPoints >= 500 ? "Silver" : "Bronze";
  
  // If loyalty is disabled, show message
  if (!isLoyaltyEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Loyalty Program
            </h1>
            <p className="text-lg text-gray-600">
              The loyalty program is currently unavailable.
            </p>
            <Link to="/">
              <Button className="mt-6">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tiers = [
    {
      name: "Bronze",
      minPoints: 0,
      benefits: ["5% off services", "Birthday discount", "Member exclusive offers"],
      icon: Award,
      color: "from-orange-400 to-orange-600"
    },
    {
      name: "Silver",
      minPoints: 500,
      benefits: ["10% off services", "Priority booking", "Free add-on service monthly"],
      icon: Star,
      color: "from-gray-400 to-gray-600"
    },
    {
      name: "Gold",
      minPoints: 1000,
      benefits: ["15% off services", "VIP treatment", "Free service every 5 visits"],
      icon: Crown,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      name: "Platinum",
      minPoints: 2000,
      benefits: ["20% off services", "Personal beauty consultant", "Exclusive events access"],
      icon: Sparkles,
      color: "from-purple-400 to-purple-600"
    }
  ];

  const recentEarnings = [
    { date: "2024-01-15", service: "Classic Facial", points: 75 },
    { date: "2024-01-02", service: "Hair Color", points: 85 },
    { date: "2023-12-20", service: "Bridal Makeup", points: 150 },
    { date: "2023-12-05", service: "Eyebrow Waxing", points: 25 },
  ];

  const redeemOptions = [
    { points: 200, reward: "$10 off next service", available: userPoints >= 200 },
    { points: 400, reward: "$20 off next service", available: userPoints >= 400 },
    { points: 600, reward: "Free eyebrow waxing", available: userPoints >= 600 },
    { points: 800, reward: "Free classic facial", available: userPoints >= 800 },
    { points: 1000, reward: "$50 off any service", available: userPoints >= 1000 },
  ];

  const currentTierIndex = tiers.findIndex(tier => tier.name === currentTier);
  const nextTier = tiers[currentTierIndex + 1];
  const progressPercentage = nextTier ? ((userPoints - tiers[currentTierIndex].minPoints) / (nextTier.minPoints - tiers[currentTierIndex].minPoints)) * 100 : 100;

  const handleRedeem = (option: { points: number; reward: string; available: boolean }) => {
    if (!option.available) {
      toast({
        title: "Insufficient Points",
        description: `You need ${option.points} points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to redeem rewards.",
        variant: "destructive",
      });
      return;
    }

    // Deduct points using shared hook
    deductPoints(option.points);

    toast({
      title: "Reward Redeemed!",
      description: `You've successfully redeemed: ${option.reward}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Loyalty Program
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn points with every visit and unlock exclusive benefits. The more you visit, the more you save!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Points & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Crown className="w-8 h-8 mr-3" />
                  Your Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">{userPoints}</div>
                      <div className="text-lg opacity-90">Total Points</div>
                    </div>
                    <Badge className="bg-white text-pink-600 text-lg px-4 py-2">
                      {currentTier} Member
                    </Badge>
                  </div>
                  
                  {nextTier && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm opacity-90">
                        <span>Progress to {nextTier.name}</span>
                        <span>{pointsToNextTier} points to go</span>
                      </div>
                      <Progress value={progressPercentage} className="bg-white/20" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Membership Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Tiers</CardTitle>
                <CardDescription>Unlock more benefits as you earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.map((tier, index) => {
                    const Icon = tier.icon;
                    const isCurrentTier = tier.name === currentTier;
                    const isUnlocked = userPoints >= tier.minPoints;
                    
                    return (
                      <div
                        key={tier.name}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCurrentTier
                            ? "border-pink-500 bg-pink-50"
                            : isUnlocked
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{tier.name}</h3>
                                {isCurrentTier && (
                                  <Badge className="bg-pink-500">Current</Badge>
                                )}
                                {isUnlocked && !isCurrentTier && (
                                  <Badge variant="outline" className="border-green-500 text-green-600">
                                    Unlocked
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{tier.minPoints}+ points</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <ul className="text-sm space-y-1">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center">
                                <Star className="w-3 h-3 mr-2 text-pink-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                    <Gift className="w-8 h-8 text-pink-600" />
                    <div>
                      <div className="font-semibold">Book Services</div>
                      <div className="text-sm text-gray-600">Earn 1 point per $1 spent</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Heart className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-semibold">Birthday Bonus</div>
                      <div className="text-sm text-gray-600">Get 100 bonus points</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                    <Star className="w-8 h-8 text-pink-600" />
                    <div>
                      <div className="font-semibold">Refer Friends</div>
                      <div className="text-sm text-gray-600">Earn 200 points per referral</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Crown className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-semibold">Special Events</div>
                      <div className="text-sm text-gray-600">Bonus points during promotions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Redeem & History */}
          <div className="space-y-6">
            {/* Redeem Points */}
            <Card>
              <CardHeader>
                <CardTitle>Redeem Points</CardTitle>
                <CardDescription>Turn your points into rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {redeemOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        option.available
                          ? "border-pink-200 bg-pink-50"
                          : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-sm">{option.reward}</div>
                          <div className="text-xs text-gray-600">{option.points} points</div>
                        </div>
                        <Button
                          size="sm"
                          disabled={!option.available}
                          onClick={() => handleRedeem(option)}
                          className={
                            option.available
                              ? "bg-pink-500 hover:bg-pink-600"
                              : "bg-gray-300"
                          }
                        >
                          {option.available ? "Redeem" : "Need More"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Earnings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Earnings</CardTitle>
                <CardDescription>Your latest point activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEarnings.map((earning, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-sm">{earning.service}</div>
                        <div className="text-xs text-gray-600">{earning.date}</div>
                      </div>
                      <div className="text-pink-600 font-semibold">+{earning.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Start Earning Today!</h3>
                <p className="text-sm opacity-90 mb-4">
                  Book your next appointment and watch your points grow
                </p>
                <Link to="/book-online">
                  <Button className="bg-white text-pink-600 hover:bg-gray-100">
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
