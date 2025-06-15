
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  is_available: boolean;
}

interface TechnicianSelectionProps {
  technicians: Technician[];
  selectedTechnicianId: string;
  onTechnicianSelect: (technicianId: string) => void;
}

const TechnicianSelection: React.FC<TechnicianSelectionProps> = ({
  technicians,
  selectedTechnicianId,
  onTechnicianSelect
}) => {
  return (
    <div>
      <Label className="text-base font-semibold">Select Technician:</Label>
      <div className="grid grid-cols-1 gap-2 mt-2">
        {technicians.map((technician) => (
          <Button
            key={technician.id}
            variant={selectedTechnicianId === technician.id ? "default" : "outline"}
            className={`justify-start ${
              selectedTechnicianId === technician.id
                ? "bg-green-500 text-white hover:bg-green-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => onTechnicianSelect(technician.id)}
          >
            <User className="w-4 h-4 mr-2" />
            {technician.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TechnicianSelection;
