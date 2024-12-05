import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const [message, setMessage] = useState("");
    const [isRestaurant, setIsRestaurant] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const password = e.target.password.value;

            const loginEndpoint = isRestaurant ? "/restaurant/login" : "/login"; // pretty cool we can do dyamic endpoints :)

            const response = await fetch(loginEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                credentials: "include"
            });

            const data = await response.json();
            if (data.status === "success") {
                await checkAuth();
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
            <h1>{isRestaurant ? "Sign into Restaurant" : "Sign into User"}</h1>

            {/* Toggle between User and Restaurant login */}
            <div className="toggle-login">
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
                    <label htmlFor="username">
                        {isRestaurant ? "Restaurant Username" : "Username"}
                    </label>
                    <input id="username" name="username" type="text" required />
                </section>
                <section>
                    <label htmlFor="current-password">Password</label>
                    <input id="current-password" name="password" type="password" required />
                </section>
                <button type="submit">
                    {isRestaurant ? "Sign into Restaurant" : "Sign into User"}
                </button>
            </form>

            {message && <p className="error-message">{message}</p>}
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    );
}

export default Login;