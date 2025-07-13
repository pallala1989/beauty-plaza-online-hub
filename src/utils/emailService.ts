
import { supabase } from '@/integrations/supabase/client';

interface ConfirmationEmailData {
  services: any[];
  technicians: any[];
  selectedService: string;
  selectedServices?: string[];
  selectedTechnician: string;
  selectedDate: Date;
  selectedTime: string;
  serviceType: string;
  customerInfo: any;
  totalAmount: number;
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
}

export const sendConfirmationEmail = async (data: ConfirmationEmailData) => {
  try {
    console.log('Sending confirmation email with data:', data);
    
    // Prepare email data
    const selectedServiceDetails = data.services.filter(s => 
      data.selectedServices?.includes(s.id.toString()) || [data.selectedService].includes(s.id.toString())
    );
    
    const technicianName = data.technicians.find(t => t.id === data.selectedTechnician)?.name || 'Assigned Technician';
    
    const emailData = {
      customerEmail: data.customerInfo.email,
      customerName: data.customerInfo.name,
      adminEmail: 'admin-beatyplaza@gmail.com', // Admin copy email
      services: selectedServiceDetails.map(s => s.name).join(', '),
      technician: technicianName,
      appointmentDate: data.selectedDate.toLocaleDateString(),
      appointmentTime: data.selectedTime,
      serviceType: data.serviceType,
      totalAmount: data.totalAmount,
      loyaltyPointsUsed: data.loyaltyPointsUsed || 0,
      loyaltyDiscount: data.loyaltyDiscount || 0,
      notes: data.customerInfo.notes || '',
      address: data.serviceType === 'in-home' ? data.customerInfo.address : ''
    };

    // Call the email edge function
    const { data: response, error } = await supabase.functions.invoke('send-appointment-confirmation', {
      body: emailData
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }

    console.log('Confirmation email sent successfully:', response);
    return response;
    
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw error to prevent booking failure due to email issues
    return null;
  }
};
