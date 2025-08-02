import React from "react";
import styles from './Footer.module.css'

export default function Footer({ children }) {
   return (
      <div className={styles.footer}>
         <main>{children}</main>
      </div>
   )
}