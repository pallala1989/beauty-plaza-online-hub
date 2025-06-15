
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Facial", "Hair", "Makeup", "Waxing", "Nails"];

  const services = [
    {
      id: 1,
      name: "Classic Facial",
      category: "Facial",
      description: "Deep cleansing facial with extractions and moisturizing treatment",
      price: 75,
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 2,
      name: "Anti-Aging Facial",
      category: "Facial",
      description: "Rejuvenating treatment with collagen boost and peptide infusion",
      price: 120,
      duration: "75 min",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 3,
      name: "Haircut & Style",
      category: "Hair",
      description: "Professional cut with wash, style, and finishing",
      price: 45,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 4,
      name: "Hair Color",
      category: "Hair",
      description: "Full color service with professional consultation",
      price: 85,
      duration: "120 min",
      image: "https://images.unsplash.com/photo-1560869713-7d0954430927?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 5,
      name: "Bridal Makeup",
      category: "Makeup",
      description: "Complete bridal makeup with trial session included",
      price: 150,
      duration: "90 min",
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 6,
      name: "Special Event Makeup",
      category: "Makeup",
      description: "Professional makeup for parties and special occasions",
      price: 60,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1498950608760-8d97161f8c1c?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 7,
      name: "Eyebrow Waxing",
      category: "Waxing",
      description: "Precise eyebrow shaping and grooming",
      price: 25,
      duration: "20 min",
      image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 8,
      name: "Full Leg Waxing",
      category: "Waxing",
      description: "Complete leg hair removal with soothing after-care",
      price: 65,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1610899922902-99a4b4c5b1b7?w=400&h=300&fit=crop",
      popular: false
    },
    {
      id: 9,
      name: "Manicure",
      category: "Nails",
      description: "Classic manicure with nail shaping and polish",
      price: 35,
      duration: "30 min",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      popular: true
    },
    {
      id: 10,
      name: "Gel Manicure",
      category: "Nails",
      description: "Long-lasting gel polish with UV curing",
      price: 45,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=300&fit=crop",
      popular: false
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredServices.map((service) => (
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
                      {service.duration}
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
