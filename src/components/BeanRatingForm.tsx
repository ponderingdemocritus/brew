import React, { useState, useEffect } from "react";
import { Save, X, Coffee, Droplet } from "lucide-react";
import { BeanRating, BrewMethod, UIBean } from "../lib/types";
import { addBeanRating, updateBeanRating } from "../services/beanRatingService";
import { getBeans } from "../services/beanService";
import { getBrewMethods } from "../services/brewMethodService";
import StarRating from "./StarRating";

interface BeanRatingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingRating?: BeanRating | null;
  beanId?: string;
}

// Define a type for our form data that ensures all rating fields are numbers
type BeanRatingFormData = {
  bean_id: string;
  brew_method_id: string;
  rating: number;
  aroma: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  body: number;
  balance: number;
  notes: string;
};

const BeanRatingForm: React.FC<BeanRatingFormProps> = ({
  onSuccess,
  onCancel,
  editingRating = null,
  beanId,
}) => {
  const [formData, setFormData] = useState<BeanRatingFormData>({
    bean_id: beanId || "",
    brew_method_id: "",
    rating: 0,
    aroma: 0,
    flavor: 0,
    aftertaste: 0,
    acidity: 0,
    body: 0,
    balance: 0,
    notes: "",
  });

  const [beans, setBeans] = useState<UIBean[]>([]);
  const [brewMethods, setBrewMethods] = useState<BrewMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beansData, brewMethodsData] = await Promise.all([
          getBeans(),
          getBrewMethods(),
        ]);
        setBeans(beansData);
        setBrewMethods(brewMethodsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingRating) {
      setFormData({
        bean_id: editingRating.bean_id,
        brew_method_id: editingRating.brew_method_id,
        rating: editingRating.rating,
        aroma: editingRating.aroma || 0,
        flavor: editingRating.flavor || 0,
        aftertaste: editingRating.aftertaste || 0,
        acidity: editingRating.acidity || 0,
        body: editingRating.body || 0,
        balance: editingRating.balance || 0,
        notes: editingRating.notes || "",
      });
    } else if (beanId) {
      setFormData((prev) => ({
        ...prev,
        bean_id: beanId,
      }));
    }
  }, [editingRating, beanId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "notes" ? value : parseFloat(value) || 0,
    }));
  };

  const handleRatingChange = (name: string) => (value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingRating) {
        await updateBeanRating({
          id: editingRating.id,
          ...formData,
        });
      } else {
        await addBeanRating(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Error saving rating:", err);
      setError(err.message || "Failed to save rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-8 card-border animate-fadeIn">
      <h2
        className="text-xl md:text-2xl mb-6 text-[#3c3027]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {editingRating ? "Edit Coffee Rating" : "Rate Coffee Bean"}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coffee Bean
            </label>
            <select
              name="bean_id"
              value={formData.bean_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              required
              disabled={!!beanId}
            >
              <option value="">Select a coffee bean</option>
              {beans.map((bean) => (
                <option key={bean.id} value={bean.id}>
                  {bean.name}{" "}
                  {bean.supplier_name ? `(${bean.supplier_name})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brew Method
            </label>
            <select
              name="brew_method_id"
              value={formData.brew_method_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              required
            >
              <option value="">Select a brew method</option>
              {brewMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.rating}
                onChange={handleRatingChange("rating")}
                size={32}
              />
              <span className="ml-2 text-lg">{formData.rating.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aroma
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.aroma}
                onChange={handleRatingChange("aroma")}
              />
              <span className="ml-2">{formData.aroma.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flavor
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.flavor}
                onChange={handleRatingChange("flavor")}
              />
              <span className="ml-2">{formData.flavor.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aftertaste
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.aftertaste}
                onChange={handleRatingChange("aftertaste")}
              />
              <span className="ml-2">{formData.aftertaste.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acidity
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.acidity}
                onChange={handleRatingChange("acidity")}
              />
              <span className="ml-2">{formData.acidity.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.body}
                onChange={handleRatingChange("body")}
              />
              <span className="ml-2">{formData.body.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balance
            </label>
            <div className="flex items-center">
              <StarRating
                rating={formData.balance}
                onChange={handleRatingChange("balance")}
              />
              <span className="ml-2">{formData.balance.toFixed(1)}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              placeholder="Tasting notes, impressions, etc."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-hipster-outline flex items-center"
            disabled={loading}
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
          <button
            type="submit"
            className="btn-hipster flex items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="mr-2" size={18} /> Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeanRatingForm;
