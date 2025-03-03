import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Star, Users, BarChart2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const features = [
    {
      id: "beans",
      title: "Coffee Beans",
      description: "Manage your coffee bean inventory and details.",
      icon: <Coffee size={28} className="text-[#8c7851]" />,
      link: "/beans",
      color: "bg-amber-50",
    },
    {
      id: "ratings",
      title: "Bean Ratings",
      description: "Rate and review your coffee beans.",
      icon: <Star size={28} className="text-[#8c7851]" />,
      link: "/ratings",
      color: "bg-yellow-50",
    },
    {
      id: "suppliers",
      title: "Suppliers",
      description: "Keep track of your coffee suppliers.",
      icon: <Users size={28} className="text-[#8c7851]" />,
      link: "/suppliers",
      color: "bg-green-50",
    },
    {
      id: "extractions",
      title: "Extractions",
      description: "Log and track your coffee extractions.",
      icon: <BarChart2 size={28} className="text-[#8c7851]" />,
      link: "/extractions",
      color: "bg-blue-50",
    },
  ];

  return (
    <div>
      {/* Hero Section - Enhanced with gradient and better spacing */}
      <div className="bg-gradient-to-br from-[#f8f5f0] to-[#efe8dd] rounded-xl shadow-sm p-10 mb-16 mx-4 mt-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#5c4d35] mb-6 tracking-tight">
            Welcome to Coffee Loaf
          </h1>
          <p className="text-xl text-[#8c7851] mb-10 max-w-3xl mx-auto leading-relaxed">
            Your personal coffee companion for tracking beans, ratings,
            suppliers, and extractions all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/beans"
              className="bg-[#8c7851] text-white px-8 py-4 rounded-lg hover:bg-[#7a6a47] transition-colors shadow-md font-medium text-lg flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/extractions"
              className="bg-white text-[#8c7851] border-2 border-[#8c7851] px-8 py-4 rounded-lg hover:bg-[#f5f2ed] transition-colors font-medium text-lg"
            >
              Track Extractions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-4 mb-20">
        {/* Featured Categories Grid */}
        <h2 className="text-3xl font-bold text-[#5c4d35] mb-8 text-center">
          Explore Your Coffee Journey
        </h2>

        {/* Primary Features Grid - 3 columns for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.slice(0, 3).map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className={`${feature.color} rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-[#5c4d35] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
                <div className="mt-6 flex items-center text-[#8c7851] font-medium">
                  Explore <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Feature - Extractions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-semibold text-[#5c4d35] mb-4">
                Track Your Coffee Extractions
              </h3>
              <p className="text-gray-700 mb-6">
                Log and analyze your coffee extractions to perfect your brewing
                technique. Record grind size, brew time, and tasting notes to
                improve your coffee experience.
              </p>
              <Link
                to="/extractions"
                className="inline-flex items-center bg-[#8c7851] text-white px-6 py-3 rounded-lg hover:bg-[#7a6a47] transition-colors shadow-sm"
              >
                View Extractions <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white p-6 rounded-full shadow-md">
                <BarChart2 size={64} className="text-[#8c7851]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
