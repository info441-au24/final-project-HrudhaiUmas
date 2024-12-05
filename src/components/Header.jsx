import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

function Header() {
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/login/logout", {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                checkAuth();
                navigate("/");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header>
            <div className="container">
                <h1 className="logo">
                <img src="/images/logo.png" alt="BiteMap Logo" className="logo-icon" />
                BiteMap
                </h1>
                <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li>
                        {user ? (
                            <button
                                className="signup-btn"
                                onClick={handleLogout}
                            >
                                Sign Out ({user.username})
                            </button>
                        ) : (
                            <Link to="/login">
                                <button className="signup-btn">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </li>
                </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;