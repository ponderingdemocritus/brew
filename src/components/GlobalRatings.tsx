import React, { useState, useEffect } from "react";
import { Star, Coffee, Droplet, MessageCircle, Search } from "lucide-react";
import { UIBeanRating } from "../lib/types";

// Extend UIBeanRating to include a clientId for unique keys
interface UIBeanRatingWithClientId extends UIBeanRating {
  clientId?: string;
}
import {
  getGlobalBeanRatings,
  searchGlobalBeanRatings,
} from "../services/beanRatingService";
import StarRating from "./StarRating";
import RatingComments from "./RatingComments";

const GlobalRatings: React.FC = () => {
  const [ratings, setRatings] = useState<UIBeanRatingWithClientId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRatingId, setExpandedRatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  const fetchRatings = async (reset = false) => {
    if (reset) {
      setPage(0);
      setRatings([]);
    }

    setLoading(true);
    try {
      const data = await getGlobalBeanRatings(LIMIT, reset ? 0 : page * LIMIT);

      // Ensure each rating has a unique clientId if it doesn't already have one
      const processedData = data.map((rating) => {
        if (!rating.id) {
          return {
            ...rating,
            clientId: `${rating.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
        }
        return rating;
      });

      if (reset) {
        setRatings(processedData);
      } else {
        // Check for duplicates before adding new ratings
        const existingIds = new Set(ratings.map((r) => r.id));
        const newRatings = processedData.filter(
          (rating) => !existingIds.has(rating.id)
        );
        setRatings((prev) => [...prev, ...newRatings]);
      }

      setHasMore(data.length === LIMIT);
      setPage((prev) => (reset ? 1 : prev + 1));
    } catch (err: any) {
      console.error("Error fetching global ratings:", err);
      setError("Failed to load ratings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRatings(true);
      return;
    }

    setSearching(true);
    setLoading(true);
    try {
      const data = await searchGlobalBeanRatings(searchQuery);

      // Ensure each rating has a unique clientId
      const processedData = data.map((rating) => ({
        ...rating,
        clientId: `${rating.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      setRatings(processedData);
      setHasMore(false); // No pagination for search results
    } catch (err: any) {
      console.error("Error searching ratings:", err);
      setError("Failed to search ratings. Please try again.");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedRatingId(expandedRatingId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2
          className="text-xl md:text-2xl text-[#3c3027] mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Global Coffee Ratings
        </h2>
        <p className="text-gray-600 mb-4">
          Discover and discuss coffee beans rated by the community
        </p>

        <div className="relative mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for beans or tasting notes..."
                className="w-full p-3 pl-10 border border-gray-200 rounded-l-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-hipster px-4 rounded-l-none"
              disabled={searching}
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                fetchRatings(true);
              }}
              className="text-sm text-[#8c7851] hover:underline mt-2"
            >
              Clear search and show all ratings
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {ratings.length === 0 && !loading ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Star size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No ratings found</p>
          {searchQuery && (
            <p className="text-gray-500 text-sm mb-4">
              Try a different search term or clear the search
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ratings.map((rating) => (
            <div
              key={
                rating.clientId ||
                `${rating.id}-${Math.random().toString(36).substr(2, 9)}`
              }
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden card-border"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
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
                  <div className="text-right text-xs text-gray-500">
                    <div className="flex items-center justify-end mb-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                        {rating.user_avatar ? (
                          <img
                            src={rating.user_avatar}
                            alt={rating.user_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">
                            {rating.user_name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span>{rating.user_name}</span>
                    </div>
                    <div>
                      {rating.created_at && formatDate(rating.created_at)}
                    </div>
                  </div>
                </div>

                {rating.notes && (
                  <div className="mt-3 text-gray-700 text-sm">
                    <p>{rating.notes}</p>
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <MessageCircle size={14} className="mr-1" />
                      <span>{rating.comment_count || 0} comments</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(rating.id)}
                    className="text-xs text-[#8c7851] hover:underline"
                  >
                    {expandedRatingId === rating.id
                      ? "Hide comments"
                      : "View comments"}
                  </button>
                </div>
              </div>

              {expandedRatingId === rating.id && (
                <RatingComments ratingId={rating.id} />
              )}
            </div>
          ))}
        </div>
      )}

      {hasMore && !searchQuery && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchRatings()}
            className="btn-hipster-outline"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalRatings;
