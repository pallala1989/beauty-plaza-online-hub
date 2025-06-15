
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  services, 
  selectedService, 
  onServiceSelect 
}) => {
  return (
    <div className="space-y-4">
      <Label>Choose your service:</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              selectedService === service.id
                ? "ring-2 ring-pink-500 bg-pink-50"
                : "hover:shadow-md"
            }`}
            onClick={() => onServiceSelect(service.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.duration} min</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-pink-600">${service.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
