
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Home } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  specialties?: string[];
}

interface TechnicianAndTypeSelectionProps {
  technicians: Technician[];
  selectedTechnician: string;
  serviceType: string;
  onTechnicianSelect: (technicianId: string) => void;
  onServiceTypeChange: (serviceType: string) => void;
}

const TechnicianAndTypeSelection: React.FC<TechnicianAndTypeSelectionProps> = ({
  technicians,
  selectedTechnician,
  serviceType,
  onTechnicianSelect,
  onServiceTypeChange
}) => {
  console.log('TechnicianAndTypeSelection - selectedTechnician:', selectedTechnician);
  console.log('TechnicianAndTypeSelection - serviceType:', serviceType);
  console.log('TechnicianAndTypeSelection - technicians:', technicians);

  const handleTechnicianClick = (techId: string) => {
    console.log('Technician clicked:', techId);
    onTechnicianSelect(techId);
  };

  const handleServiceTypeChange = (value: string) => {
    console.log('Service type changed:', value);
    onServiceTypeChange(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Select your technician:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicians.map((tech) => (
            <Card
              key={tech.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTechnician === tech.id
                  ? "ring-2 ring-pink-500 bg-pink-50 border-pink-200"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              onClick={() => handleTechnicianClick(tech.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedTechnician === tech.id 
                      ? "bg-pink-500 border-pink-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedTechnician === tech.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                    <p className="text-sm text-gray-500">
                      {tech.specialties?.join(", ") || "Beauty Specialist"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold mb-4 block">Service type:</Label>
        <RadioGroup value={serviceType} onValueChange={handleServiceTypeChange} className="space-y-3">
          <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
            serviceType === "in-store" 
              ? "ring-2 ring-pink-500 bg-pink-50 border-pink-200" 
              : "border-gray-200 hover:border-pink-300"
          }`}>
            <RadioGroupItem value="in-store" id="in-store" />
            <Label htmlFor="in-store" className="flex items-center cursor-pointer flex-1">
              <MapPin className="w-5 h-5 mr-3 text-pink-600" />
              <div>
                <div className="font-semibold text-gray-900">In-Store Service</div>
                <div className="text-sm text-gray-500">Visit our beautiful salon</div>
              </div>
            </Label>
          </div>
          <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
            serviceType === "in-home" 
              ? "ring-2 ring-pink-500 bg-pink-50 border-pink-200" 
              : "border-gray-200 hover:border-pink-300"
          }`}>
            <RadioGroupItem value="in-home" id="in-home" />
            <Label htmlFor="in-home" className="flex items-center cursor-pointer flex-1">
              <Home className="w-5 h-5 mr-3 text-pink-600" />
              <div>
                <div className="font-semibold text-gray-900">In-Home Service</div>
                <div className="text-sm text-gray-500">We come to you (+$25)</div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default TechnicianAndTypeSelection;
