import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthCallback from './components/AuthCallback';
import { Toaster } from './components/ui/sonner';

const HomePage = () => (
  <>
    <Header />
    <Hero />
    <About />
    <Services />
    <Gallery />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;