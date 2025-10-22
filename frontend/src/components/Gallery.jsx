import React, { useState } from 'react';
import { mockGalleryItems } from '../mock';

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Bedroom', 'Kitchen', 'Dining Room'];

  const filteredItems = filter === 'All'
    ? mockGalleryItems
    : mockGalleryItems.filter(item => item.category === filter);

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2
            className="text-5xl md:text-6xl font-light text-[#4A4238] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our <span className="text-[#D4A574] font-medium">Portfolio</span>
          </h2>
          <p className="text-xl text-[#8B7E74] max-w-2xl mx-auto mb-10">
            Explore our recent projects and get inspired by the spaces we've transformed.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-[#D4A574] text-white shadow-md'
                    : 'bg-[#F5F1E8] text-[#4A4238] hover:bg-[#E8DCC8]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-lg card-hover aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm text-[#D4A574] font-medium mb-1">{item.category}</p>
                  <h3
                    className="text-2xl font-medium text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;