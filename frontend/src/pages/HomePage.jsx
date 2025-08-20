import React from "react";
import {
  Settings,
  Home,
  Wrench,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Button from "../components/common/Button";

const HomePage = ({ setCurrentPage }) => {
  const featuredServices = [
    { name: "AC Repair", icon: Settings, price: 89 },
    { name: "House Cleaning", icon: Home, price: 75 },
    { name: "Plumbing", icon: Wrench, price: 95 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Household Services
            </h1>
            <p className="text-xl mb-8">
              Book trusted professionals for all your home service needs
            </p>
            <div className="space-x-4">
              <Button
                variant="secondary"
                size="large"
                onClick={() => setCurrentPage("services")}
              >
                Browse Services
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => setCurrentPage("booking")}
                className="border-white text-white hover:bg-white hover:!text-blue-600"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose ServiceHub?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Verified Professionals
            </h3>
            <p className="text-gray-600">
              All our service providers are background-checked and verified
            </p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
            <p className="text-gray-600">
              Book services anytime, get help when you need it
            </p>
          </div>
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
            <p className="text-gray-600">
              Transparent pricing with no hidden fees
            </p>
          </div>
        </div>

        {/* Featured Services */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular Services</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.name}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <service.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                Starting at ${service.price}
              </p>
              <Button onClick={() => setCurrentPage("services")}>
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
