
import React, { useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

interface DateTimeSelectionProps {
  selectedDate?: Date;
  selectedTime: string;
  bookedSlots: string[];
  isFetchingSlots: boolean;
  fullyBookedDays: string[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onMonthChange: (date: Date) => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  bookedSlots,
  isFetchingSlots,
  fullyBookedDays,
  onDateSelect,
  onTimeSelect,
  onMonthChange
}) => {
  console.log('DateTimeSelection rendered with bookedSlots:', bookedSlots);

  // Auto-select first available time slot when date is selected and slots are loaded
  useEffect(() => {
    if (selectedDate && !selectedTime && !isFetchingSlots && bookedSlots.length === 0) {
      // If no booked slots, it means all slots are available, select first one
      console.log('Auto-selecting first time slot: 09:00');
      onTimeSelect('09:00');
    }
  }, [selectedDate, selectedTime, bookedSlots, isFetchingSlots, onTimeSelect]);

  const handleTimeSelect = (time: string) => {
    // Prevent selection of booked slots
    if (bookedSlots.includes(time)) {
      return;
    }
    onTimeSelect(time);
  };

  // Get current date and time for filtering
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  // Available time slots during business hours
  const businessTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Filter time slots based on current time if selected date is today
  const availableTimeSlots = businessTimeSlots.filter(slot => {
    if (selectedDate && format(selectedDate, 'yyyy-MM-dd') === today) {
      return slot > currentTime;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <Label>Select date:</Label>
        <div className="mt-2 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            onMonthChange={onMonthChange}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPastOrSunday = date < today || date.getDay() === 0;
              const isFullyBooked = fullyBookedDays.includes(format(date, 'yyyy-MM-dd'));
              return isPastOrSunday || isFullyBooked;
            }}
            className="rounded-md border"
          />
        </div>
      </div>

      {selectedDate && (
        <div>
          <Label>Select time:</Label>
          {isFetchingSlots ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
              {Array.from({ length: 18 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                {availableTimeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      disabled={isBooked}
                      className={`text-sm ${
                        isSelected
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : isBooked
                          ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 hover:bg-gray-200"
                          : "border-pink-200 text-pink-600 hover:bg-pink-50"
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                      {isBooked && " (Booked)"}
                    </Button>
                  );
                })}
              </div>
              {bookedSlots.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Unavailable times are marked as "Booked" and cannot be selected
                </p>
              )}
              {availableTimeSlots.length === 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  No more time slots available for today. Please select a future date.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
