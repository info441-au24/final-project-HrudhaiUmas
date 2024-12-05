import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    
    const [message, setMessage] = useState("");
    // let message = "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const password = e.target.password.value;
            const response = await fetch("/login", {
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
                setMessage(data.message);
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h1>Sign in</h1>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" type="text" required />
                    </section>
                    <section>
                        <label htmlFor="current-password">Password</label>
                        <input id="current-password" name="password" type="password" required />
                    </section>

                    <button type="submit">Sign in</button>
                </form>

                {message && <p className="error-message">{message}</p>}
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    );
}

export default Login;