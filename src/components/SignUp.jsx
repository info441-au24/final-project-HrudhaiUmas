import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantSignUp from "./RestaurantSignUp";

function SignUp() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isRestaurant, setIsRestaurant] = useState(false); // need to be able to toggle between User and Restaurant sign-up

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const password = e.target.password.value;

            const response = await fetch("login/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                credentials: "include"
            });

            const data = await response.json();
            if (data.status === "success") {
                setMessage("");
                navigate("/login");
            } else {
                setMessage(data.message || "An error occurred. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="signup-container">
            <h1>Sign Up</h1>
            <div className="toggle-signup">
                <button
                    className={`toggle-button ${!isRestaurant ? "active" : ""}`}
                    onClick={() => setIsRestaurant(false)}
                >
                    User
                </button>
                <button
                    className={`toggle-button ${isRestaurant ? "active" : ""}`}
                    onClick={() => setIsRestaurant(true)}
                >
                    Restaurant
                </button>
            </div>
            {isRestaurant ? (
                // Render RestaurantSignUp Component
                <RestaurantSignUp />
            ) : (
                // Render User Sign-Up Form
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" required />
                    </section>
                    <section>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" required />
                    </section>
                    <button type="submit">Sign Up</button>
                </form>
            )}
            {message && <p className="error-message">{message}</p>}
            <p>
                Already have an account? <a href="/login">Sign In</a>
            </p>
        </div>
    );
}

export default SignUp;