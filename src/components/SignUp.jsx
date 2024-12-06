import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function SignUp() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    //let message = "";

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
        <div className="login-container">
            <h1>Sign Up</h1>
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
            {message && <p className="error-message">{message}</p>}
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
    );
}

export default SignUp;