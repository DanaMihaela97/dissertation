import {useEffect, useState} from "react";
import {createReview, getReviewMean, getReviews} from "@/services/reviewService";
import {Review} from "@/components/entities/review";
import Layout from "@/components/Layout";
import Swal from "sweetalert2";
import {ClipLoader} from "react-spinners";
import styles from "./Review.module.css";
import {useSession} from "next-auth/react";
import {Star, Users} from "lucide-react";
import Authentication from "@/components/Authentication";

export default function ReviewPage() {
   const [reviews, setReviews] = useState<Review[]>([]);
   const [rating, setRating] = useState<number>(0);
   const [feedback, setFeedback] = useState<string>("");
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
   const [meanRating, setMeanRating] = useState<number | null>(null);

   useEffect(() => {
      fetchReviews();
      fetchMeanRating();
   }, []);

   const fetchMeanRating = async () => {
      try {
         const mean = await getReviewMean();
         setMeanRating(mean);
      } catch {
         console.error("Eroare la preluarea ratingului mediu");
      }
   };

   async function fetchReviews() {
      try {
         setLoadingReviews(true);
         const data = await getReviews();
         const sortedData = data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         );
         setReviews(sortedData);
      } catch {
         setError("Nu s-au putut încărca review-urile.");
      }
      setLoadingReviews(false);
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (rating === 0) {
         setError("Te rugăm să selectezi un rating.");
         return;
      }
      if (feedback.trim().length === 0) {
         setError("Te rugăm să lași un feedback.");
         return;
      }

      setError(null);
      setLoading(true);
      try {
         await createReview({rating, feedback});
         await fetchReviews();
         await fetchMeanRating();

         setRating(0);
         setFeedback("");

         await Swal.fire({
            icon: "success",
            title: "Mulțumim!",
            text: "Review-ul tău a fost trimis cu succes.",
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
         });
      } catch {
         setError("Eroare la trimiterea review-ului.");
      }
      setLoading(false);
   };

   const renderStars = (selected: number, onSelect?: (val: number) => void) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
         stars.push(
            <span
               key={i}
               className={`${styles.star} ${i <= selected ? "" : styles.empty}`}
               onClick={() => onSelect && onSelect(i)}
               role={onSelect ? "button" : undefined}
               tabIndex={onSelect ? 0 : undefined}
               aria-label={`${i} stea${i > 1 ? "te" : ""}`}
            >
          ★
        </span>
         );
      }
      return <div className={styles.starContainer}>{stars}</div>;
   };

   return (
      <Layout>
         <div className={styles.container}>
            <h2 className="h2Title">Spune-ne părerea ta despre serviciile noastre</h2>
            <p className={styles.subtitle}>
               Feedback-ul tău ne ajută să facem aplicația mai bună pentru tine.
            </p>

            <div className={styles.statsContainer}>
               <div className={styles.statCard}>
                  <div className={`${styles.iconWrapper} ${styles.starWrapper}`}>
                     <Star className={styles.starIcon}/>
                  </div>
                  <h3>{meanRating ? meanRating.toFixed(1) : "-"}</h3>
                  <p>Media recenziilor</p>
               </div>

               <div className={styles.statCard}>
                  <div className={`${styles.iconWrapper} ${styles.userWrapper}`}>
                     <Users className={styles.userIcon}/>
                  </div>
                  <h3>{reviews.length}</h3>
                  <p>Recenzii totale</p>
               </div>
            </div>
            <Authentication response={"Nu poti lasa o recenzie"}>
               <form onSubmit={handleSubmit} className={styles.formCard}>
                  <div className={styles.formGroup}>
                     <label htmlFor="rating" className={styles.label}>

                        Rating:
                     </label>
                     <div>{renderStars(rating, setRating)}</div>
                  </div>

                  <div className={styles.formGroup}>
                     <label htmlFor="feedback" className={styles.label}>
                        Feedback:
                     </label>
                     <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => {
                           setFeedback(e.target.value);
                        }}
                        rows={4}
                        className={styles.textarea}
                        placeholder="Scrie aici ce părere ai despre aplicație..."
                     />
                  </div>

                  {error && <div className={styles.error}>{error}</div>}


                  <button type="submit" className="btn btn-success" disabled={loading}>
                     Trimite recenzia
                  </button>
               </form>
            </Authentication>

            <hr className={styles.hr}/>

            <h3>Recenzii primite</h3>
            <p className={styles.subtitle2}>
               Vezi ce au spus ceilalți utilizatori și inspiră-te din experiențele lor.
            </p>

            {loadingReviews ? (
               <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                  <ClipLoader color="#28a745" loading={loadingReviews} size={50}/>
               </div>
            ) : reviews.length === 0 ? (
               <p>Nu există recenzii încă. Fii primul care își împărtășește părerea!</p>
            ) : (
               <ul className={styles.reviewList}>
                  {reviews.map(({name, rating, feedback, createdAt}, index) => (
                     <li key={index} className={styles.reviewCard}>
                        <div className={styles.reviewName}>{name}</div>
                        {renderStars(rating)}
                        <p className={styles.reviewFeedback}>{feedback}</p>
                        <small className={styles.reviewDate}>
                           {new Date(createdAt).toLocaleString()}
                        </small>
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </Layout>

   );
}