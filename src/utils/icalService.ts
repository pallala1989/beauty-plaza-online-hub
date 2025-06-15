
import { createEvent, EventAttributes } from 'ics';

interface IcalData {
  serviceName: string;
  technicianName: string;
  selectedDate: Date;
  selectedTime: string;
  duration: number; // in minutes
  customerName: string;
  customerEmail: string;
  serviceType: string;
  address?: string;
}

export const generateIcsContent = (icalData: IcalData): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { 
      serviceName, 
      technicianName, 
      selectedDate, 
      selectedTime, 
      duration,
      customerName,
      customerEmail,
      serviceType,
      address
    } = icalData;

    const [hour, minute] = selectedTime.split(':').map(Number);
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hour, minute, 0, 0);

    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const event: EventAttributes = {
      start: [startDateTime.getFullYear(), startDateTime.getMonth() + 1, startDateTime.getDate(), startDateTime.getHours(), startDateTime.getMinutes()],
      end: [endDateTime.getFullYear(), endDateTime.getMonth() + 1, endDateTime.getDate(), endDateTime.getHours(), endDateTime.getMinutes()],
      title: `Appointment: ${serviceName}`,
      description: `Your appointment for ${serviceName} with ${technicianName}. Customer: ${customerName}.`,
      location: serviceType === 'in-home' && address ? `In-Home Service at: ${address}` : 'Beauty Plaza Salon',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Beauty Plaza', email: 'contact@beautyplaza.com' },
      attendees: [
        { name: customerName, email: customerEmail, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' }
      ]
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error('Error creating ICS file:', error);
        reject(error);
      }
      resolve(value);
    });
  });
};
