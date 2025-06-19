
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

    // Send email using EmailJS
    await emailjs.send(
      'service_e4fqv58',
      'template_bvdipdh',
      {
        from_name: emailData.customerInfo.name,
        from_email: emailData.customerInfo.email,
        to_name: 'Beauty Plaza',
        subject: 'New Appointment Booking',
        message: `
New appointment booking details:

Service: ${selectedServiceDetails?.name}
Technician: ${selectedTechnicianDetails?.name}
Date: ${format(emailData.selectedDate, 'MMMM dd, yyyy')}
Time: ${emailData.selectedTime}
Service Type: ${emailData.serviceType === 'in-home' ? 'In-Home' : 'In-Store'}
Customer: ${emailData.customerInfo.name}
Email: ${emailData.customerInfo.email}
Phone: ${emailData.customerInfo.phone}
${emailData.serviceType === 'in-home' ? `Address: ${emailData.customerInfo.address}` : ''}
${emailData.customerInfo.notes ? `Notes: ${emailData.customerInfo.notes}` : ''}
${emailData.loyaltyPointsUsed ? `Loyalty Points Used: ${emailData.loyaltyPointsUsed}` : ''}
${emailData.loyaltyDiscount ? `Loyalty Discount: $${emailData.loyaltyDiscount.toFixed(2)}` : ''}
Total Amount: $${emailData.totalAmount}
        `
      }
    );

    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
