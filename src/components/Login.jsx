import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login({ refreshUser }) {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [isRestaurant, setIsRestaurant] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const password = e.target.password.value;
            const role = isRestaurant ? "restaurant" : "user"

            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (data.status === "success") {
                await refreshUser();
                setMessage("");
                navigate("/");
            } else {
                setMessage(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome Back!</h1>
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
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="username">{isRestaurant ? "Username - Restaurant" : "Username - User"}</label>
                    <input id="username" name="username" type="text" autoComplete="current-username" required />
                </section>
                <section>
                    <label htmlFor="current-password">Password</label>
                    <input id="current-password" name="password" type="password" autoComplete="current-password" required />
                </section>
                <button type="submit">Sign in</button>
            </form>
            {message && <p className="error-message">{message}</p>}
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    );
}

export default Login;