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
import { CoffeeExtraction } from "./lib/supabase";
import {
  getExtractions,
  addExtraction,
  updateExtraction,
  deleteExtraction,
} from "./services/extractionService";
import { getSession } from "./services/authService";
import Auth from "./components/Auth";

// Types
// Using the CoffeeExtraction type from supabase.ts
// Adding a UI-specific property
interface UIExtraction extends CoffeeExtraction {
  expanded?: boolean;
}

function App() {
  const [extractions, setExtractions] = useState<UIExtraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [formData, setFormData] = useState<
    Omit<CoffeeExtraction, "id" | "created_at" | "user_id">
  >({
    date: new Date().toISOString(),
    bean_name: "",
    bean_price: 0,
    coffee_weight: 18,
    water_weight: 36,
    grind_size: "Medium",
    brew_time: "00:30",
    temperature: 93,
    rating: 3,
    notes: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        setAuthenticated(!!session);
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Fetch extractions from Supabase when authenticated
  useEffect(() => {
    if (authenticated) {
      const fetchExtractions = async () => {
        try {
          setLoading(true);
          const data = await getExtractions();
          setExtractions(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching extractions:", err);
          setError(
            "Failed to load coffee extractions. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchExtractions();
    }
  }, [authenticated]);

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
        name === "coffee_weight" ||
        name === "water_weight" ||
        name === "temperature" ||
        name === "rating" ||
        name === "bean_price"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing extraction
        const updatedExtraction = await updateExtraction({
          id: editingId,
          ...formData,
        });

        setExtractions((prev) =>
          prev.map((extraction) =>
            extraction.id === editingId
              ? { ...updatedExtraction, expanded: extraction.expanded }
              : extraction
          )
        );
        setEditingId(null);
      } else {
        // Add new extraction
        const newExtraction = await addExtraction({
          ...formData,
          date: new Date().toISOString(),
        });

        setExtractions((prev) => [newExtraction, ...prev]);
      }

      resetForm();
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error("Error saving extraction:", err);
      setError("Failed to save coffee extraction. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString(),
      bean_name: "",
      bean_price: 0,
      coffee_weight: 18,
      water_weight: 36,
      grind_size: "Medium",
      brew_time: "00:30",
      temperature: 93,
      rating: 3,
      notes: "",
    });
  };

  const handleEdit = (extraction: UIExtraction) => {
    setFormData({
      date: extraction.date,
      bean_name: extraction.bean_name,
      bean_price: extraction.bean_price,
      coffee_weight: extraction.coffee_weight,
      water_weight: extraction.water_weight,
      grind_size: extraction.grind_size,
      brew_time: extraction.brew_time,
      temperature: extraction.temperature,
      rating: extraction.rating,
      notes: extraction.notes,
    });
    setEditingId(extraction.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExtraction(id);
      setExtractions((prev) =>
        prev.filter((extraction) => extraction.id !== id)
      );
      setError(null);
    } catch (err) {
      console.error("Error deleting extraction:", err);
      setError("Failed to delete coffee extraction. Please try again.");
    }
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
    <div>
      <main className="container mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="flex items-center">
              <X className="mr-2" size={18} />
              {error}
            </p>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-8 card-border animate-fadeIn">
            <h2
              className="text-xl md:text-2xl mb-6 text-[#3c3027]"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 form-grid">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bean Name
                    </label>
                    <div className="relative">
                      <CoffeeIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        name="bean_name"
                        value={formData.bean_name}
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
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        type="number"
                        name="bean_price"
                        value={formData.bean_price}
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="number"
                      name="coffee_weight"
                      value={formData.coffee_weight}
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="number"
                      name="water_weight"
                      value={formData.water_weight}
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
                    name="grind_size"
                    value={formData.grind_size}
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
                      size={18}
                      strokeWidth={1.5}
                    />
                    <input
                      type="text"
                      name="brew_time"
                      value={formData.brew_time}
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
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8c7851] z-20"
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

        <div className="mt-8">
          <h2
            className="text-xl md:text-2xl font-bold mb-6 text-[#3c3027]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Extractions
          </h2>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c7851]"></div>
            </div>
          ) : extractions.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <Coffee
                className="mx-auto mb-4 text-[#8c7851]"
                size={48}
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-medium text-[#3c3027] mb-2">
                No extractions yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding your first coffee extraction using the "New
                Extraction" button.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-hipster inline-flex items-center"
              >
                <Plus className="mr-2" size={18} /> New Extraction
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 extraction-grid">
              {extractions.map((extraction) => (
                <div
                  key={extraction.id}
                  className="bg-[#f8f5f0] rounded-lg overflow-hidden card-border extraction-card"
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
                        {extraction.bean_name ? (
                          <>
                            <span className="mr-2">{extraction.bean_name}</span>
                            <span className="text-sm text-[#8c7851]">
                              ({formatDate(extraction.date)})
                            </span>
                          </>
                        ) : (
                          formatDate(extraction.date)
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center flex-wrap">
                        {extraction.bean_price > 0 && (
                          <span className="badge-hipster mr-2 mb-1">
                            <DollarSign
                              size={14}
                              className="inline mr-1"
                              strokeWidth={1.5}
                            />{" "}
                            {formatPrice(extraction.bean_price)}
                          </span>
                        )}
                        <span className="badge-hipster mr-2 mb-1">
                          <Scale
                            size={14}
                            className="inline mr-1"
                            strokeWidth={1.5}
                          />{" "}
                          {extraction.coffee_weight}g
                        </span>
                        <span className="badge-hipster mr-2 mb-1">
                          <Droplets
                            size={14}
                            className="inline mr-1"
                            strokeWidth={1.5}
                          />{" "}
                          {extraction.water_weight}g
                        </span>
                        <span className="badge-hipster mb-1">
                          1:
                          {calculateRatio(
                            extraction.coffee_weight,
                            extraction.water_weight
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
                    <div className="p-4 md:p-5 bg-white animate-fadeIn">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-5 extraction-details">
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
                            {extraction.grind_size}
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
                            {extraction.brew_time}
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
                              extraction.coffee_weight,
                              extraction.water_weight
                            )}
                          </div>
                        </div>
                      </div>

                      {extraction.notes && (
                        <div className="bg-[#f8f5f0] p-3 rounded-md mb-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Notes
                          </div>
                          <div className="text-[#3c3027] text-sm whitespace-pre-wrap">
                            {extraction.notes}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 mt-4 btn-group">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(extraction);
                          }}
                          className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 btn-hipster-outline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(extraction.id);
                          }}
                          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 btn-hipster"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
