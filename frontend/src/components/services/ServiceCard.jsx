import React from 'react';
import { Star, Clock } from 'lucide-react';
import Button from '../common/Button';

const ServiceCard = ({ service, onBookNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <service.icon className="w-16 h-16 text-blue-600" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{service.rating}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${service.price}</span>
          <Button onClick={() => onBookNow(service)}>Book Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;