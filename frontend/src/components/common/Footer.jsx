import React from 'react';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Wrench className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-lg font-bold">ServiceHub</span>
            </div>
            <p className="text-gray-400">Your trusted partner for all household services. Quality work, reliable professionals.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(+91) 1234567890</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@servicehub.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Uttarakhand (Udham singh nagar) 263160</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-gray-400">
              <div>About Us</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Support</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ServiceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;