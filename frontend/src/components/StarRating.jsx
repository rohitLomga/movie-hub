"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, setRating, readOnly = false, size = "md" }) {
  const [hover, setHover] = useState(0);

  const starSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10"
  };

  const sizeClass = starSizes[size] || starSizes.md;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover || rating);
        
        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            className={`transition-all duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} ${isFilled ? 'text-amber-400' : 'text-slate-600'}`}
            onClick={() => !readOnly && setRating && setRating(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            <Star className={`${sizeClass} ${isFilled ? 'fill-amber-400' : ''}`} />
          </button>
        );
      })}
      
      {readOnly && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-slate-300">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}
