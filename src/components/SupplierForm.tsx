import React, { useState, useEffect } from "react";
import { Store, Globe, MapPin, FileText, Save, X } from "lucide-react";
import { Supplier } from "../lib/types";
import { addSupplier, updateSupplier } from "../services/supplierService";

interface SupplierFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingSupplier?: Supplier | null;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  onSuccess,
  onCancel,
  editingSupplier = null,
}) => {
  const [formData, setFormData] = useState<
    Omit<Supplier, "id" | "created_at" | "user_id">
  >({
    name: "",
    website: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        website: editingSupplier.website || "",
        location: editingSupplier.location || "",
        notes: editingSupplier.notes || "",
      });
    }
  }, [editingSupplier]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
      if (editingSupplier) {
        await updateSupplier({
          id: editingSupplier.id,
          ...formData,
        });
      } else {
        await addSupplier(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Error saving supplier:", err);
      setError(err.message || "Failed to save supplier. Please try again.");
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
        {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="Coffee Supplier Co."
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText size={18} className="text-gray-400" />
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="Additional information about the supplier..."
                rows={3}
              />
            </div>
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

export default SupplierForm;
