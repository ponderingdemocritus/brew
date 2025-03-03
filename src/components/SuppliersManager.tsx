import React, { useState, useEffect } from "react";
import { Store, Edit, Trash2, Plus, Globe, MapPin } from "lucide-react";
import { Supplier } from "../lib/types";
import { getSuppliers, deleteSupplier } from "../services/supplierService";
import SupplierForm from "./SupplierForm";

interface UISuppplier extends Supplier {
  expanded?: boolean;
}

const SuppliersManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState<UISuppplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<UISuppplier | null>(
    null
  );

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data.map((supplier) => ({ ...supplier, expanded: false })));
      setError(null);
    } catch (err) {
      setError("Failed to load suppliers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier: UISuppplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDeleteSupplier = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(id);
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      } catch (err) {
        setError("Failed to delete supplier. Please try again.");
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchSuppliers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const toggleExpand = (id: string) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id
          ? { ...supplier, expanded: !supplier.expanded }
          : supplier
      )
    );
  };

  if (loading && suppliers.length === 0) {
    return <div className="text-center py-8">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {suppliers.length} Suppliers
        </h2>
        <button
          onClick={handleAddSupplier}
          className="flex items-center gap-2 bg-[#8c7851] text-white px-4 py-2 rounded hover:bg-[#7a6a47] transition-colors"
        >
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <SupplierForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            editingSupplier={editingSupplier}
          />
        </div>
      )}

      {suppliers.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No suppliers found. Add your first supplier to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Store size={18} className="text-[#8c7851]" />
                    {supplier.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {supplier.website && (
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {supplier.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  {supplier.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{supplier.location}</span>
                    </div>
                  )}
                </div>

                {supplier.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {supplier.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuppliersManager;
