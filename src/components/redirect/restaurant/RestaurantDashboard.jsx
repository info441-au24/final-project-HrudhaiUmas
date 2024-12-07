import React, { useState, useEffect } from "react";

const TAG_OPTIONS = [
    "Vegan",
    "Vegetarian",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Kosher",
    "Halal"
];

function RestaurantDashboard() {
    const [dishes, setDishes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Dish form state
    const [dishForm, setDishForm] = useState({
        name: "",
        tags: [],
        price: "",
        spiceLevel: "",
        ingredients: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/restaurants/dishes", {
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setDishes(data.dishes || []);
            } else {
                setErrorMessage(data.message || "Failed to fetch dishes.");
            }
        } catch (error) {
            console.error("Error fetching dishes:", error);
            setErrorMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (name === "tags") {
            const selectedTags = Array.from(selectedOptions, (option) => option.value);
            setDishForm((prev) => ({ ...prev, tags: selectedTags }));
        } else {
            setDishForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddDish = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!dishForm.name || !dishForm.price) {
            setErrorMessage("Name and price are required fields.");
            return;
        }

        try {
            const response = await fetch("/api/restaurants/dishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: dishForm.name,
                    tags: dishForm.tags,
                    price: Number(dishForm.price),
                    spiceLevel: dishForm.spiceLevel ? Number(dishForm.spiceLevel) : null,
                    ingredients: dishForm.ingredients ? dishForm.ingredients.split(",").map(i => i.trim()) : [],
                    description: dishForm.description,
                    image: dishForm.image
                })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Dish added successfully!");
                setDishForm({
                    name: "",
                    tags: [],
                    price: "",
                    spiceLevel: "",
                    ingredients: "",
                    description: "",
                    image: ""
                });
                fetchDishes();
            } else {
                setErrorMessage(data.error || "Failed to add dish.");
            }
        } catch (error) {
            console.error("Error adding dish:", error);
            setErrorMessage("An error occurred while adding the dish. Please try again.");
        }

        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    return (
        <div className="restaurant-dashboard">
            <h1>Your Restaurant Dashboard</h1>
            <p>Manage your menu items. Add new dishes or view existing ones below.</p>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {isLoading && <p>Loading your dishes...</p>}

            {/* Add Dish Form */}
            <div className="add-dish-section">
                <h2>Add a New Dish</h2>
                <form onSubmit={handleAddDish} className="add-dish-form">
                    <label htmlFor="name">Dish Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={dishForm.name}
                        onChange={handleFormChange}
                        required
                    />

                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        id="price"
                        name="price"
                        value={dishForm.price}
                        onChange={handleFormChange}
                        required
                    />

                    <label htmlFor="spiceLevel">Spice Level (0-5):</label>
                    <input
                        type="number"
                        id="spiceLevel"
                        name="spiceLevel"
                        min="0"
                        max="5"
                        value={dishForm.spiceLevel}
                        onChange={handleFormChange}
                    />

                    <label htmlFor="ingredients">Ingredients (comma separated):</label>
                    <input
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        placeholder="e.g. tomato, cheese, basil"
                        value={dishForm.ingredients}
                        onChange={handleFormChange}
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={dishForm.description}
                        onChange={handleFormChange}
                        rows="3"
                    ></textarea>

                    <label htmlFor="tags">Dietary Tags:</label>
                    <select
                        id="tags"
                        name="tags"
                        multiple
                        value={dishForm.tags}
                        onChange={handleFormChange}
                    >
                        {TAG_OPTIONS.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>

                    <label htmlFor="image">Image URL:</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        placeholder="http://example.com/image.jpg"
                        value={dishForm.image}
                        onChange={handleFormChange}
                    />

                    <button type="submit">Add Dish</button>
                </form>
            </div>

            {/* Dish Cards */}
            <h2>Your Menu Items</h2>
            {dishes.length > 0 ? (
                <div className="dish-card-grid">
                    {dishes.map((dish) => (
                        <div className="dish-card" key={dish._id}>
                            <div className="dish-image">
                                {dish.image ? (
                                    <img src={dish.image} alt={dish.name} />
                                ) : (
                                    <div className="placeholder-image">No Image</div>
                                )}
                            </div>
                            <div className="dish-info">
                                <h3>{dish.name}</h3>
                                <p className="dish-price">${dish.price}</p>
                                <p className="dish-tags">
                                    {dish.tags && dish.tags.length > 0
                                        ? dish.tags.join(", ")
                                        : "No tags"}
                                </p>
                                <p className="dish-ingredients">
                                    {dish.ingredients && dish.ingredients.length > 0
                                        ? "Ingredients: " + dish.ingredients.join(", ")
                                        : "No ingredients listed"}
                                </p>
                                <p className="dish-spice">
                                    Spice Level: {dish.spiceLevel !== null ? dish.spiceLevel : "N/A"}
                                </p>
                                <p className="dish-description">
                                    {dish.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You currently have no dishes in your menu. Add one above!</p>
            )}
        </div>
    );
}

export default RestaurantDashboard;
