import React from 'react';
import { Award, Heart, Users } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '200+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Heart, value: '500+', label: 'Projects Completed' }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h2
              className="text-5xl md:text-6xl font-light text-[#4A4238] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Creating Spaces That
              <span className="block text-[#D4A574] font-medium">Tell Your Story</span>
            </h2>
            <p className="text-lg text-[#8B7E74] leading-relaxed">
              Welcome to Designs with Joy, where every space is thoughtfully crafted to reflect your personality and enhance your lifestyle. With over 15 years of experience in interior design, I believe that beautiful spaces should bring comfort, functionality, and above all, joy.
            </p>
            <p className="text-lg text-[#8B7E74] leading-relaxed">
              My approach combines timeless elegance with modern sensibilities, creating interiors that are both sophisticated and welcoming. From initial concept to final styling, I work closely with each client to bring their vision to life.
            </p>
            <p className="text-lg text-[#8B7E74] leading-relaxed">
              Whether you're redesigning a single room or transforming your entire home, I'm here to guide you through every step of the journey.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="space-y-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-6 p-6 bg-[#F5F1E8] rounded-lg card-hover"
                >
                  <div className="bg-[#D4A574] p-4 rounded-full">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div
                      className="text-4xl font-semibold text-[#4A4238] mb-1"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[#8B7E74] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;