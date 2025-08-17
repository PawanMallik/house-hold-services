import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';

const BookingPage = ({ setCurrentPage }) => {
  const { user, isAuthenticated, createBooking, getServices } = useAuth();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    serviceAddress: '',
    customerPhone: user?.phone || '',
    specialNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      const result = await getServices();
      if (result.success) {
        setServices(result.services);
      }
    };
    loadServices();
  }, [getServices]);

  // Update phone when user data is available
  useEffect(() => {
    if (user?.phone) {
      setFormData(prev => ({ ...prev, customerPhone: user.phone }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to make a booking');
      setCurrentPage('login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const bookingData = {
      serviceId: formData.serviceId,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      serviceAddress: formData.serviceAddress,
      customerPhone: formData.customerPhone,
      specialNotes: formData.specialNotes
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      setSuccess('Booking created successfully! We will contact you shortly to confirm.');
      setFormData({
        serviceId: '',
        bookingDate: '',
        bookingTime: '',
        serviceAddress: '',
        customerPhone: user?.phone || '',
        specialNotes: ''
      });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h1>
          <p className="text-lg text-gray-600 mb-6">Please log in to book a service</p>
          <div className="space-x-4">
            <Button onClick={() => setCurrentPage('login')}>
              Login
            </Button>
            <Button variant="outline" onClick={() => setCurrentPage('register')}>
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Book a Service</h1>
        <p className="text-lg text-gray-600">Fill out the form below to schedule your service</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.base_price}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Preferred Date"
              type="date"
              value={formData.bookingDate}
              onChange={(e) => handleInputChange('bookingDate', e.target.value)}
              required
              min={getMinDate()}
            />
            <FormInput
              label="Preferred Time"
              type="time"
              value={formData.bookingTime}
              onChange={(e) => handleInputChange('bookingTime', e.target.value)}
              required
              min="08:00"
              max="18:00"
            />
          </div>

          <FormInput
            label="Service Address"
            placeholder="Enter your full address"
            value={formData.serviceAddress}
            onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="Your contact number"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            required
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              placeholder="Any specific requirements or details..."
              value={formData.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button 
            type="submit" 
            size="large" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Submit Booking Request'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Note:</strong> Service hours are 8:00 AM to 6:00 PM. We will contact you within 24 hours to confirm your booking.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;