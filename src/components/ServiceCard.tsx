
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Phone } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  image?: string;
}

const ServiceCard = ({ title, description, price, duration, image }: ServiceCardProps) => {
  const handleBookNow = () => {
    window.location.href = "/book-online";
  };

  const handleCallNow = () => {
    window.open("tel:+13024567890", "_self");
  };

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-all duration-300">
      {image && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {price}
            </span>
          </div>
        </div>
      )}
      
      <CardHeader className="flex-1">
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{duration}</span>
          </div>
          {!image && (
            <span className="text-lg font-semibold text-pink-600">{price}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleBookNow}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          >
            Book Online
          </Button>
          
          <Button 
            onClick={handleCallNow}
            variant="outline" 
            className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300"
          >
            <Phone className="w-4 h-4 mr-2 text-pink-600" />
            <span className="text-pink-600 font-medium">(302) 456-7890</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
