import React from "react";
import { Star, StarHalf, Star as StarEmpty } from "lucide-react";
import styles from "./Star.module.css";

interface StarRatingProps {
   rating: number;
   totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
   const stars = [];

   for (let i = 1; i <= totalStars; i++) {
      if (i <= Math.floor(rating)) {
         // Stea completă
         stars.push(
            <Star key={i} className={styles.star} />
         );
      } else if (i - 0.5 === rating) {
         // Stea jumătate (opțional, dacă vrei să afișezi jumătăți)
         stars.push(
            <StarHalf key={i} className={styles.star} />
         );
      } else {
         // Stea goală
         stars.push(
            <StarEmpty key={i} className={`${styles.star} ${styles.empty}`} />
         );
      }
   }

   return (
      <div className={styles.starContainer} aria-label={`Rating: ${rating} out of ${totalStars}`}>
         {stars}
      </div>
   );
};

export default StarRating;
