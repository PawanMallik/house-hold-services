import React, { useState } from 'react';
import { Home, Wrench, Calendar, Settings, LogIn, UserPlus, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

          {/* Desktop Navigation */}
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

          {/* Auth Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-50 px-4 pb-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'text-blue-600 bg-blue-100'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          ))}

          {/* Auth Section (Mobile) */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-md text-sm text-red-600 bg-red-50 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setMobileOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
              <button
                onClick={() => {
                  setCurrentPage('register');
                  setMobileOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
