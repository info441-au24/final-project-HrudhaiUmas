import React from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    let message = "";

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
            console.log(data);
            if (data.status === "success") {
                message = "Success!"
                navigate("/");
            } else {
                message = "Failure to sign up, please try again later"
            }
        } catch (err) {
            console.log(err);

        }
    }

    return (
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" required></input>
                </section>
                <section>
                    <label htmlFor="new-password">Password</label>
                    <input id="new-password" name="password" type="password" required></input>
                </section>
                <button type="submit">Sign up</button>
            </form>
            <p>{message}</p>
            <p><a href="/login">Back to Login</a></p>
        </div>
    )
}

export default SignUp;