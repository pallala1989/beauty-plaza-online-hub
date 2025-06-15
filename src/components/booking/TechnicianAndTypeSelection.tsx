
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
  return (
    <div className="space-y-6">
      <div>
        <Label>Select your technician:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {technicians.map((tech) => (
            <Card
              key={tech.id}
              className={`cursor-pointer transition-all ${
                selectedTechnician === tech.id
                  ? "ring-2 ring-pink-500 bg-pink-50"
                  : "hover:shadow-md"
              }`}
              onClick={() => onTechnicianSelect(tech.id)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold">{tech.name}</h3>
                <p className="text-sm text-gray-500">
                  {tech.specialties?.join(", ") || "Beauty Specialist"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label>Service type:</Label>
        <RadioGroup value={serviceType} onValueChange={onServiceTypeChange} className="mt-2">
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="in-store" id="in-store" />
            <Label htmlFor="in-store" className="flex items-center cursor-pointer">
              <MapPin className="w-4 h-4 mr-2" />
              In-Store Service
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="in-home" id="in-home" />
            <Label htmlFor="in-home" className="flex items-center cursor-pointer">
              <Home className="w-4 h-4 mr-2" />
              In-Home Service (+$25)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default TechnicianAndTypeSelection;
