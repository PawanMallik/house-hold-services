import React from 'react';
import { Home, Wrench, Calendar, Settings, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'booking', label: 'Booking', icon: Calendar },
    ...(isAuthenticated ? [{ id: 'dashboard', label: 'Dashboard', icon: Settings }] : [])
  ];

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Wrench className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">ServiceHub</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  <span>Welcome, {user?.fullName}</span>
                </div>
                <Button variant="outline" size="small" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="small" onClick={() => setCurrentPage('login')}>
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Button>
                <Button size="small" onClick={() => setCurrentPage('register')}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Register
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
