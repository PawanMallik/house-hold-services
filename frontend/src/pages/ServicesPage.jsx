import React from 'react';
import { Settings, Home, Wrench } from 'lucide-react';
import ServiceCard from '../components/services/ServiceCard';

const ServicesPage = ({ setCurrentPage }) => {
  const services = [
    {
      id: 1,
      name: 'AC Repair & Maintenance',
      description: 'Professional AC repair, maintenance, and installation services',
      price: 89,
      rating: 4.8,
      duration: '2-3 hours',
      icon: Settings
    },
    {
      id: 2,
      name: 'House Cleaning',
      description: 'Complete house cleaning service including bathrooms, kitchen, and living areas',
      price: 75,
      rating: 4.9,
      duration: '3-4 hours',
      icon: Home
    },
    {
      id: 3,
      name: 'Plumbing Services',
      description: 'Fix leaks, unclog drains, install fixtures, and emergency repairs',
      price: 95,
      rating: 4.7,
      duration: '1-2 hours',
      icon: Wrench
    },
    {
      id: 4,
      name: 'Electrical Work',
      description: 'Electrical repairs, outlet installation, and safety inspections',
      price: 120,
      rating: 4.6,
      duration: '2-3 hours',
      icon: Settings
    },
    {
      id: 5,
      name: 'Painting Services',
      description: 'Interior and exterior painting with premium quality materials',
      price: 200,
      rating: 4.8,
      duration: '4-6 hours',
      icon: Home
    },
    {
      id: 6,
      name: 'Appliance Repair',
      description: 'Repair services for washing machines, refrigerators, and other appliances',
      price: 85,
      rating: 4.5,
      duration: '1-2 hours',
      icon: Wrench
    }
  ];

  const handleBookNow = (service) => {
    setCurrentPage('booking');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600">Professional household services at your doorstep</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onBookNow={handleBookNow}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;