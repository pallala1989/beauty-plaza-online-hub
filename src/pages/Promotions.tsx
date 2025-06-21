
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Gift, Star, Calendar, Mail } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [emailForSubscription, setEmailForSubscription] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
  const { settings } = useSettings();

  // Check if promotions are enabled
  const isPromotionsEnabled = settings?.navigation_settings?.show_promotions !== false;

  // Mock promotions data - in real app, this would come from your backend
  const promotions = [
    {
      id: 1,
      title: "New Client Special",
      description: "20% off your first visit",
      discount: 20,
      type: "percentage",
      validUntil: "2024-12-31",
      serviceTypes: ["facial", "massage", "haircut"],
      code: "NEWCLIENT20"
    },
    {
      id: 2,
      title: "Facial Package Deal",
      description: "Buy 3 facials, get 1 free",
      discount: 25,
      type: "package",
      validUntil: "2024-11-30",
      serviceTypes: ["facial"],
      code: "FACIAL3FOR2"
    },
    {
      id: 3,
      title: "Manicure Monday",
      description: "$10 off all manicure services on Mondays",
      discount: 10,
      type: "amount",
      validUntil: "2024-12-31",
      serviceTypes: ["manicure", "pedicure"],
      code: "MANIMONDAY"
    },
    {
      id: 4,
      title: "Hair Care Bundle",
      description: "15% off haircut + styling combo",
      discount: 15,
      type: "percentage",
      validUntil: "2024-10-31",
      serviceTypes: ["haircut", "styling"],
      code: "HAIRCOMBO15"
    },
    {
      id: 5,
      title: "Spa Day Special",
      description: "30% off when you book 3+ services",
      discount: 30,
      type: "percentage",
      validUntil: "2024-12-15",
      serviceTypes: ["facial", "massage", "manicure", "pedicure"],
      code: "SPADAY30"
    }
  ];

  const filteredPromotions = promotions.filter(promotion =>
    promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.serviceTypes.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubscribeToDeals = async () => {
    if (!emailForSubscription) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailForSubscription)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call to subscribe user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically save the subscription to your backend
      console.log('Subscribing email:', emailForSubscription);
      
      toast({
        title: "Subscription Successful!",
        description: "You'll now receive notifications about our latest deals and promotions.",
      });
      
      setEmailForSubscription("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing you to our newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isPromotionsEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Promotions Currently Unavailable</h1>
            <p className="text-gray-600">Our promotions section is temporarily disabled. Please check back later!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Current Promotions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and save on your favorite beauty services
          </p>
        </div>

        {/* Search and Subscribe Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-pink-600" />
                Find Promotions
              </CardTitle>
              <CardDescription>
                Search for deals on specific services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by service type (e.g., facial, manicure, haircut)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Never Miss a Deal
              </CardTitle>
              <CardDescription>
                Subscribe to get notified about new promotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailForSubscription}
                  onChange={(e) => setEmailForSubscription(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubscribeToDeals}
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? 's' : ''} 
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-gray-800">{promotion.title}</CardTitle>
                  <Badge className="bg-pink-500 text-white">
                    {promotion.type === 'percentage' ? `${promotion.discount}% OFF` : `$${promotion.discount} OFF`}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {promotion.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Valid until {new Date(promotion.validUntil).toLocaleDateString()}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Applicable Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {promotion.serviceTypes.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Promo Code:</p>
                  <p className="font-mono font-bold text-lg text-pink-600">{promotion.code}</p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => {
                    navigator.clipboard.writeText(promotion.code);
                    toast({
                      title: "Code Copied!",
                      description: `Promo code ${promotion.code} copied to clipboard.`,
                    });
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Copy Code & Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPromotions.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No promotions found for "{searchTerm}"</p>
            <p className="text-gray-400 mt-2">Try searching for different services like "facial", "manicure", or "haircut"</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-pink-100 mb-6">
            Don't wait! These amazing deals won't last forever.
          </p>
          <Button 
            className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-3"
            onClick={() => window.location.href = '/book-online'}
          >
            Book Your Appointment Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
