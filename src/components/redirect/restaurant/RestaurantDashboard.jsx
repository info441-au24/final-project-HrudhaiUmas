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
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isEditing, setIsEditing] = useState(null);
    const [dishToEdit, setDishToEdit] = useState(null);

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        setIsLoading(true);
        try {
            // Check if the user is authenticated and a restaurant
            const authResponse = await fetch("/auth/status", { credentials: "include" });
            const authData = await authResponse.json();

            if (!authData.authenticated || authData.role !== "restaurant") {
                setErrorMessage("You must be logged in as a restaurant to view the dashboard.");
                setIsLoading(false);
                return;
            }

            // Fetch the restaurant's dishes
            const dishesResponse = await fetch("/api/restaurants/dishes", { credentials: "include" });
            const dishesData = await dishesResponse.json();

            if (dishesResponse.ok) {
                setDishes(dishesData.dishes || []);
            } else {
                setErrorMessage(dishesData.message || "Failed to fetch dishes.");
            }
        } catch (error) {
            console.error("Error fetching dishes: ", error);
            setErrorMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (dish) => {
        setIsEditing(dish._id);
        setDishToEdit({
            _id: dish._id,
            name: dish.name,
            tags: dish.tags || [],
            price: dish.price,
            spiceLevel: dish.spiceLevel,
            ingredients: dish.ingredients?.join(", ") || "",
            description: dish.description || ""
        });
    };

    const handleEditChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (name === "tags") {
            const selectedTags = Array.from(selectedOptions, (option) => option.value);
            setDishToEdit((prev) => ({ ...prev, tags: selectedTags }));
        } else {
            setDishToEdit((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveDish = async (dishId) => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!dishToEdit.name || !dishToEdit.price) {
            setErrorMessage("Name and price are required fields.");
            return;
        }

        try {
            const response = await fetch(`/api/restaurants/dishes/${dishId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: dishToEdit.name,
                    tags: dishToEdit.tags,
                    price: Number(dishToEdit.price),
                    spiceLevel: Number(dishToEdit.spiceLevel) || null,
                    ingredients: dishToEdit.ingredients ? dishToEdit.ingredients.split(",").map(i => i.trim()) : [],
                    description: dishToEdit.description
                })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Dish updated successfully!");
                fetchDishes();
                setIsEditing(null);
                setDishToEdit(null);
            } else {
                setErrorMessage(data.error || "Failed to update dish.");
            }
        } catch (error) {
            console.error("Error updating dish:", error);
            setErrorMessage("An error occurred while updating the dish. Please try again.");
        }

        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setDishToEdit(null);
    };

    if (isLoading) {
        return <div>Loading your restaurant dashboard...</div>;
    }

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    return (
        <div className="restaurant-dashboard-page">
            <h1>Restaurant Dashboard</h1>
            <h2>Your Menu Items</h2>
            {dishes.length > 0 ? (
                <table className="dish-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tags</th>
                            <th>Price</th>
                            <th>Spice Level</th>
                            <th>Ingredients</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dishes.map((dish) => {
                            const editingThisDish = isEditing === dish._id;
                            return (
                                <tr key={dish._id}>
                                    <td>
                                        {editingThisDish ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={dishToEdit?.name || ""}
                                                onChange={handleEditChange}
                                                required
                                            />
                                        ) : (
                                            dish.name
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <select
                                                name="tags"
                                                multiple
                                                value={dishToEdit?.tags || []}
                                                onChange={handleEditChange}
                                            >
                                                {TAG_OPTIONS.map(tag => (
                                                    <option key={tag} value={tag}>{tag}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            dish.tags?.join(", ")
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="price"
                                                value={dishToEdit?.price || ""}
                                                onChange={handleEditChange}
                                                required
                                            />
                                        ) : (
                                            `$${dish.price}`
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <input
                                                type="number"
                                                name="spiceLevel"
                                                min="0"
                                                max="5"
                                                value={dishToEdit?.spiceLevel || ""}
                                                onChange={handleEditChange}
                                            />
                                        ) : (
                                            dish.spiceLevel || "-"
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <input
                                                type="text"
                                                name="ingredients"
                                                value={dishToEdit?.ingredients || ""}
                                                onChange={handleEditChange}
                                            />
                                        ) : (
                                            dish.ingredients?.join(", ") || "-"
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <textarea
                                                name="description"
                                                rows="2"
                                                value={dishToEdit?.description || ""}
                                                onChange={handleEditChange}
                                            ></textarea>
                                        ) : (
                                            dish.description || "-"
                                        )}
                                    </td>
                                    <td>
                                        {editingThisDish ? (
                                            <>
                                                <button onClick={() => handleSaveDish(dish._id)}>Save</button>
                                                <button onClick={handleCancelEdit}>Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEditing(dish)}>Edit</button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No menu items found.</p>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default RestaurantDashboard;
