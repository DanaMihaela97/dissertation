import { useEffect, useState } from "react";
import { createReview, getReviews } from "@/services/reviewService";
import { Review } from "@/components/entities/review";
import Navbar from "@/components/Navbar";
import styles from "./Review.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReviews();
  }, []);

 async function fetchReviews() {
  try {
    const data = await getReviews();
    const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReviews(sortedData);
  } catch (err) {
    setError("Nu s-au putut încărca review-urile.");
  }
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
    await createReview({ rating, feedback });
    await fetchReviews();
    setRating(0);
    setFeedback("");
    
    Swal.fire({
      icon: 'success',
      title: 'Mulțumim!',
      text: 'Review-ul tău a fost trimis cu succes.',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });

  } catch (err) {
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
          style={{
            cursor: onSelect ? "pointer" : "default",
            color: i <= selected ? "#ffbf00" : "#ccc",
            fontSize: "24px",
            marginRight: 5,
          }}
          onClick={() => onSelect && onSelect(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSelect) onSelect(i);
          }}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label={`${i} stea${i > 1 ? "te" : ""}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Lasă un review pentru serviciul AI</h2>

        <form onSubmit={handleSubmit} className={styles.title}>
          <div>
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
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className={styles.textarea}
            ></textarea>
          </div>

          {error && <div className={styles.error}>{error}</div>}

         <button
  type="submit"
  disabled={loading}
  className="btn btn-success"
>
  Trimite review
</button>

        </form>

        <hr className={styles.hr} />

        <h3>Review-uri primite</h3>

        {reviews.length === 0 && <p>Nu există review-uri încă.</p>}

        <ul className={styles.reviewList}>
          {reviews.map(({ email, rating, feedback, createdAt }, index) => (
            <li key={index} className={styles.reviewItem}>
              <div className={styles.reviewEmail}>{email}</div>
              <div>{renderStars(rating)}</div>
              <p className={styles.reviewFeedback}>{feedback}</p>
              <small className={styles.reviewDate}>{new Date(createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
