
import emailjs from '@emailjs/browser';
import { format } from "date-fns";

interface EmailData {
  services: any[];
  technicians: any[];
  selectedService: string;
  selectedTechnician: string;
  selectedDate: Date;
  selectedTime: string;
  serviceType: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  totalAmount: number;
  loyaltyPointsUsed?: number;
  loyaltyDiscount?: number;
}

export const sendConfirmationEmail = async (emailData: EmailData) => {
  try {
    // Initialize EmailJS
    emailjs.init('UmpeYlneD0XdC7d7D');

    const selectedServiceDetails = emailData.services.find(s => s.id === emailData.selectedService);
    const selectedTechnicianDetails = emailData.technicians.find(t => t.id === emailData.selectedTechnician);

    // Prepare template variables to match your EmailJS template
    const templateParams = {
      to_email: emailData.customerInfo.email,
      customerInfo_name: emailData.customerInfo.name,
      customerInfo_email: emailData.customerInfo.email,
      customerInfo_phone: emailData.customerInfo.phone,
      customerInfo_address: emailData.customerInfo.address,
      customerInfo_notes: emailData.customerInfo.notes,
      selectedServiceDetails_name: selectedServiceDetails?.name || 'Beauty Service',
      selectedTechnicianDetails_name: selectedTechnicianDetails?.name || 'Our Team',
      appointment_date: format(emailData.selectedDate, 'MMMM dd, yyyy'),
      appointment_time: emailData.selectedTime,
      serviceType: emailData.serviceType === 'in-home' ? 'In-Home Service' : 'In-Store Service',
      serviceType_in_home: emailData.serviceType === 'in-home',
      loyaltyPointsUsed: emailData.loyaltyPointsUsed || 0,
      loyaltyDiscount: emailData.loyaltyDiscount ? emailData.loyaltyDiscount.toFixed(2) : null,
      totalAmount: emailData.totalAmount.toFixed(2),
      booking_confirmation: `APT-${Date.now()}`,
      company_name: 'Beauty Plaza'
    };

    // Send email using the apt_conf template
    await emailjs.send(
      'service_e4fqv58',
      'apt_conf',
      templateParams
    );

    console.log('Appointment confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
