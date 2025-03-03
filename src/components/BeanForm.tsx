import React, { useState, useEffect } from "react";
import { Coffee, Globe, DollarSign, FileText, Save, X } from "lucide-react";
import { Bean, Supplier } from "../lib/types";
import { addBean, updateBean } from "../services/beanService";
import { getSuppliers } from "../services/supplierService";

interface BeanFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingBean?: Bean | null;
  supplierId?: string;
}

const BeanForm: React.FC<BeanFormProps> = ({
  onSuccess,
  onCancel,
  editingBean = null,
  supplierId,
}) => {
  const [formData, setFormData] = useState<
    Omit<Bean, "id" | "created_at" | "user_id">
  >({
    supplier_id: supplierId || "",
    name: "",
    origin: "",
    process: "",
    roast_level: "",
    price: 0,
    purchase_url: "",
    notes: "",
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError("Failed to load suppliers. Please try again.");
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (editingBean) {
      setFormData({
        supplier_id: editingBean.supplier_id,
        name: editingBean.name,
        origin: editingBean.origin || "",
        process: editingBean.process || "",
        roast_level: editingBean.roast_level || "",
        price: editingBean.price || 0,
        purchase_url: editingBean.purchase_url || "",
        notes: editingBean.notes || "",
      });
    } else if (supplierId) {
      setFormData((prev) => ({
        ...prev,
        supplier_id: supplierId,
      }));
    }
  }, [editingBean, supplierId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingBean) {
        await updateBean({
          id: editingBean.id,
          ...formData,
        });
      } else {
        await addBean(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Error saving bean:", err);
      setError(err.message || "Failed to save bean. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roastLevels = [
    "Light",
    "Medium-Light",
    "Medium",
    "Medium-Dark",
    "Dark",
  ];

  const processMethods = [
    "Washed",
    "Natural",
    "Honey",
    "Anaerobic",
    "Wet-Hulled",
    "Other",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-8 card-border animate-fadeIn">
      <h2
        className="text-xl md:text-2xl mb-6 text-[#3c3027]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {editingBean ? "Edit Coffee Bean" : "Add New Coffee Bean"}
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
              Supplier
            </label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              required
              disabled={!!supplierId}
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bean Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Coffee size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="Ethiopia Yirgacheffe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origin
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              placeholder="Country, Region"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Method
            </label>
            <select
              name="process"
              value={formData.process}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
            >
              <option value="">Select process method</option>
              {processMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roast Level
            </label>
            <select
              name="roast_level"
              value={formData.roast_level}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
            >
              <option value="">Select roast level</option>
              {roastLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                name="purchase_url"
                value={formData.purchase_url}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                placeholder="https://example.com/product"
              />
            </div>
          </div>

          <div className="md:col-span-2">
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
                placeholder="Additional information about the bean..."
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

export default BeanForm;
