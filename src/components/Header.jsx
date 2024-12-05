import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

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
                credentials: "include",
            });
            if (response.ok) {
                checkAuth();
                navigate("/");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleScrollToTop = () => {
        navigate("/"); // Navigate to the homepage
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    };

    const handleScrollToServices = () => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/"); // Navigate to homepage if services section is not found
        }
    };

    const onClickHandler = () => {
        navigate("/user-info");
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
                        <li>
                            <button onClick={handleScrollToTop} className="nav-button">
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={handleScrollToServices} className="nav-button">
                                Services
                            </button>
                        </li>
                        <li>
                            {user ? (
                                <div className="logged-in-header-div">
                                    <button
                                        className="signup-btn"
                                        onClick={handleLogout}
                                    >
                                        Sign Out ({user.username})
                                    </button>
                                    <button id="user-info-btn" onClick={onClickHandler}>
                                        <img
                                            src={"/images/UserProfileIcon.jpg"}
                                            alt="user profile icon"
                                            className="profile-icon"
                                        />
                                    </button>
                                </div>
                            ) : (
                                <button className="signup-btn" onClick={() => navigate("/login")}>
                                    Sign In
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
