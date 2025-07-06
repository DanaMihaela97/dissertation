import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import { useSession, signOut, signIn } from 'next-auth/react';
import styles from './Navbar.module.css';
import Image from 'next/image'
const Navbar = () => {
    const { data: session } = useSession();
    const [isOpenAnimal, setIsOpenAnimal] = useState(false);
    const dropdownRef = useRef<HTMLLIElement | null>(null);

    const toggleAnimalDropdown = () => {
        setIsOpenAnimal(prev => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpenAnimal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        signOut({ callbackUrl: '/' });
       
    };

    return (
        <nav className={`${styles.navbar} navbar navbar-expand-lg navbar-light shadow-md`}>
            <div className="container">
                <div className={`${styles.navbarBrand} navbar-brand d-flex align-items-center`}>
                    <Image src="/veterinary.png" width="66" height="66" alt="PawCare" />
                    PawCare
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    onClick={() => {
                        const el = document.getElementById('navbarNav');
                        if (el) el.classList.toggle('show');
                    }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link href="/home" className={`${styles.navLink} nav-link`}>
                                Acasă
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/about" className={`${styles.navLink} nav-link`}>
                                Despre
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`${styles.navLink} nav-link`} href="/consultatii">
                                Servicii
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`${styles.navLink} nav-link`} href="/review">
                                Review-uri
                            </Link>
                        </li>
                        <li className="nav-item dropdown" ref={dropdownRef}>
                            {session ? (
                                <>
                                    <button
                                        onClick={toggleAnimalDropdown}
                                        className="nav-link dropdown-toggle"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Animăluțul tău
                                    </button>

                                    {isOpenAnimal && (
                                        <ul className="dropdown-menu show" style={{ display: 'block', position: 'absolute' }}>
                                            <li>
                                                <Link href="/create-animal-profile" className="dropdown-item">
                                                    Creează profil pentru animăluțul tău
                                                </Link>
                                            </li>
                                            <li>
                                                {

                                                }
                                                <Link href="/animals" className="dropdown-item">
                                                    Profilurile mele
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </>
                            ) : null}
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto d-flex">
                        {!session ? (
                            <>
                                <li className="nav-item">
                                    <a
                                        role="button"
                                        className={`${styles.navLink} nav-link`}
                                        style={{ cursor: "pointer" }}
                                        href="/login"
                                    >
                                        Autentificare
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className={`${styles.navLink} ${styles.btnDark} nav-link ms-2`} href="/register">
                                        Înregistrare
                                    </a>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={handleLogout}>
                                    Deconectează-te
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;