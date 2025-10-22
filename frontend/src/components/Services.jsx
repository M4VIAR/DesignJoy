import React from 'react';
import { Home, Layout, Palette, Sofa, Lightbulb, Sparkles } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Design",
      description: "Transform your home into a personalized sanctuary with our comprehensive residential interior design services."
    },
    {
      icon: Layout,
      title: "Space Planning",
      description: "Optimize your space with functional layouts that enhance flow and maximize every square foot."
    },
    {
      icon: Palette,
      title: "Color Consultation",
      description: "Expert color selection to create harmonious palettes that reflect your style and personality."
    },
    {
      icon: Sofa,
      title: "Furniture Selection",
      description: "Curate the perfect pieces that blend comfort, style, and functionality for your space."
    },
    {
      icon: Lightbulb,
      title: "Lighting Design",
      description: "Create ambiance and highlight architectural features with strategic lighting solutions."
    },
    {
      icon: Sparkles,
      title: "Styling & Decor",
      description: "Add the finishing touches with carefully selected accessories and decor elements."
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-light text-[#4A4238] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our <span className="text-[#D4A574] font-medium">Services</span>
          </h2>
          <p className="text-xl text-[#8B7E74] max-w-2xl mx-auto">
            Comprehensive interior design solutions tailored to your unique needs and vision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md card-hover group"
              >
                <div className="bg-[#F5F1E8] w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4A574] transition-colors duration-300">
                  <Icon className="h-8 w-8 text-[#4A4238] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3
                  className="text-2xl font-medium text-[#4A4238] mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.title}
                </h3>
                <p className="text-[#8B7E74] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;