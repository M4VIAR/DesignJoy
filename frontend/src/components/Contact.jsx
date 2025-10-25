import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockContactSubmit } from '../mock';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await mockContactSubmit(formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll respond shortly.",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-light text-[#4A4238] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Get In <span className="text-[#D4A574] font-medium">Touch</span>
          </h2>
          <p className="text-xl text-[#8B7E74] max-w-2xl mx-auto">
            Ready to transform your space? Let's start a conversation about your design dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4A574] p-3 rounded-full">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#4A4238] mb-1">Phone</h3>
                <p className="text-[#8B7E74]">+1 267-291-4457</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#D4A574] p-3 rounded-full">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#4A4238] mb-1">Email</h3>
                <p className="text-[#8B7E74]">hello@designswithjoy.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#D4A574] p-3 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[#4A4238] mb-1">Location</h3>
                <p className="text-[#8B7E74]">1862 Tollgate Rd<br />Palm  PA 18070</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md mt-8">
              <h3
                className="text-2xl font-medium text-[#4A4238] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Office Hours
              </h3>
              <div className="space-y-2 text-[#8B7E74]">
                <p className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">Closed</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contact-name">Your Name</Label>
                <Input
                  id="contact-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="contact-message">Your Message</Label>
                <Textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-2"
                  rows={5}
                  placeholder="Tell us about your project..."
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4A574] hover:bg-[#C9A069] text-white py-6 text-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;