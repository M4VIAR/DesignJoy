import React, { useState, useEffect } from 'react';
import Logo from '../assets/dwj.png';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
          {/* Logo image (replaces previous text logo) */}
          <img src={Logo} alt="DesignJoy logo" className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className={`hover:text-[#D4A574] transition-colors duration-300 font-medium ${
                isScrolled ? 'text-[#4A4238]' : 'text-white'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`hover:text-[#D4A574] transition-colors duration-300 font-medium ${
                isScrolled ? 'text-[#4A4238]' : 'text-white'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className={`hover:text-[#D4A574] transition-colors duration-300 font-medium ${
                isScrolled ? 'text-[#4A4238]' : 'text-white'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`hover:text-[#D4A574] transition-colors duration-300 font-medium ${
                isScrolled ? 'text-[#4A4238]' : 'text-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-[#4A4238]' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#4A4238] hover:text-[#D4A574] transition-colors duration-300 font-medium text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-[#4A4238] hover:text-[#D4A574] transition-colors duration-300 font-medium text-left"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-[#4A4238] hover:text-[#D4A574] transition-colors duration-300 font-medium text-left"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#4A4238] hover:text-[#D4A574] transition-colors duration-300 font-medium text-left"
            >
              Contact
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;