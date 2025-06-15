
export const useBookingValidation = () => {
  const isNextDisabled = (
    step: number,
    selectedService: string,
    selectedTechnician: string,
    selectedDate?: Date,
    selectedTime?: string,
    serviceType?: string,
    otp?: string,
    customerInfo?: any,
    technicians?: any[]
  ) => {
    console.log('isNextDisabled check - step:', step);
    console.log('selectedService:', selectedService);
    console.log('selectedTechnician:', selectedTechnician);
    console.log('selectedDate:', selectedDate);
    console.log('selectedTime:', selectedTime);
    console.log('technicians array:', technicians);
    
    switch (step) {
      case 1:
        const disabled1 = !selectedService;
        console.log('Step 1 disabled:', disabled1);
        return disabled1;
      case 2:
        const disabled2 = !selectedTechnician;
        console.log('Step 2 disabled:', disabled2);
        return disabled2;
      case 3:
        const disabled3 = !selectedDate || !selectedTime;
        console.log('Step 3 disabled:', disabled3);
        return disabled3;
      case 4:
        if (serviceType === "in-home") {
          const disabled4 = !otp || otp !== "1234";
          console.log('Step 4 (in-home) disabled:', disabled4);
          return disabled4;
        } else {
          const disabled4 = !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone;
          console.log('Step 4 (in-store) disabled:', disabled4);
          return disabled4;
        }
      case 5:
        const disabled5 = !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone;
        console.log('Step 5 disabled:', disabled5);
        return disabled5;
      default:
        return false;
    }
  };

  return { isNextDisabled };
};
