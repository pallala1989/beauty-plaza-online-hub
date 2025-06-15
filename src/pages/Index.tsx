
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Star, Heart, Users, Award } from "lucide-react";

const Index = () => {
  const services = [
    {
      name: "Facial Treatments",
      description: "Rejuvenating facials for glowing skin",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      price: "Starting at $75"
    },
    {
      name: "Hair Styling",
      description: "Professional cuts and styling",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop",
      price: "Starting at $45"
    },
    {
      name: "Makeup Services",
      description: "Special occasion makeup",
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop",
      price: "Starting at $60"
    },
    {
      name: "Waxing",
      description: "Professional hair removal",
      image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=300&fit=crop",
      price: "Starting at $25"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Beauty Plaza
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in">
            Where Beauty Meets Excellence
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Experience luxury beauty services in our modern, welcoming environment. 
            From stunning makeovers to rejuvenating treatments, your beauty transformation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/book-online">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all">
                Book Appointment
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-pink-500 text-pink-600 hover:bg-pink-50"
              onClick={() => window.open("tel:+13024567890", "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Premium Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of beauty services designed to enhance your natural beauty
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {services.map((service, index) => (
              <Card key={index} className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <p className="text-pink-600 font-semibold">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-pink-500 text-pink-600 hover:bg-pink-50">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Beauty Plaza?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest products and techniques for exceptional results</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Loyalty Rewards</h3>
              <p className="text-gray-600">Earn points with every visit and redeem for future services</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Team</h3>
              <p className="text-gray-600">Highly trained professionals dedicated to your beauty journey</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Experience</h3>
              <p className="text-gray-600">Luxurious environment designed for your comfort and relaxation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              New Customer Special!
            </h2>
            <p className="text-xl mb-6">
              Get 10% off all services on your first appointment
            </p>
            <Link to="/book-online">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Book Your First Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Book your appointment today and experience the Beauty Plaza difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-online">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                Book Online Now
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-pink-500 text-pink-400 hover:bg-pink-950"
              onClick={() => window.open("tel:+13024567890", "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call (302) 456-7890
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
