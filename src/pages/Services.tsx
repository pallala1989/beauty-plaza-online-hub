
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Star } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { services, isLoading } = useServices();
  const navigate = useNavigate();

  const handleBookService = (service: any) => {
    console.log('Booking service:', service);
    navigate("/book-online", { 
      state: { 
        preSelectedService: {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          description: service.description,
          image_url: service.image_url
        }
      } 
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium beauty services designed to make you look and feel your best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src={service.image_url || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    <Star className="w-3 h-3 mr-1" />
                    4.9
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-pink-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-bold text-lg">${service.price}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{service.duration} min</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleBookService(service)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  Book This Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
