import React from "react";
import styles from "./Star.module.css";

interface StarRatingProps {
   rating: number;
   totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
   const stars = [];

   for (let i = 1; i <= totalStars; i++) {
      if (i <= Math.floor(rating)) {
         stars.push(
            <span key={i} className={styles.star} aria-hidden="true">
          ★
        </span>
         );
      } else {
         stars.push(
            <span key={i} className={`${styles.star} ${styles.empty}`} aria-hidden="true">
          ★
        </span>
         );
      }
   }
   return <div className={styles.starContainer} aria-label={`Rating: ${rating} out of ${totalStars}`}>{stars}</div>;
};

export default StarRating;
