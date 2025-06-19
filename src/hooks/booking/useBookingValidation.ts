
export const useBookingValidation = () => {
  const isNextDisabled = (
    step: number,
    selectedServices: string[],
    selectedService: string,
    selectedTechnician: string,
    selectedDate?: Date,
    selectedTime?: string,
    serviceType?: string,
    otp?: string,
    customerInfo?: any,
    technicians?: any[]
  ) => {
    console.log('Validating step:', step, {
      selectedServices,
      selectedService,
      selectedTechnician,
      selectedDate,
      selectedTime,
      serviceType,
      otp,
      customerInfo,
      technicians
    });

    switch (step) {
      case 1:
        return selectedServices.length === 0;
      
      case 2:
        return !selectedTechnician || (technicians && technicians.length === 0);
      
      case 3:
        return !selectedDate || !selectedTime;
      
      case 4:
        if (serviceType === "in-home") {
          return !customerInfo?.phone || !otp || otp !== "1234";
        }
        // For in-store, this is the final step
        return !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone;
      
      case 5:
        // This is only for in-home service
        return !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || !customerInfo?.address;
      
      default:
        return false;
    }
  };

  return { isNextDisabled };
};
