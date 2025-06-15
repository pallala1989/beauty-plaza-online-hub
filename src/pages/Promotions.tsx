
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Gift, Star, Sparkles, Calendar, Users } from "lucide-react";

const Promotions = () => {
  const currentPromotions = [
    {
      id: 1,
      title: "New Customer Special",
      description: "Get 10% off all services on your first appointment",
      discount: "10% OFF",
      validUntil: "Ongoing",
      terms: "Valid for first-time customers only. Cannot be combined with other offers.",
      isNew: true,
      category: "New Customer"
    },
    {
      id: 2,
      title: "Bridal Package Deal",
      description: "Complete bridal package including trial, makeup, and hair styling",
      discount: "$50 OFF",
      originalPrice: 250,
      salePrice: 200,
      validUntil: "2024-06-30",
      terms: "Must book at least 2 weeks in advance. Includes one trial session.",
      isPopular: true,
      category: "Special Package"
    },
    {
      id: 3,
      title: "Mother's Day Special",
      description: "Pamper mom with our luxury spa package",
      discount: "20% OFF",
      validUntil: "2024-05-31",
      terms: "Valid for facial and massage combo services.",
      category: "Seasonal"
    },
    {
      id: 4,
      title: "Loyalty Member Bonus",
      description: "Double points on all services during your birthday month",
      discount: "2X POINTS",
      validUntil: "Ongoing",
      terms: "Valid for loyalty program members only. Must provide valid ID.",
      category: "Loyalty"
    },
    {
      id: 5,
      title: "Referral Reward",
      description: "Both you and your friend get $10 when they book their first appointment",
      discount: "$10 EACH",
      validUntil: "Ongoing",
      terms: "Maximum $50 per year. Referred friend must be a new customer.",
      category: "Referral"
    },
    {
      id: 6,
      title: "Summer Skin Prep",
      description: "Get ready for summer with our hydrating facial series",
      discount: "15% OFF",
      validUntil: "2024-07-31",
      terms: "Valid for series of 3 facials booked together.",
      category: "Seasonal"
    }
  ];

  const upcomingPromotions = [
    {
      title: "Back to School Special",
      description: "Student discounts on select services",
      startDate: "2024-08-01",
      category: "Student"
    },
    {
      title: "Holiday Glam Package",
      description: "Special holiday makeup and styling packages",
      startDate: "2024-11-01",
      category: "Holiday"
    },
    {
      title: "Valentine's Day Couples Deal",
      description: "Bring your partner for couples spa treatments",
      startDate: "2024-02-01",
      category: "Couples"
    }
  ];

  const getBadgeColor = (category: string) => {
    switch (category) {
      case "New Customer":
        return "bg-green-100 text-green-800";
      case "Special Package":
        return "bg-purple-100 text-purple-800";
      case "Seasonal":
        return "bg-orange-100 text-orange-800";
      case "Loyalty":
        return "bg-blue-100 text-blue-800";
      case "Referral":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (validUntil: string) => {
    if (validUntil === "Ongoing") return false;
    const expiryDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Special Promotions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and exclusive offers designed to help you save while looking your absolute best.
          </p>
        </div>

        {/* Current Promotions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-pink-600" />
            Current Offers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPromotions.map((promo) => (
              <Card key={promo.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                {promo.isNew && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500">NEW</Badge>
                  </div>
                )}
                {promo.isPopular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500">POPULAR</Badge>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getBadgeColor(promo.category)}>
                      {promo.category}
                    </Badge>
                    {isExpiringSoon(promo.validUntil) && (
                      <Badge variant="destructive" className="animate-pulse">
                        <Clock className="w-3 h-3 mr-1" />
                        Ending Soon
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl">{promo.title}</CardTitle>
                  <CardDescription>{promo.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="relative">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-pink-600 mb-1">
                      {promo.discount}
                    </div>
                    {promo.originalPrice && promo.salePrice && (
                      <div className="text-sm">
                        <span className="line-through text-gray-500">${promo.originalPrice}</span>
                        <span className="ml-2 font-semibold">${promo.salePrice}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Valid until: {promo.validUntil}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
                    {promo.terms}
                  </div>
                  
                  <Link to="/book-online">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Promotions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-600" />
            Coming Soon
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingPromotions.map((promo, index) => (
              <Card key={index} className="border-dashed border-2 border-gray-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getBadgeColor(promo.category)}>
                      {promo.category}
                    </Badge>
                    <Badge variant="outline">
                      Starting {promo.startDate}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{promo.title}</CardTitle>
                  <CardDescription>{promo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Stay tuned for more details about this exciting offer!
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Use Promotions */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-6 h-6 mr-2 text-pink-600" />
              How to Use Your Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Book Online</h3>
                <p className="text-sm text-gray-600">
                  Select your service and mention the promotion code during booking
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Visit Us</h3>
                <p className="text-sm text-gray-600">
                  Show this page or mention the promotion when you arrive for your appointment
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Enjoy Savings</h3>
                <p className="text-sm text-gray-600">
                  Your discount will be applied automatically at checkout
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Never Miss a Deal!</h2>
              <p className="text-lg mb-6 opacity-90">
                Subscribe to our newsletter and be the first to know about exclusive promotions and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                />
                <Button className="bg-white text-pink-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
