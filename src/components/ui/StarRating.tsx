import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  size = "sm",
  showValue = true,
  reviewCount,
}: StarRatingProps) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const stars = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i <= stars
                ? "text-brand-gold-500 fill-brand-gold-500"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`${textSize} font-semibold text-text-primary`}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSize} text-text-muted`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
