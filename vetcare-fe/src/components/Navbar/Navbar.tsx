import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router';
import { logout } from '@/services/loginService';

const Navbar = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {

            setLoggedIn(true);

        } else {
            setLoggedIn(false);
            localStorage.removeItem('jwt')
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const jwt = localStorage.getItem('jwt');
            setLoggedIn(!!jwt);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-md">
            <div className="container">
                <Link href="/home" passHref>
                    <div className="navbar-brand d-flex align-items-center">
                        <img src="veterinary.png" width="66" height="66" alt="PawCare" />
                        PawCare
                    </div>
                </Link>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="#echipa-medicala" className="nav-link">
                                Echipa Medicală
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/consultatii">
                                Servicii
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/contact">
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item dropdown" ref={dropdownRef}>
                            {loggedIn ? (
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
                                                <Link href="/profil-animal" className="dropdown-item">
                                                    Profilurile mele
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </>
                            ) : null}
                        </li>


                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {!loggedIn ? (
                            <li className="nav-item">
                                <a className="nav-link btn btn-dark" href="/login">
                                    Autentificare
                                </a>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button className="nav-link btn " onClick={logout}>
                                    Logout
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
