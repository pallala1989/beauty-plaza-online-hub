
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices, Service } from "@/hooks/useServices";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { services, isLoading, error } = useServices();

  const categories = ["All", "Facial", "Hair", "Makeup", "Waxing", "Nails"];

  const filteredServices = selectedCategory === "All" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of premium beauty services, each designed to enhance your natural beauty and leave you feeling confident and radiant.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                : "border-pink-200 text-pink-600 hover:bg-pink-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <span className="ml-2">Loading Services...</span>
          </div>
        ) : error ? (
           <div className="text-center py-8 text-red-600">
             <p>Error loading services: {error}</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredServices.map((service: Service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {service.popular && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600">
                      Popular
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {service.duration} min
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600">${service.price}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to="/book-online" state={{ preSelectedService: service }}>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                      Book This Service
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg mb-6">
            Contact us for custom treatments and personalized beauty consultations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pink-600"
              onClick={() => window.open("tel:+19039210271", "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call (903) 921-0271
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
