import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Star, Users, BarChart2, ArrowRight, Sparkles } from "lucide-react";
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
      {/* Hero Section - Enhanced with glassy effect */}
      <div className="backdrop-blur-md bg-white/40 border border-white/50 rounded-xl shadow-lg p-10 mb-16 mx-4 mt-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5f0]/70 to-[#efe8dd]/70 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#8c7851]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#5c4d35] mb-6 tracking-tight">
            Welcome to <span className="relative inline-block">Coffee Loaf <Sparkles className="absolute -top-6 -right-6 text-amber-400" size={20} /></span>
          </h1>
          <p className="text-xl text-[#8c7851] mb-10 max-w-3xl mx-auto leading-relaxed">
            Your personal coffee companion for tracking beans, ratings,
            suppliers, and extractions all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/beans"
              className="bg-[#8c7851]/90 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-[#7a6a47] transition-all duration-300 shadow-md font-medium text-lg flex items-center justify-center gap-2 border border-white/20"
            >
              Get Started <ArrowRight size={18} />
            </Link>
            <Link
              to="/extractions"
              className="bg-white/60 backdrop-blur-sm text-[#8c7851] border border-[#8c7851]/30 px-8 py-4 rounded-lg hover:bg-white/80 transition-all duration-300 font-medium text-lg shadow-sm"
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
              className={`backdrop-blur-sm bg-white/40 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-white/50 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 ${feature.color}/50 -z-10`}></div>
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-full shadow-sm mb-6 border border-white/50">
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
        <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-md p-8 border border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 -z-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl"></div>
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
                className="inline-flex items-center bg-[#8c7851]/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-[#7a6a47] transition-all duration-300 shadow-sm border border-white/20"
              >
                View Extractions <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-full shadow-md border border-white/50">
                <BarChart2 size={64} className="text-[#8c7851]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
