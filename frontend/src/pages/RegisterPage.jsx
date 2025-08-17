import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';

const RegisterPage = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    const result = await register({
      fullName: registerData.fullName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password
    });

    if (result.success) {
      setCurrentPage('dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Account</h1>
        <p className="text-gray-600">Join ServiceHub today</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div onSubmit={handleRegister}>
          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            value={registerData.fullName}
            onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={registerData.email}
            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={registerData.phone}
            onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={registerData.password}
            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
            required
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />

          <Button 
            type="button" 
            size="large" 
            className="w-full mb-4" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;