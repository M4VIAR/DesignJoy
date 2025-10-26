import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import emailjs from '@emailjs/browser';
// No need for axios or backend URL anymore

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

  // EmailJS configuration (replace with your real keys if different)
  const EMAILJS_PUBLIC_KEY = 'sv3yL23sHzCoDRZL3';
  const EMAILJS_SERVICE_ID = 'service_ecnyaog';
  const EMAILJS_TEMPLATE_ID = 'template_830nktt';
  const ADMIN_EMAIL = 'metabad1@gmail.com';

  // initialize EmailJS
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } catch (e) {
    // ignore init errors during SSR or if already initialized
  }

  // Helpers for dates and times
  const getTodayDate = (d = new Date()) => {
    const today = d;
    return today.toISOString().split('T')[0];
  };

  const isWeekend = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getNextWeekday = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    return getTodayDate(date);
  };

  // Generate slots from 09:00 to 18:00 in 30-min steps, optionally filtering past slots for today
  const generateTimeSlots = (selectedDate) => {
    const slots = [];
    const startHour = 9;
    const endHour = 18; // exclusive
    const now = new Date();
    const isToday = selectedDate && (new Date(selectedDate + 'T00:00:00').toDateString() === new Date().toDateString());

    for (let h = startHour; h < endHour; h++) {
      for (let m of [0, 30]) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const t = `${hh}:${mm}`;
        if (isToday) {
          const slotDt = new Date(`${selectedDate}T${t}:00`);
          if (slotDt <= now) continue; // skip past slots
        }
        slots.push(t);
      }
    }
    return slots;
  };

  const getNextAvailableSlot = (selectedDate) => {
    const slots = generateTimeSlots(selectedDate || getTodayDate());
    return slots.length > 0 ? slots[0] : '';
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      // If user selects a weekend, adjust to next weekday
      let val = value;
      if (!val) {
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (isWeekend(val)) {
        const adjusted = getNextWeekday(val);
        toast({
          title: 'Weekend not allowed',
          description: 'Weekends are not available. Date adjusted to next weekday.',
          variant: 'destructive'
        });
        val = adjusted;
      }

      // Update time slots for the selected date and set default time to next available
      const slots = generateTimeSlots(val);
      setTimeSlots(slots);
      const nextSlot = slots.length > 0 ? slots[0] : '';
      setFormData(prev => ({ ...prev, date: val, time: nextSlot }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Compute min selectable date (today or next weekday if today is weekend)
  const todayISO = getTodayDate();
  const minSelectableDate = isWeekend(todayISO) ? getNextWeekday(todayISO) : todayISO;

  // Initialize date and default time on mount
  useEffect(() => {
    const initialDate = minSelectableDate;
    const initialSlots = generateTimeSlots(initialDate);
    setTimeSlots(initialSlots);
    const initialTime = initialSlots.length > 0 ? initialSlots[0] : '';
    setFormData(prev => ({ ...prev, date: initialDate, time: initialTime }));
    // (no lint-disable needed)
  }, []);

  const handleBooking = async () => {
    try {
      setLoading(true);

      // Create start and end datetime
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 15 * 60000); // Add 15 minutes

      // Send notification email via EmailJS (best-effort)
      const templateParams = {
        name: formData.name,
        from_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        booking_date: startDateTime.toLocaleString(),
        message: formData.message || 'No additional message',
        email: ADMIN_EMAIL // This is the recipient's email
      };

      try {
        const emailResp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('EmailJS response:', emailResp);
        toast({ title: 'Notification Sent', description: 'A notification email was sent.', variant: 'default' });
      } catch (emailErr) {
        console.error('EmailJS error:', emailErr);
        toast({ title: 'Email Failed', description: 'Could not send notification email — continuing to calendar.', variant: 'warning' });
      }

      // Generate Google Calendar link
      const eventTitle = encodeURIComponent('Discovery Call - Interior Design Consultation with Designs with Joy');
      const eventDetails = encodeURIComponent(`Consulta de diseño de interiores con ${formData.name}\n\nTeléfono: ${formData.phone}\nEmail: ${formData.email}\n\nMensaje: ${formData.message || 'Sin mensaje adicional'}`);
      const startTime = startDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endTime = endDateTime.toISOString().replace(/-|:|\.\d\d\d/g, '');

      const ownerEmail = ADMIN_EMAIL;
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&dates=${startTime}/${endTime}&add=${ownerEmail}&src=${ownerEmail}&trp=true`;

      const newWindow = window.open(googleCalendarUrl, '_blank');
      if (newWindow) {
        toast({
          title: 'Opening Google Calendar',
          description: 'Please complete your booking in the Google Calendar window that just opened.'
        });
      } else {
        toast({
          title: 'Popup Blocked',
          description: 'Please allow popups and try again to complete your booking in Google Calendar.',
          variant: 'warning'
        });
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
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
                  min={minSelectableDate}
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

              <div className="flex flex-col gap-3">

                
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full bg-[#D4A574] hover:bg-[#C9A069] text-white"
                >
                  {loading ? 'Booking...' : 'Confirm & Add to Calendar'}
                </Button>
                
                <Button
                  onClick={() => {
                    const phone = '+1 4842138870'; // Replace with your actual WhatsApp number (country code + number)
                    const bookingDateStr = formData.date && formData.time ? ` on ${formData.date} at ${formData.time}` : '';
                    const message = encodeURIComponent(`Hi! I'm ${formData.name || ''} and I'd like to schedule a consultation${bookingDateStr}.`);
                    window.open(`https://wa.me/${phone.replace(/\+/g, '')}?text=${message}`, '_blank');
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