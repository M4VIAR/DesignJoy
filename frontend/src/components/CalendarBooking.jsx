import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CalendarBooking = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '10:00',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [calendarLink, setCalendarLink] = useState('');
  const { toast } = useToast();

  // Get available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    try {
      setLoading(true);

      // Create start and end datetime
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 15 * 60000); // Add 15 minutes

      // Save booking to database
      await axios.post(`${API}/bookings`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        message: formData.message,
        status: 'pending'
      });

      // Generate Google Calendar link
      const eventTitle = encodeURIComponent('Discovery Call - Interior Design Consultation with Designs with Joy');
      const eventDetails = encodeURIComponent(`Consulta de diseño de interiores con ${formData.name}\n\nTeléfono: ${formData.phone}\nEmail: ${formData.email}\n\nMensaje: ${formData.message || 'Sin mensaje adicional'}`);
      const startTime = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endTime = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&dates=${startTime}/${endTime}&add=hello@designswithjoy.com`;
      
      setCalendarLink(googleCalendarUrl);

      toast({
        title: "¡Reserva Confirmada!",
        description: "Tu llamada de descubrimiento ha sido agendada."
      });

      setStep(3);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Algo salió mal. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
    }
    if (step === 2) {
      if (!formData.date || !formData.time) {
        toast({
          title: "Missing Information",
          description: "Please select a date and time.",
          variant: "destructive"
        });
        return;
      }
      handleGoogleAuth();
      return;
    }
    setStep(step + 1);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const stepLabels = ['Datos', 'Agendar', 'Confirmar', 'Listo'];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((num) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 ${
                  step >= num
                    ? 'bg-[#D4A574] text-white'
                    : 'bg-[#E8DCC8] text-[#8B7E74]'
                }`}
              >
                {step > num ? <Check size={20} /> : num}
              </div>
              <span className={`text-xs font-medium ${
                step >= num ? 'text-[#D4A574]' : 'text-[#8B7E74]'
              }`}>
                {stepLabels[num - 1]}
              </span>
            </div>
            {num < 4 && (
              <div
                className={`w-12 h-1 mt-[-20px] ${
                  step > num ? 'bg-[#D4A574]' : 'bg-[#E8DCC8]'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'var(--font-heading)' }} className="text-3xl text-[#4A4238]">
            {step === 1 && 'Your Information'}
            {step === 2 && 'Select Date & Time'}
            {step === 3 && 'Confirm Booking'}
            {step === 4 && 'Booking Confirmed!'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'Choose a convenient time for your 15-minute discovery call'}
            {step === 3 && 'Review your booking details'}
            {step === 4 && 'We look forward to speaking with you'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Step 1: Contact Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Clock size={16} />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                  required
                />
              </div>

              <Button
                onClick={nextStep}
                className="w-full bg-[#D4A574] hover:bg-[#C9A069] text-white mt-6"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  Select Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={getTodayDate()}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Clock size={16} />
                  Select Time *
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, time }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.time === time
                          ? 'border-[#D4A574] bg-[#D4A574] text-white'
                          : 'border-[#E8DCC8] hover:border-[#D4A574]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Additional Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us briefly about your project..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-1 bg-[#D4A574] hover:bg-[#C9A069] text-white"
                >
                  {loading ? 'Connecting...' : 'Connect Google Calendar'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-[#F5F1E8] p-6 rounded-lg space-y-4">
                <div>
                  <p className="text-sm text-[#8B7E74]">Name</p>
                  <p className="font-medium text-[#4A4238]">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8B7E74]">Email</p>
                  <p className="font-medium text-[#4A4238]">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8B7E74]">Phone</p>
                  <p className="font-medium text-[#4A4238]">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8B7E74]">Date & Time</p>
                  <p className="font-medium text-[#4A4238]">
                    {new Date(`${formData.date}T${formData.time}`).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {' at '}
                    {formData.time}
                  </p>
                </div>
                {formData.message && (
                  <div>
                    <p className="text-sm text-[#8B7E74]">Message</p>
                    <p className="font-medium text-[#4A4238]">{formData.message}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 bg-[#D4A574] hover:bg-[#C9A069] text-white"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-medium text-[#4A4238] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Booking Confirmed!
              </h3>
              <p className="text-[#8B7E74] mb-6">
                Your discovery call has been added to your Google Calendar. We've sent you a confirmation email with all the details.
              </p>
              <Button
                onClick={onClose}
                className="bg-[#D4A574] hover:bg-[#C9A069] text-white"
              >
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarBooking;