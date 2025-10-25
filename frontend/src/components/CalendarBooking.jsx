import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import emailjs from '@emailjs/browser';

// Inicializar EmailJS
const EMAILJS_PUBLIC_KEY = "sv3yL23sHzCoDRZL3";
const EMAILJS_SERVICE_ID = "service_ecnyaog";
const EMAILJS_TEMPLATE_ID = "template_cnn7szr";
const ADMIN_EMAIL = "metabad1@gmail.com";

emailjs.init(EMAILJS_PUBLIC_KEY);

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
  // Removed calendarLink state as we're opening calendar directly
  const { toast } = useToast();

  // Generate available time slots from 9 AM to 6 PM
  const generateTimeSlots = (selectedDate) => {
    const slots = [];
    const currentDate = new Date();
    const isToday = selectedDate && new Date(selectedDate).toDateString() === currentDate.toDateString();
    
    for (let hour = 9; hour < 18; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        
        // For today, only show future time slots
        if (isToday) {
          const slotTime = new Date(currentDate.toDateString() + ' ' + time);
          if (slotTime <= new Date()) continue;
        }
        
        slots.push(time);
      }
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      // Update available time slots when date changes
      setTimeSlots(generateTimeSlots(value));
      
      // Clear selected time if it's no longer available
      const newSlots = generateTimeSlots(value);
      if (!newSlots.includes(formData.time)) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          time: newSlots.length > 0 ? newSlots[0] : ''
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    try {
      setLoading(true);

      // Create start and end datetime
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 15 * 60000); // Add 15 minutes

      // Prepare email parameters
      const templateParams = {
        to_email: ADMIN_EMAIL,
        from_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        message: formData.message || 'No additional message',
        booking_date: startDateTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      };

      console.log('Sending email with parameters:', templateParams);

      try {
        // Send email using EmailJS
        const emailResponse = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        console.log('Email response:', emailResponse);

        if (emailResponse.status !== 200) {
          throw new Error('Failed to send notification email');
        }

        // Show success toast for email
        toast({
          title: "Notification Sent",
          description: "We've sent you a confirmation email.",
          variant: "success"
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't throw here, we still want to open the calendar
        toast({
          title: "Email Notification Failed",
          description: "We couldn't send the confirmation email, but you can still proceed with the calendar booking.",
          variant: "warning"
        });
      }

      // Generate Google Calendar link
      const eventTitle = encodeURIComponent('Discovery Call - Interior Design Consultation with Designs with Joy');
      const eventDetails = encodeURIComponent(`Consulta de diseño de interiores con ${formData.name}\n\nTeléfono: ${formData.phone}\nEmail: ${formData.email}\n\nMensaje: ${formData.message || 'Sin mensaje adicional'}`);
      const startTime = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endTime = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      
      // Agregar tu correo como invitado requerido al evento
      // Create and open Google Calendar event
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&dates=${startTime}/${endTime}&add=${ADMIN_EMAIL}&src=${ADMIN_EMAIL}&recur=RRULE:FREQ=YEARLY;COUNT=1&trp=true`;
      
      // Attempt to open Google Calendar
      const newWindow = window.open(googleCalendarUrl, '_blank');

      if (newWindow) {
        toast({
          title: "Opening Google Calendar",
          description: "Please complete your booking in the Google Calendar window that just opened."
        });
      } else {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups and try again to complete your booking in Google Calendar.",
          variant: "warning"
        });
      }

      // Cerrar el modal después de abrir el calendario
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
      setStep(3);
      return;
    }
    setStep(step + 1);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Function to check if a date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const stepLabels = ['Datos', 'Agendar', 'Confirmar'];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium mb-2 ${
                  step >= num
                    ? 'bg-[#D4A574] text-white'
                    : 'bg-[#E8DCC8] text-[#8B7E74]'
                }`}
              >
                {step > num ? <Check size={20} /> : num}
              </div>
              <span className={`text-sm font-medium ${
                step >= num ? 'text-[#D4A574]' : 'text-[#8B7E74]'
              }`}>
                {stepLabels[num - 1]}
              </span>
            </div>
            {num < 3 && (
              <div
                className={`w-16 h-1 mt-[-24px] ${
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
                  onChange={(e) => {
                    if (isWeekend(e.target.value)) {
                      toast({
                        title: "Weekend Selected",
                        description: "Please select a weekday (Monday to Friday)",
                        variant: "destructive"
                      });
                      return;
                    }
                    handleInputChange(e);
                  }}
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
                  {loading ? 'Processing...' : 'Continue'}
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

              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full bg-[#D4A574] hover:bg-[#C9A069] text-white"
                >
                  {loading ? 'Booking...' : 'Confirm & Add to Calendar'}
                </Button>
                <Button
                  onClick={() => {
                    const phone = '+522491325762'; // Replace with your actual WhatsApp number
                    const message = encodeURIComponent(`Hi! I'm ${formData.name} and I'd like to schedule a consultation.`);
                    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  I Prefer WhatsApp Chat
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Success step removed as we're opening calendar directly */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarBooking;