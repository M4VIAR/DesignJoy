// Mock data for Designs with Joy website

export const mockServices = [
  {
    id: 1,
    title: "Residential Design",
    description: "Transform your home into a personalized sanctuary with our comprehensive residential interior design services.",
    icon: "home"
  },
  {
    id: 2,
    title: "Space Planning",
    description: "Optimize your space with functional layouts that enhance flow and maximize every square foot.",
    icon: "layout"
  },
  {
    id: 3,
    title: "Color Consultation",
    description: "Expert color selection to create harmonious palettes that reflect your style and personality.",
    icon: "palette"
  },
  {
    id: 4,
    title: "Furniture Selection",
    description: "Curate the perfect pieces that blend comfort, style, and functionality for your space.",
    icon: "sofa"
  },
  {
    id: 5,
    title: "Lighting Design",
    description: "Create ambiance and highlight architectural features with strategic lighting solutions.",
    icon: "lightbulb"
  },
  {
    id: 6,
    title: "Styling & Decor",
    description: "Add the finishing touches with carefully selected accessories and decor elements.",
    icon: "sparkles"
  }
];

export const mockGalleryItems = [
  {
    id: 1,
    title: "Modern Bedroom Retreat",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1642541070065-3912f347e7c6?w=800"
  },
  {
    id: 2,
    title: "Serene Sleeping Space",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?w=800"
  },
  {
    id: 3,
    title: "Contemporary Kitchen",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800"
  },
  {
    id: 4,
    title: "Elegant Kitchen Design",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1628745277862-bc0b2d68c50c?w=800"
  },
  {
    id: 5,
    title: "Sophisticated Dining",
    category: "Dining Room",
    image: "https://images.unsplash.com/photo-1616486886892-ff366aa67ba4?w=800"
  },
  {
    id: 6,
    title: "Warm Dining Space",
    category: "Dining Room",
    image: "https://images.unsplash.com/photo-1505409628601-edc9af17fda6?w=800"
  }
];

export const mockBookingRequest = (data) => {
  console.log('Mock booking request:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Request submitted successfully!' });
    }, 1000);
  });
};

export const mockContactSubmit = (data) => {
  console.log('Mock contact submission:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Message sent successfully!' });
    }, 1000);
  });
};