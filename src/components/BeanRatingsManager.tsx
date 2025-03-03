import React, { useState, useEffect } from "react";
import { Star, Edit, Trash2, Plus, Coffee, Droplet } from "lucide-react";
import { UIBeanRating } from "../lib/types";
import {
  getBeanRatings,
  deleteBeanRating,
} from "../services/beanRatingService";
import BeanRatingForm from "./BeanRatingForm";
import StarRating from "./StarRating";

interface BeanRatingsManagerProps {
  beanId?: string;
}

const BeanRatingsManager: React.FC<BeanRatingsManagerProps> = ({ beanId }) => {
  const [ratings, setRatings] = useState<UIBeanRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRating, setEditingRating] = useState<UIBeanRating | null>(null);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      let data;
      if (beanId) {
        // If beanId is provided, fetch ratings for that specific bean
        const { getBeanRatingsByBean } = await import(
          "../services/beanRatingService"
        );
        data = await getBeanRatingsByBean(beanId);
      } else {
        // Otherwise, fetch all ratings
        data = await getBeanRatings();
      }
      setRatings(data);
    } catch (err: any) {
      console.error("Error fetching ratings:", err);
      setError("Failed to load ratings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [beanId]);

  const handleAddRating = () => {
    setEditingRating(null);
    setShowForm(true);
  };

  const handleEditRating = (rating: UIBeanRating) => {
    setEditingRating(rating);
    setShowForm(true);
  };

  const handleDeleteRating = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) {
      return;
    }

    try {
      await deleteBeanRating(id);
      setRatings((prev) => prev.filter((rating) => rating.id !== id));
    } catch (err: any) {
      console.error("Error deleting rating:", err);
      alert("Failed to delete rating. Please try again.");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchRatings();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const toggleExpand = (id: string) => {
    setRatings((prev) =>
      prev.map((rating) =>
        rating.id === id ? { ...rating, expanded: !rating.expanded } : rating
      )
    );
  };

  if (showForm) {
    return (
      <BeanRatingForm
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        editingRating={editingRating}
        beanId={beanId}
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
          {beanId ? "Bean Ratings" : "All Coffee Ratings"}
        </h2>
        <button
          onClick={handleAddRating}
          className="btn-hipster flex items-center"
        >
          <Plus size={18} className="mr-2" /> Add Rating
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
      ) : ratings.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Star size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No ratings found</p>
          <button
            onClick={handleAddRating}
            className="btn-hipster-outline flex items-center mx-auto"
          >
            <Plus size={18} className="mr-2" /> Add Your First Rating
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden card-border"
            >
              <div
                className="p-4 flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(rating.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <Coffee
                      size={18}
                      className="text-[#8c7851] mr-2"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-medium text-[#3c3027]">
                      {rating.bean_name || "Unknown Bean"}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <Droplet
                      size={14}
                      className="inline-block mr-1"
                      strokeWidth={1.5}
                    />
                    {rating.brew_method_name || "Unknown Method"}
                  </div>
                  <div className="mt-2 flex items-center">
                    <StarRating rating={rating.rating} readOnly size={16} />
                    <span className="ml-2 text-sm text-gray-600">
                      {rating.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRating(rating);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit rating"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRating(rating.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete rating"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {rating.expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500">Aroma:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.aroma || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.aroma?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Flavor:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.flavor || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.flavor?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Aftertaste:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.aftertaste || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.aftertaste?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Acidity:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.acidity || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.acidity?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Body:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.body || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.body?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Balance:</span>
                      <div className="flex items-center">
                        <StarRating
                          rating={rating.balance || 0}
                          readOnly
                          size={14}
                        />
                        <span className="ml-1 text-sm">
                          {rating.balance?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {rating.notes && (
                    <div>
                      <span className="text-xs text-gray-500">Notes:</span>
                      <p className="text-sm whitespace-pre-line mt-1">
                        {rating.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeanRatingsManager;
