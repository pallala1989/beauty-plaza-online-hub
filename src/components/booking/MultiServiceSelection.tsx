
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MultiServiceSelectionProps {
  services: any[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
  onRemoveService: (serviceId: string) => void;
}

const MultiServiceSelection: React.FC<MultiServiceSelectionProps> = ({
  services,
  selectedServices,
  onServiceToggle,
  onRemoveService
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  };

  const selectedServiceDetails = services.filter(service => 
    selectedServices.includes(service.id.toString())
  );

  const totalPrice = selectedServiceDetails.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Choose your services (max 5):</Label>
        <p className="text-sm text-gray-600 mt-1">Select one or more services for your appointment</p>
      </div>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="bg-pink-50 border-pink-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-pink-800 mb-3">Selected Services ({selectedServices.length}/5)</h3>
            <div className="space-y-2">
              {selectedServiceDetails.map((service) => (
                <div key={service.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-600 ml-2">${service.price} • {service.duration} min</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveService(service.id.toString())}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-pink-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-pink-600">${totalPrice} • {totalDuration} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id.toString());
          const isDisabled = !isSelected && selectedServices.length >= 5;
          
          return (
            <div key={service.id} className="relative">
              <Card className={`h-full border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-pink-500 bg-pink-50' 
                  : isDisabled 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-200 hover:border-pink-300'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={isSelected}
                      onCheckedChange={() => !isDisabled && onServiceToggle(service.id.toString())}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    {isSelected && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  
                  <div 
                    className="cursor-pointer"
                    onClick={() => !isDisabled && onServiceToggle(service.id.toString())}
                  >
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
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {selectedServices.length >= 5 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          You've reached the maximum of 5 services per booking. Remove a service to select a different one.
        </p>
      )}
    </div>
  );
};

export default MultiServiceSelection;
