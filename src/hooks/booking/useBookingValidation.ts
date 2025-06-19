
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
    console.log('Validation check:', {
      step,
      selectedServices,
      selectedService,
      selectedTechnician,
      selectedDate,
      selectedTime,
      serviceType,
      otp,
      customerInfo
    });

    // Step 1: Service Selection
    if (step === 1) {
      const isDisabled = selectedServices.length === 0;
      console.log('Step 1 validation - selectedServices:', selectedServices, 'disabled:', isDisabled);
      return isDisabled;
    }

    // Step 2: Technician & Service Type
    if (step === 2) {
      const isDisabled = !selectedTechnician || !serviceType || !technicians || technicians.length === 0;
      console.log('Step 2 validation - selectedTechnician:', selectedTechnician, 'serviceType:', serviceType, 'disabled:', isDisabled);
      return isDisabled;
    }

    // Step 3: Date & Time
    if (step === 3) {
      const isDisabled = !selectedDate || !selectedTime;
      console.log('Step 3 validation - selectedDate:', selectedDate, 'selectedTime:', selectedTime, 'disabled:', isDisabled);
      return isDisabled;
    }

    // Step 4: OTP (in-home only) or Customer Info (in-store)
    if (step === 4) {
      if (serviceType === "in-home") {
        // OTP verification step for in-home
        const isDisabled = !customerInfo?.phone;
        console.log('Step 4 (in-home) validation - phone:', customerInfo?.phone, 'disabled:', isDisabled);
        return isDisabled;
      } else {
        // Customer info step for in-store
        const isDisabled = !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone;
        console.log('Step 4 (in-store) validation - customerInfo:', customerInfo, 'disabled:', isDisabled);
        return isDisabled;
      }
    }

    // Step 5: Customer Info (in-home only)
    if (step === 5 && serviceType === "in-home") {
      const isDisabled = !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone;
      console.log('Step 5 validation - customerInfo:', customerInfo, 'disabled:', isDisabled);
      return isDisabled;
    }

    return false;
  };

  return { isNextDisabled };
};
