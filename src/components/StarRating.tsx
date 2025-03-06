import React, { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  color = "#8c7851",
  emptyColor = "#d3c5a9",
  onChange,
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset hover state when rating changes externally
  useEffect(() => {
    setHoverRating(null);
  }, [rating]);

  // Handle click on a star
  const handleClick = (index: number) => {
    if (readOnly || !onChange) return;

    // If clicking the same star that's already selected, decrease by 0.5
    // Otherwise, set to the clicked star value
    if (Math.ceil(rating) === index + 1 && rating % 1 === 0) {
      onChange(index + 0.5);
    } else {
      onChange(index + 1);
    }
  };

  // Handle precise click position for half-star ratings
  const handlePreciseClick = (e: React.MouseEvent, index: number) => {
    if (readOnly || !onChange) return;

    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;

    // If clicked on the left half of the star
    if (position <= 0.5) {
      // If already at this half-star value, toggle to zero
      if (Math.abs(rating - (index + 0.5)) < 0.1) {
        onChange(0);
      } else {
        onChange(index + 0.5);
      }
    } else {
      // If already at this full-star value, toggle to zero
      if (Math.abs(rating - (index + 1)) < 0.1) {
        onChange(0);
      } else {
        onChange(index + 1);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly || !onChange) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly || !onChange) return;
    setHoverRating(null);
  };

  // Determine the display rating (hover rating takes precedence over actual rating)
  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div
      className="flex"
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      data-testid="star-rating"
      data-rating={rating}
    >
      {[...Array(maxRating)].map((_, index) => {
        // Determine if this star should be filled, half-filled, or empty
        const isFilled = index < Math.floor(displayRating);
        const isHalfFilled =
          !isFilled && index < displayRating && displayRating % 1 !== 0;

        return (
          <div
            key={index}
            className={`
              ${!readOnly ? "cursor-pointer" : ""}
              transition-all duration-150
              ${!readOnly ? "hover:scale-110" : ""}
              relative
            `}
            onClick={(e) => handlePreciseClick(e, index)}
            onMouseEnter={() => handleMouseEnter(index)}
            data-index={index}
            data-testid={`star-${index}`}
          >
            <Star
              size={size}
              fill={
                isFilled
                  ? color
                  : isHalfFilled
                    ? "url(#halfFill)"
                    : "transparent"
              }
              stroke={isFilled || isHalfFilled ? color : emptyColor}
              strokeWidth={1.5}
            />

            {/* Invisible overlay for better click detection */}
            {!readOnly && (
              <div className="absolute inset-0 flex">
                <div
                  className="w-1/2 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // If already at this half-star value, toggle to zero
                    if (Math.abs(rating - (index + 0.5)) < 0.1) {
                      onChange?.(0);
                    } else {
                      onChange?.(index + 0.5);
                    }
                  }}
                />
                <div
                  className="w-1/2 h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // If already at this full-star value, toggle to zero
                    if (Math.abs(rating - (index + 1)) < 0.1) {
                      onChange?.(0);
                    } else {
                      onChange?.(index + 1);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* SVG definition for half-filled stars */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default StarRating;
