import { useEffect, useRef } from "react";
import styles from "./Carousel.module.css";
import VaccineCarousel from "@/components/Carousel/vaccine";
import DiseaseCarousel from "@/components/Carousel/disease";

export default function CarouselsWrapper() {
  const vaccineRef = useRef(null);
  const diseaseRef = useRef(null);

  const setMaxHeight = () => {
    const vaccineHeight = vaccineRef.current?.offsetHeight || 0;
    const diseaseHeight = diseaseRef.current?.offsetHeight || 0;
    const maxHeight = Math.max(vaccineHeight, diseaseHeight);

    if (vaccineRef.current) vaccineRef.current.style.height = maxHeight + "px";
    if (diseaseRef.current) diseaseRef.current.style.height = maxHeight + "px";
  };

  useEffect(() => {
    setMaxHeight();
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <div className={styles.carouselsWrapper}>
      <div ref={vaccineRef} className={styles.carouselFixed}>
        <VaccineCarousel />
      </div>

      <div className={styles.divider} />

      <div ref={diseaseRef} className={styles.carouselFixed}>
        <DiseaseCarousel />
      </div>
    </div>
  );
}
