
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface DateSelectionProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  selectedDate,
  onDateSelect
}) => {
  return (
    <div>
      <Label className="text-base font-semibold">Select New Date:</Label>
      <div className="mt-2 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || date.getDay() === 0;
          }}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};

export default DateSelection;
