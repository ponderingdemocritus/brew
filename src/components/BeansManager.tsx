import React, { useState, useEffect } from "react";
import { Coffee, Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { UIBean } from "../lib/types";
import { getBeans, deleteBean } from "../services/beanService";
import BeanForm from "./BeanForm";
import StarRating from "./StarRating";
import { getAverageRatingForBean } from "../services/beanRatingService";

interface BeansManagerProps {
  onSelectBean?: (beanId: string) => void;
  showRatings?: boolean;
}

const BeansManager: React.FC<BeansManagerProps> = ({
  onSelectBean,
  showRatings = true,
}) => {
  const [beans, setBeans] = useState<UIBean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBean, setEditingBean] = useState<UIBean | null>(null);
  const [beanRatings, setBeanRatings] = useState<Record<string, number | null>>(
    {}
  );

  const fetchBeans = async () => {
    setLoading(true);
    try {
      const data = await getBeans();
      setBeans(data);

      if (showRatings) {
        // Fetch ratings for each bean
        const ratingsPromises = data.map(async (bean) => {
          const rating = await getAverageRatingForBean(bean.id);
          return { beanId: bean.id, rating };
        });

        const ratings = await Promise.all(ratingsPromises);
        const ratingsMap = ratings.reduce((acc, { beanId, rating }) => {
          acc[beanId] = rating;
          return acc;
        }, {} as Record<string, number | null>);

        setBeanRatings(ratingsMap);
      }
    } catch (err: any) {
      console.error("Error fetching beans:", err);
      setError("Failed to load beans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeans();
  }, [showRatings]);

  const handleAddBean = () => {
    setEditingBean(null);
    setShowForm(true);
  };

  const handleEditBean = (bean: UIBean) => {
    setEditingBean(bean);
    setShowForm(true);
  };

  const handleDeleteBean = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bean?")) {
      return;
    }

    try {
      await deleteBean(id);
      setBeans((prev) => prev.filter((bean) => bean.id !== id));
    } catch (err: any) {
      console.error("Error deleting bean:", err);
      alert("Failed to delete bean. Please try again.");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchBeans();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const toggleExpand = (id: string) => {
    setBeans((prev) =>
      prev.map((bean) =>
        bean.id === id ? { ...bean, expanded: !bean.expanded } : bean
      )
    );
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (showForm) {
    return (
      <BeanForm
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        editingBean={editingBean}
      />
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl md:text-2xl text-[#3c3027]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Coffee Beans
        </h2>
        <button
          onClick={handleAddBean}
          className="btn-hipster flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Bean
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c7851]"></div>
        </div>
      ) : beans.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Coffee size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No coffee beans found</p>
          <button
            onClick={handleAddBean}
            className="btn-hipster-outline flex items-center mx-auto"
          >
            <Plus size={18} className="mr-2" /> Add Your First Bean
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {beans.map((bean) => (
            <div
              key={bean.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden card-border"
            >
              <div
                className="p-4 flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(bean.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <Coffee
                      size={18}
                      className="text-[#8c7851] mr-2"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-medium text-[#3c3027]">{bean.name}</h3>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {bean.supplier_name}
                    {bean.origin && ` • ${bean.origin}`}
                    {bean.roast_level && ` • ${bean.roast_level} Roast`}
                  </div>

                  {showRatings && beanRatings[bean.id] !== undefined && (
                    <div className="mt-2 flex items-center">
                      <StarRating
                        rating={beanRatings[bean.id] || 0}
                        readOnly
                        size={16}
                      />
                      {beanRatings[bean.id] !== null && (
                        <span className="ml-2 text-sm text-gray-600">
                          {beanRatings[bean.id]?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {onSelectBean && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBean(bean.id);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Select this bean"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBean(bean);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit bean"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBean(bean.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete bean"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {bean.expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bean.process && (
                      <div>
                        <span className="text-xs text-gray-500">Process:</span>
                        <p className="text-sm">{bean.process}</p>
                      </div>
                    )}
                    {bean.price !== undefined && bean.price > 0 && (
                      <div>
                        <span className="text-xs text-gray-500">Price:</span>
                        <p className="text-sm">{formatPrice(bean.price)}</p>
                      </div>
                    )}
                    {bean.purchase_url && (
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-500">
                          Purchase URL:
                        </span>
                        <p className="text-sm">
                          <a
                            href={bean.purchase_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            {bean.purchase_url.substring(0, 50)}
                            {bean.purchase_url.length > 50 ? "..." : ""}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        </p>
                      </div>
                    )}
                    {bean.notes && (
                      <div className="md:col-span-2">
                        <span className="text-xs text-gray-500">Notes:</span>
                        <p className="text-sm whitespace-pre-line">
                          {bean.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeansManager;
