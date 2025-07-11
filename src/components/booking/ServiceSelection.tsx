
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceSelectionProps {
  services: any[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  };

  const handleServiceSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
    onServiceSelect(serviceId);
  };

  return (
    <div className="space-y-4">
      <Label>Choose your service:</Label>
      <RadioGroup value={selectedService} onValueChange={handleServiceSelect}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="relative">
              <RadioGroupItem
                value={service.id.toString()}
                id={service.id.toString()}
                className="peer sr-only"
              />
              <Label
                htmlFor={service.id.toString()}
                className="cursor-pointer block"
              >
                <Card className="h-full border-2 border-gray-200 hover:border-pink-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={service.image_url || service.imageUrl || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-pink-600">${service.price}</span>
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ServiceSelection;
