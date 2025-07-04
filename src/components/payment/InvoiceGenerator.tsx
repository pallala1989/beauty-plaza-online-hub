
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Printer } from "lucide-react";

interface InvoiceData {
  id: string;
  services: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
  subtotal: number;
  tip: number;
  pointsUsed: number;
  pointsDiscount: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  onClose: () => void;
}

const InvoiceGenerator = ({ invoiceData, customerInfo, onClose }: InvoiceGeneratorProps) => {
  const handleDownload = () => {
    // Create a simple text invoice for download
    const invoiceText = `
BEAUTY PLAZA INVOICE
Invoice #: ${invoiceData.id}
Date: ${new Date(invoiceData.timestamp).toLocaleDateString()}
Time: ${new Date(invoiceData.timestamp).toLocaleTimeString()}

Customer Information:
${customerInfo?.name || 'Walk-in Customer'}
${customerInfo?.email || ''}
${customerInfo?.phone || ''}

Services:
${invoiceData.services.map(s => `${s.name} - $${s.price} (${s.duration} min)`).join('\n')}

Summary:
Subtotal: $${invoiceData.subtotal.toFixed(2)}
${invoiceData.tip > 0 ? `Tip: $${invoiceData.tip.toFixed(2)}` : ''}
${invoiceData.pointsUsed > 0 ? `Points Discount (${invoiceData.pointsUsed} pts): -$${invoiceData.pointsDiscount.toFixed(2)}` : ''}
Total: $${invoiceData.total.toFixed(2)}

Payment Method: ${invoiceData.paymentMethod.toUpperCase()}

Thank you for choosing Beauty Plaza!
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    // Create a new window with just the invoice content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoiceData.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; background: linear-gradient(to right, #ec4899, #9333ea); color: white; padding: 20px; margin-bottom: 20px; }
              .section { margin: 20px 0; }
              .flex { display: flex; justify-content: space-between; }
              .service-item { border-bottom: 1px solid #eee; padding: 10px 0; }
              .total { font-weight: bold; font-size: 18px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Beauty Plaza</h1>
              <p>Invoice</p>
            </div>
            <div class="section">
              <div class="flex">
                <div>
                  <h3>Invoice Details</h3>
                  <p>Invoice #: ${invoiceData.id}</p>
                  <p>Date: ${new Date(invoiceData.timestamp).toLocaleDateString()}</p>
                  <p>Time: ${new Date(invoiceData.timestamp).toLocaleTimeString()}</p>
                </div>
                <div>
                  <h3>Customer</h3>
                  <p>${customerInfo?.name || 'Walk-in Customer'}</p>
                  ${customerInfo?.email ? `<p>${customerInfo.email}</p>` : ''}
                  ${customerInfo?.phone ? `<p>${customerInfo.phone}</p>` : ''}
                </div>
              </div>
            </div>
            <div class="section">
              <h3>Services Provided</h3>
              ${invoiceData.services.map(service => `
                <div class="service-item flex">
                  <div>
                    <span style="font-weight: 500">${service.name}</span>
                    <span style="color: #666; font-size: 14px"> (${service.duration} minutes)</span>
                  </div>
                  <span style="font-weight: 600">$${service.price.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
            <div class="section">
              <h3>Payment Summary</h3>
              <div class="flex"><span>Subtotal:</span><span>$${invoiceData.subtotal.toFixed(2)}</span></div>
              ${invoiceData.tip > 0 ? `<div class="flex"><span>Tip:</span><span>$${invoiceData.tip.toFixed(2)}</span></div>` : ''}
              ${invoiceData.pointsUsed > 0 ? `<div class="flex" style="color: green"><span>Loyalty Points Discount (${invoiceData.pointsUsed} points):</span><span>-$${invoiceData.pointsDiscount.toFixed(2)}</span></div>` : ''}
              <hr>
              <div class="flex total"><span>Total Paid:</span><span style="color: #ec4899">$${invoiceData.total.toFixed(2)}</span></div>
              <div class="flex"><span>Payment Method:</span><span>${invoiceData.paymentMethod.toUpperCase()}</span></div>
            </div>
            <div class="section" style="text-align: center; color: #666; font-size: 14px;">
              <p>Thank you for choosing Beauty Plaza!</p>
              <p>We appreciate your business and look forward to serving you again.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEmailInvoice = () => {
    const subject = `Beauty Plaza Invoice ${invoiceData.id}`;
    const body = `Thank you for your visit! Your invoice #${invoiceData.id} for $${invoiceData.total.toFixed(2)} has been processed.`;
    window.open(`mailto:${customerInfo?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">Beauty Plaza</CardTitle>
          <p className="text-pink-100">Invoice</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Invoice Details</h3>
              <p className="text-sm text-gray-600">Invoice #: {invoiceData.id}</p>
              <p className="text-sm text-gray-600">Date: {new Date(invoiceData.timestamp).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Time: {new Date(invoiceData.timestamp).toLocaleTimeString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Customer</h3>
              <p className="text-sm text-gray-600">{customerInfo?.name || 'Walk-in Customer'}</p>
              {customerInfo?.email && <p className="text-sm text-gray-600">{customerInfo.email}</p>}
              {customerInfo?.phone && <p className="text-sm text-gray-600">{customerInfo.phone}</p>}
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Services Provided</h3>
            <div className="space-y-3">
              {invoiceData.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({service.duration} minutes)</span>
                  </div>
                  <span className="font-semibold">${service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              {invoiceData.tip > 0 && (
                <div className="flex justify-between">
                  <span>Tip:</span>
                  <span>${invoiceData.tip.toFixed(2)}</span>
                </div>
              )}
              {invoiceData.pointsUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Points Discount ({invoiceData.pointsUsed} points):</span>
                  <span>-${invoiceData.pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid:</span>
                <span className="text-pink-600">${invoiceData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Method:</span>
                <Badge variant="secondary">{invoiceData.paymentMethod.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>Thank you for choosing Beauty Plaza!</p>
            <p>We appreciate your business and look forward to serving you again.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-4 no-print">
            <Button variant="outline" onClick={handleDownload} className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex items-center">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            {customerInfo?.email && (
              <Button variant="outline" onClick={handleEmailInvoice} className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
            <Button onClick={onClose} className="bg-pink-600 hover:bg-pink-700">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
