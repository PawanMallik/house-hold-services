  import React, { createContext, useContext, useState, useEffect } from 'react';

  const AuthContext = createContext();

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Set up axios-like fetch with auth header
    const authenticatedFetch = async (url, options = {}) => {
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Authentication failed');
      }
      
      return response;
    };

    // Load user data on app start
    useEffect(() => {
      const loadUser = async () => {
        if (token) {
          try {
            const response = await authenticatedFetch('/auth/me');
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              localStorage.removeItem('token');
              setToken(null);
            }
          } catch (error) {
            console.error('Failed to load user:', error);
            localStorage.removeItem('token');
            setToken(null);
          }
        }
        setLoading(false);
      };

      loadUser();
    }, [token]);

    const register = async (userData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setUser(data.user);
          return { success: true, message: data.message };
        } else {
          return { success: false, error: data.error };
        }
      } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }
    };

    const login = async (email, password) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setUser(data.user);
          return { success: true, message: data.message };
        } else {
          return { success: false, error: data.error };
        }
      } catch (error) {
        return { success: false, error: 'Network error. Please try again.' };
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    };

    const createBooking = async (bookingData) => {
      try {
        const response = await authenticatedFetch('/bookings', {
          method: 'POST',
          body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, data };
        } else {
          return { success: false, error: data.error };
        }
      } catch (error) {
        return { success: false, error: 'Failed to create booking' };
      }
    };

    const getBookingHistory = async () => {
      try {
        const response = await authenticatedFetch('/bookings/my-history');
        
        if (response.ok) {
          const data = await response.json();
          return { success: true, bookings: data.bookings };
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error };
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch booking history' };
      }
    };

    const getBookingStats = async () => {
      try {
        const response = await authenticatedFetch('/bookings/stats');
        
        if (response.ok) {
          const data = await response.json();
          return { success: true, stats: data.stats };
        } else {
          const errorData = await response.json();
          return { success: false, error: errorData.error };
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch booking stats' };
      }
    };

    const cancelBooking = async (bookingId) => {
      try {
        const response = await authenticatedFetch(`/bookings/${bookingId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'cancelled' }),
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, message: data.message };
        } else {
          return { success: false, error: data.error };
        }
      } catch (error) {
        return { success: false, error: 'Failed to cancel booking' };
      }
    };

    const getServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        
        if (response.ok) {
          const services = await response.json();
          return { success: true, services };
        } else {
          return { success: false, error: 'Failed to fetch services' };
        }
      } catch (error) {
        return { success: false, error: 'Failed to fetch services' };
      }
    };

    const value = {
      user,
      loading,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      createBooking,
      getBookingHistory,
      getBookingStats,
      cancelBooking,
      getServices,
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };