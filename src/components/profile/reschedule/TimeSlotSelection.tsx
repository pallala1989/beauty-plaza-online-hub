
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TimeSlotSelectionProps {
  timeSlots: string[];
  bookedSlots: string[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  timeSlots,
  bookedSlots,
  selectedTime,
  onTimeSelect
}) => {
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div>
      <Label className="text-base font-semibold">Select New Time:</Label>
      <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
        {timeSlots.map((time) => {
          const isBooked = bookedSlots.includes(time);
          const isSelected = selectedTime === time;
          
          return (
            <Button
              key={time}
              variant={isSelected ? "default" : "outline"}
              disabled={isBooked}
              className={`text-sm ${
                isSelected
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : isBooked
                  ? "bg-red-100 text-red-500 border-red-200 cursor-not-allowed opacity-50"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
              }`}
              onClick={() => !isBooked && onTimeSelect(time)}
            >
              {formatTime(time)}
              {isBooked && " (Unavailable)"}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelection;
