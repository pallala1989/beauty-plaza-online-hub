
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailData {
  customerEmail: string;
  customerName: string;
  adminEmail: string;
  services: string;
  technician: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  totalAmount: number;
  loyaltyPointsUsed: number;
  loyaltyDiscount: number;
  notes?: string;
  address?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: AppointmentEmailData = await req.json();
    console.log('Processing appointment confirmation email:', emailData);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63; text-align: center;">Beauty Plaza</h1>
        <h2 style="color: #333;">Appointment Confirmation</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
          <p><strong>Customer:</strong> ${emailData.customerName}</p>
          <p><strong>Services:</strong> ${emailData.services}</p>
          <p><strong>Technician:</strong> ${emailData.technician}</p>
          <p><strong>Date:</strong> ${emailData.appointmentDate}</p>
          <p><strong>Time:</strong> ${emailData.appointmentTime}</p>
          <p><strong>Service Type:</strong> ${emailData.serviceType === 'in-home' ? 'In-Home Service' : 'In-Store Service'}</p>
          ${emailData.address ? `<p><strong>Address:</strong> ${emailData.address}</p>` : ''}
          <p><strong>Total Amount:</strong> $${emailData.totalAmount.toFixed(2)}</p>
          ${emailData.loyaltyPointsUsed > 0 ? `<p><strong>Loyalty Points Used:</strong> ${emailData.loyaltyPointsUsed} (Saved: $${emailData.loyaltyDiscount.toFixed(2)})</p>` : ''}
          ${emailData.notes ? `<p><strong>Notes:</strong> ${emailData.notes}</p>` : ''}
        </div>
        
        <p style="color: #666;">We look forward to seeing you for your appointment!</p>
        <p style="color: #666;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px;">Beauty Plaza<br>123 Beauty Street, Spa City, SC 12345<br>Phone: +1-555-BEAUTY</p>
        </div>
      </div>
    `;

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Beauty Plaza <onboarding@resend.dev>",
      to: [emailData.customerEmail],
      subject: `Appointment Confirmation - ${emailData.appointmentDate} at ${emailData.appointmentTime}`,
      html: emailHtml,
    });

    // Send copy to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Beauty Plaza <onboarding@resend.dev>",
      to: [emailData.adminEmail],
      subject: `New Appointment - ${emailData.customerName} on ${emailData.appointmentDate}`,
      html: emailHtml,
    });

    console.log('Customer email sent:', customerEmailResponse);
    console.log('Admin email sent:', adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error sending appointment confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
