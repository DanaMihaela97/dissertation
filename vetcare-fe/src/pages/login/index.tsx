import React from 'react';
import Image from 'next/image';
import { ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import { signIn, useSession } from 'next-auth/react';

const LoginPage = () => {
  const { data: session } = useSession();

  if (session) {
    if (typeof window !== 'undefined') {
      localStorage.setItem("jwt", session.accessToken as string);
      console.log(localStorage.getItem("jwt"));
    }
  }

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <div style={{ color: "#3336ff", background: "#fff", borderRadius: "50%" }}>
            <LogIn className="w-6 h-6 text-gray-600" />
          </div>
          <h1>Bine ai venit!</h1>
          <p>Conectează-te cu contul tău Google pentru a accesa aplicația.</p>

          <motion.button onClick={() => signIn()} className="auth-btn">
            <Image src="/google-icon.svg" alt="Google icon" width={20} height={20} className="w-5 h-5" />
            <span style={{ marginRight: "10px" }}>Autentifică-te cu Google</span>
            <ArrowRight className="w-2 h-2 arrow" />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
