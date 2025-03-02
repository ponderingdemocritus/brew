import React, { useState, useEffect } from "react";
import {
  Coffee,
  Timer,
  Droplets,
  Scale,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Award,
  DollarSign,
  CoffeeIcon,
} from "lucide-react";
import "./App.css";

// Types
interface CoffeeExtraction {
  id: string;
  date: string;
  beanName: string;
  beanPrice: number;
  coffeeWeight: number;
  waterWeight: number;
  grindSize: string;
  brewTime: string;
  temperature: number;
  rating: number;
  notes: string;
  expanded?: boolean;
}

function App() {
  const [extractions, setExtractions] = useState<CoffeeExtraction[]>(() => {
    const saved = localStorage.getItem("coffeeExtractions");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<
    Omit<CoffeeExtraction, "id" | "date">
  >({
    beanName: "",
    beanPrice: 0,
    coffeeWeight: 18,
    waterWeight: 36,
    grindSize: "Medium",
    brewTime: "00:30",
    temperature: 93,
    rating: 3,
    notes: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Save to localStorage whenever extractions change
  useEffect(() => {
    localStorage.setItem("coffeeExtractions", JSON.stringify(extractions));
  }, [extractions]);

  // Add Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Apply fonts to body
    document.body.style.fontFamily = "'Work Sans', sans-serif";

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "coffeeWeight" ||
        name === "waterWeight" ||
        name === "temperature" ||
        name === "rating" ||
        name === "beanPrice"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setExtractions((prev) =>
        prev.map((extraction) =>
          extraction.id === editingId
            ? { ...extraction, ...formData }
            : extraction
        )
      );
      setEditingId(null);
    } else {
      const newExtraction: CoffeeExtraction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...formData,
      };
      setExtractions((prev) => [newExtraction, ...prev]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      beanName: "",
      beanPrice: 0,
      coffeeWeight: 18,
      waterWeight: 36,
      grindSize: "Medium",
      brewTime: "00:30",
      temperature: 93,
      rating: 3,
      notes: "",
    });
  };

  const handleEdit = (extraction: CoffeeExtraction) => {
    setFormData({
      beanName: extraction.beanName,
      beanPrice: extraction.beanPrice,
      coffeeWeight: extraction.coffeeWeight,
      waterWeight: extraction.waterWeight,
      grindSize: extraction.grindSize,
      brewTime: extraction.brewTime,
      temperature: extraction.temperature,
      rating: extraction.rating,
      notes: extraction.notes,
    });
    setEditingId(extraction.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setExtractions((prev) => prev.filter((extraction) => extraction.id !== id));
  };

  const toggleExpand = (id: string) => {
    setExtractions((prev) =>
      prev.map((extraction) =>
        extraction.id === id
          ? { ...extraction, expanded: !extraction.expanded }
          : extraction
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateRatio = (coffee: number, water: number) => {
    return (water / coffee).toFixed(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <header className="bg-[#3c3027] text-[#f8f5f0] p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-bold flex items-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Coffee className="mr-3" strokeWidth={1.5} />
            <span>Loafs Brew Journal</span>
            <span className="ml-2 text-sm font-handwritten font-normal text-[#d3c5a9] mt-1">
              est. 2025
            </span>
          </h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) {
                setEditingId(null);
                resetForm();
              }
            }}
            className="bg-[#8c7851] hover:bg-[#6a5c3d] text-white px-5 py-2 rounded-md flex items-center transition-colors"
          >
            {showForm ? (
              <X className="mr-2" size={18} />
            ) : (
              <Plus className="mr-2" size={18} />
            )}
            {showForm ? "Cancel" : "New Extraction"}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 card-border animate-fadeIn">
            <h2
              className="text-2xl mb-6 text-[#3c3027]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {editingId ? "Edit Extraction" : "New Extraction"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6 border-b border-[#e5e1d9] pb-6">
                <h3
                  className="text-lg mb-4 text-[#3c3027]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Bean Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bean Name
                    </label>
                    <div className="relative">
                      <CoffeeIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        name="beanName"
                        value={formData.beanName}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                        placeholder="Ethiopia Yirgacheffe, etc."
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bean Price (per lb/kg)
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        type="number"
                        name="beanPrice"
                        value={formData.beanPrice}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coffee Weight (g)
                  </label>
                  <div className="relative">
                    <Scale
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="number"
                      name="coffeeWeight"
                      value={formData.coffeeWeight}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Weight (g)
                  </label>
                  <div className="relative">
                    <Droplets
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="number"
                      name="waterWeight"
                      value={formData.waterWeight}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grind Size
                  </label>
                  <select
                    name="grindSize"
                    value={formData.grindSize}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                    required
                  >
                    <option value="Extra Fine">Extra Fine</option>
                    <option value="Fine">Fine</option>
                    <option value="Medium-Fine">Medium-Fine</option>
                    <option value="Medium">Medium</option>
                    <option value="Medium-Coarse">Medium-Coarse</option>
                    <option value="Coarse">Coarse</option>
                    <option value="Extra Coarse">Extra Coarse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brew Time (mm:ss)
                  </label>
                  <div className="relative">
                    <Timer
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      name="brewTime"
                      value={formData.brewTime}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                      placeholder="00:30"
                      pattern="[0-9]{1,2}:[0-9]{2}"
                      title="Format: mm:ss (e.g. 1:30)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Temperature (°C)
                  </label>
                  <div className="relative">
                    <Thermometer
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851]"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <div className="flex items-center">
                    <Award
                      className="mr-2 text-[#8c7851]"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="range"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-[#e5e1d9] rounded-lg appearance-none cursor-pointer"
                      min="1"
                      max="5"
                      step="1"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                  rows={3}
                  placeholder="Flavor notes, body, acidity, sweetness, etc."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="mr-3 px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 btn-hipster-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8c7851] text-white rounded-md hover:bg-[#6a5c3d] flex items-center btn-hipster"
                >
                  <Save className="mr-2" size={18} strokeWidth={1.5} />
                  {editingId ? "Update" : "Save"} Extraction
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 card-border">
          <h2
            className="text-2xl mb-6 text-[#3c3027]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Extractions
          </h2>

          {extractions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-[#f5f3ef] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee
                  className="text-[#8c7851]"
                  size={48}
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-lg">No extractions recorded yet.</p>
              <p className="text-sm mt-2">
                Start by adding your first coffee extraction!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {extractions.map((extraction) => (
                <div
                  key={extraction.id}
                  className="border border-[#e5e1d9] rounded-lg overflow-hidden card-border"
                >
                  <div
                    className="bg-[#f5f3ef] p-5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(extraction.id)}
                  >
                    <div>
                      <div
                        className="font-medium text-[#3c3027] flex items-center"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {extraction.beanName ? (
                          <>
                            <span className="mr-2">{extraction.beanName}</span>
                            <span className="text-sm text-[#8c7851]">
                              ({formatDate(extraction.date)})
                            </span>
                          </>
                        ) : (
                          formatDate(extraction.date)
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center flex-wrap">
                        {extraction.beanPrice > 0 && (
                          <span className="badge-hipster mr-2 mb-1">
                            <DollarSign
                              size={14}
                              className="inline mr-1"
                              strokeWidth={1.5}
                            />{" "}
                            {formatPrice(extraction.beanPrice)}
                          </span>
                        )}
                        <span className="badge-hipster mr-2 mb-1">
                          <Scale
                            size={14}
                            className="inline mr-1"
                            strokeWidth={1.5}
                          />{" "}
                          {extraction.coffeeWeight}g
                        </span>
                        <span className="badge-hipster mr-2 mb-1">
                          <Droplets
                            size={14}
                            className="inline mr-1"
                            strokeWidth={1.5}
                          />{" "}
                          {extraction.waterWeight}g
                        </span>
                        <span className="badge-hipster mb-1">
                          1:
                          {calculateRatio(
                            extraction.coffeeWeight,
                            extraction.waterWeight
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 flex star-rating">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < extraction.rating ? "star-rating-filled" : ""
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <button
                        className="p-2 text-gray-500 hover:text-[#8c7851] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(extraction);
                        }}
                      >
                        <Edit size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(extraction.id);
                        }}
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                      {extraction.expanded ? (
                        <ChevronUp
                          size={18}
                          className="text-[#8c7851] ml-1"
                          strokeWidth={1.5}
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          className="text-[#8c7851] ml-1"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                  </div>

                  {extraction.expanded && (
                    <div className="p-5 bg-white animate-fadeIn">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                        <div className="bg-[#f8f5f0] p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">
                            Grind Size
                          </div>
                          <div className="font-medium text-[#3c3027] flex items-center">
                            <Coffee
                              size={16}
                              className="mr-2 text-[#8c7851]"
                              strokeWidth={1.5}
                            />
                            {extraction.grindSize}
                          </div>
                        </div>
                        <div className="bg-[#f8f5f0] p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">
                            Brew Time
                          </div>
                          <div className="font-medium text-[#3c3027] flex items-center">
                            <Timer
                              size={16}
                              className="mr-2 text-[#8c7851]"
                              strokeWidth={1.5}
                            />
                            {extraction.brewTime}
                          </div>
                        </div>
                        <div className="bg-[#f8f5f0] p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">
                            Temperature
                          </div>
                          <div className="font-medium text-[#3c3027] flex items-center">
                            <Thermometer
                              size={16}
                              className="mr-2 text-[#8c7851]"
                              strokeWidth={1.5}
                            />
                            {extraction.temperature}°C
                          </div>
                        </div>
                        <div className="bg-[#f8f5f0] p-3 rounded-md">
                          <div className="text-xs text-gray-500 mb-1">
                            Ratio
                          </div>
                          <div className="font-medium text-[#3c3027] flex items-center">
                            <Scale
                              size={16}
                              className="mr-2 text-[#8c7851]"
                              strokeWidth={1.5}
                            />
                            1:
                            {calculateRatio(
                              extraction.coffeeWeight,
                              extraction.waterWeight
                            )}
                          </div>
                        </div>
                      </div>

                      {extraction.notes && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Tasting Notes
                          </div>
                          <div className="bg-[#f8f5f0] p-4 rounded-md text-gray-700 font-handwritten text-lg">
                            {extraction.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#3c3027] text-[#f8f5f0] p-4 mt-12">
        <div className="container mx-auto text-center text-sm">
          <p className="font-handwritten text-lg mb-1">Loafs Brew Journal</p>
          <p className="text-[#d3c5a9]">
            Track your coffee journey, one extraction at a time
          </p>
          <p className="text-[#d3c5a9] mt-2 text-xs">
            Generated entirely with vibes
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
