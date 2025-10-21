import React, { useState } from 'react';
import { Calendar, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { mockBookingRequest } from '../mock';
import { useToast } from '../hooks/use-toast';

const Hero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await mockBookingRequest(formData);
      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      setIsDialogOpen(false);
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
    <section className="relative h-screen w-full overflow-hidden grain-overlay">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1564078516393-cf04bd966897?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8fDE3NjEwOTEwNzV8MA&ixlib=rb-4.1.0&q=85)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl fade-in">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Designs with <span className="text-[#D4A574] font-medium">Joy</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed">
              Transforming spaces into timeless sanctuaries that reflect your unique style and inspire joy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="bg-[#D4A574] hover:bg-[#C9A069] text-white px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Request a Call
              </Button>
              <Button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#4A4238] px-8 py-6 text-lg font-medium shadow-lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>Request a Call Back</DialogTitle>
            <DialogDescription>
              Fill in your details and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4A574] hover:bg-[#C9A069] text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;