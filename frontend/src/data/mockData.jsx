import { Settings, Home, Wrench } from 'lucide-react';

export const services = [
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

export const featuredServices = [
  { name: 'AC Repair', icon: Settings, price: 89 },
  { name: 'House Cleaning', icon: Home, price: 75 },
  { name: 'Plumbing', icon: Wrench, price: 95 }
];

export const mockBookings = [
  { id: 1, service: 'AC Repair', date: '2024-08-15', status: 'Confirmed', technician: 'John Smith' },
  { id: 2, service: 'House Cleaning', date: '2024-08-12', status: 'Completed', technician: 'Mary Johnson' },
  { id: 3, service: 'Plumbing', date: '2024-08-10', status: 'In Progress', technician: 'Mike Wilson' }
];

export const servicesList = ['AC Repair', 'House Cleaning', 'Plumbing', 'Electrical Work', 'Painting', 'Appliance Repair'];