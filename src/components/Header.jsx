import React from "react";
import { Link } from "react-router-dom";

function Header() {
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
                    <li><Link to="/login"><button className="signup-btn">
                        Sign In
                    </button></Link></li>
                </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;