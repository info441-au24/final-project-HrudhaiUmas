import React, { useState } from "react";

function RestaurantSignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cuisine: "",
        website: "",
        description: "",
        username: "", // Add username field
        password: "", // Add password field
        role: "restaurant"
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/auth/restaurant/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === "success") {
                setMessage("Restaurant registered successfully!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                    cuisine: "",
                    website: "",
                    description: "",
                    username: "",
                    password: "",
                    role: "restaurant"
                });
            } else {
                setMessage(data.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            console.error("Error registering restaurant:", err);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="restaurant-signup-container">
            <form onSubmit={handleSubmit}>
                <section>
                    <label htmlFor="name">Restaurant Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="state">State</label>
                    <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="zip">ZIP Code</label>
                    <input
                        id="zip"
                        name="zip"
                        type="text"
                        autoComplete="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="cuisine">Cuisine Type</label>
                    <input
                        id="cuisine"
                        name="cuisine"
                        type="text"
                        autoComplete="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="website">Website</label>
                    <input
                        id="website"
                        name="website"
                        type="url"
                        autoComplete="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </section>
                <section>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        autoComplete="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us about your restaurant..."
                    ></textarea>
                </section>
                <section>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="current-username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </section>
                <section>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </section>
                <button type="submit">Register Restaurant</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default RestaurantSignUp;
