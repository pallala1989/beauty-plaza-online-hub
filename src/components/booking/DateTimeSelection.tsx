
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DateTimeSelectionProps {
  selectedDate?: Date;
  selectedTime: string;
  bookedSlots: string[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  bookedSlots,
  onDateSelect,
  onTimeSelect
}) => {
  console.log('DateTimeSelection rendered with bookedSlots:', bookedSlots);

  return (
    <div className="space-y-6">
      <div>
        <Label>Select date:</Label>
        <div className="mt-2 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date.getDay() === 0; // Disable past dates and Sundays
            }}
            className="rounded-md border"
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <Label>Select time:</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
            {timeSlots.map((time) => {
              const isBooked = bookedSlots.includes(time);
              const isSelected = selectedTime === time;
              
              console.log(`Time slot ${time}:`, { isBooked, isSelected, bookedSlots });
              
              return (
                <Button
                  key={time}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isBooked}
                  className={`text-sm ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : isBooked
                      ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                      : "border-pink-200 text-pink-600 hover:bg-pink-50"
                  }`}
                  onClick={() => !isBooked && onTimeSelect(time)}
                >
                  {time}
                  {isBooked && " (Booked)"}
                </Button>
              );
            })}
          </div>
          {bookedSlots.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Unavailable times are marked as "Booked"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
