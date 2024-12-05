import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    let message = "";

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
                message = "Success!"
                navigate("/");
            } else {
                message = "Failure to sign in, please try again later"
            }
        } catch (err) {
            console.log(err);
            message = "Failure to sign in, please try again later"
        }
    }

    return (
        <div>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" required></input>
                </section>
                <section>
                    <label htmlFor="current-password">Password</label>
                    <input id="current-password" name="password" type="password" required></input>
                </section>
                <button type="submit">Sign in</button>
            </form>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    )
}

export default Login;