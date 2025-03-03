import React, { useState } from "react";
import { Coffee, Star, BarChart2, Home, Users, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CoffeeNavigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "home", label: "Home", icon: <Home size={20} />, path: "/" },
    { id: "beans", label: "Beans", icon: <Coffee size={20} />, path: "/beans" },
    {
      id: "ratings",
      label: "Ratings",
      icon: <Star size={20} />,
      path: "/ratings",
    },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: <Users size={20} />,
      path: "/suppliers",
    },
    {
      id: "extractions",
      label: "Extractions",
      icon: <BarChart2 size={20} />,
      path: "/extractions",
    },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 mb-6 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={handleMobileMenuClose}
              className={`flex items-center py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300
                [&.active]:border-[#8c7851] [&.active]:text-[#8c7851]`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-3">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-800">
              Coffee Loaf
            </span>
          </div>
          <button
            onClick={handleMobileMenuToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={handleMobileMenuClose}
                className={`flex items-center w-full px-4 py-3 text-left rounded-md
                  text-gray-600 hover:bg-gray-50
                  [&.active]:bg-[#f5f2ed] [&.active]:text-[#8c7851]`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeNavigation;
