import React from "react";
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
  const handleClick = (index: number) => {
    if (readOnly || !onChange) return;
    onChange(index + 1);
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? color : "transparent"}
          stroke={index < rating ? color : emptyColor}
          className={`
            ${!readOnly ? "cursor-pointer hover:scale-110" : ""}
            transition-all duration-150 star-hover
            ${index < rating ? "star-hover-active" : ""}
          `}
          onClick={() => handleClick(index)}
          onMouseEnter={() => {
            if (readOnly || !onChange) return;
            const stars = document.querySelectorAll(".star-hover");
            for (let i = 0; i <= index; i++) {
              stars[i]?.classList.add("star-hover-active");
            }
            for (let i = index + 1; i < maxRating; i++) {
              stars[i]?.classList.remove("star-hover-active");
            }
          }}
          onMouseLeave={() => {
            if (readOnly || !onChange) return;
            document
              .querySelectorAll(".star-hover")
              .forEach((star) => star.classList.remove("star-hover-active"));
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
