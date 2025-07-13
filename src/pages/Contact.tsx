
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    business_name: 'Beauty Plaza',
    phone: '+1-555-BEAUTY',
    email: 'info@beautyplaza.com',
    address: '123 Beauty Street, Spa City, SC 12345'
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Load business settings with caching
  useEffect(() => {
    const loadBusinessInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('business_settings')
          .select('*')
          .single();
        
        if (data && !error) {
          setBusinessInfo({
            business_name: data.business_name || 'Beauty Plaza',
            phone: data.phone || '+1-555-BEAUTY',
            email: data.email || 'info@beautyplaza.com',
            address: data.address || '123 Beauty Street, Spa City, SC 12345'
          });
        }
      } catch (error) {
        console.log('Using default business info');
      }
    };

    loadBusinessInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the contact form data
      // For now, we'll just show a success message
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our services or want to book an appointment? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">{businessInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">{businessInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Address</h3>
                      <p className="text-gray-600">{businessInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Business Hours</h2>
                </div>
                
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
