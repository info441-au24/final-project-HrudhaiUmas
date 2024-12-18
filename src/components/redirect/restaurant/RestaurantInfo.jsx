import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TAG_OPTIONS = [
    "Vegan",
    "Vegetarian",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Kosher",
    "Halal"
];

function RestaurantProfile() {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Profile editing states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [restaurantToEdit, setRestaurantToEdit] = useState(null);

    // Dish editing states
    const [isEditing, setIsEditing] = useState(null); // store dish._id of currently editing row
    const [dishToEdit, setDishToEdit] = useState(null);

    // New dish form state
    const [dishForm, setDishForm] = useState({
        name: "",
        tags: [],
        price: "",
        spiceLevel: "",
        ingredients: "",
        description: ""
    });

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    const fetchRestaurantData = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const authResponse = await fetch("/auth/status", {
                credentials: "include"
            });
            const authData = await authResponse.json();

            if (authData.authenticated && authData.role === "restaurant") {
                setRestaurant(authData);

                // Also prepare restaurantToEdit in case we want to edit
                setRestaurantToEdit({
                    name: authData.name || "",
                    email: authData.email || "",
                    phone: authData.phone || "",
                    address: authData.address || "",
                    city: authData.city || "",
                    state: authData.state || "",
                    zip: authData.zip || "",
                    cuisine: authData.cuisine || "",
                    website: authData.website || "",
                    description: authData.description || ""
                });

                // Fetch the restaurant's dishes
                const dishesResponse = await fetch("/api/restaurants/dishes", {
                    credentials: "include"
                });
                const dishesData = await dishesResponse.json();

                if (dishesResponse.ok) {
                    setDishes(dishesData.dishes || []);
                } else {
                    setErrorMessage(dishesData.message || "Failed to fetch dishes.");
                }
            } else {
                setErrorMessage("You must be logged in as a restaurant to view this page.");
            }
        } catch (error) {
            console.error("Error fetching restaurant data: ", error);
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
                    spiceLevel: Number(dishForm.spiceLevel) || null,
                    ingredients: dishForm.ingredients ? dishForm.ingredients.split(",").map(i => i.trim()) : [],
                    description: dishForm.description
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
                    description: ""
                });

                fetchRestaurantData();
            } else {
                setErrorMessage(data.error || "Failed to add dish.");
            }
        } catch (error) {
            console.error("Error adding dish: ", error);
            setErrorMessage("An error occurred while adding the dish. Please try again.");
        }

        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    // Start editing a particular dish
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
                fetchRestaurantData();
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

    // Profile editing handlers
    const handleProfileEditToggle = () => {
        if (!isEditingProfile) {
            // Start editing
            setRestaurantToEdit({
                name: restaurant.name || "",
                email: restaurant.email || "",
                phone: restaurant.phone || "",
                address: restaurant.address || "",
                city: restaurant.city || "",
                state: restaurant.state || "",
                zip: restaurant.zip || "",
                cuisine: restaurant.cuisine || "",
                website: restaurant.website || "",
                description: restaurant.description || ""
            });
        }
        setIsEditingProfile(!isEditingProfile);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setRestaurantToEdit((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch("/api/restaurants", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(restaurantToEdit)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                // Refetch restaurant data to show updated info
                await fetchRestaurantData();
                setIsEditingProfile(false);
            } else {
                setErrorMessage(data.error || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrorMessage("An error occurred while updating the profile. Please try again.");
        }

        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 5000);
    };

    const handleCancelProfileEdit = () => {
        setIsEditingProfile(false);
        setRestaurantToEdit(null);
    };

    if (isLoading) {
        return <div>Loading your restaurant profile...</div>;
    }

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    return (
        <div className="restaurant-profile-page">
            <h1>Welcome, {restaurant?.username}!</h1>
            <h2>Your Restaurant Profile</h2>
            <div className="restaurant-info">
                {!isEditingProfile ? (
                    <>
                        <p><strong>Name:</strong> {restaurant?.name}</p>
                        <p><strong>Email:</strong> {restaurant?.email}</p>
                        <p><strong>Phone:</strong> {restaurant?.phone}</p>
                        <p><strong>Address:</strong> {restaurant?.address}, {restaurant?.city}, {restaurant?.state} {restaurant?.zip}</p>
                        <p><strong>Cuisine:</strong> {restaurant?.cuisine}</p>
                        {restaurant?.website && <p><strong>Website:</strong> <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a></p>}
                        {restaurant?.description && <p><strong>Description:</strong> {restaurant.description}</p>}
                        <button onClick={handleProfileEditToggle}>Edit Profile</button>
                    </>
                ) : (
                    <div className="edit-restaurant-form">
                        <label>Name:</label>
                        <input type="text" name="name" value={restaurantToEdit.name} onChange={handleProfileChange} />

                        <label>Email:</label>
                        <input type="email" name="email" value={restaurantToEdit.email} onChange={handleProfileChange} />

                        <label>Phone:</label>
                        <input type="text" name="phone" value={restaurantToEdit.phone} onChange={handleProfileChange} />

                        <label>Address:</label>
                        <input type="text" name="address" value={restaurantToEdit.address} onChange={handleProfileChange} />

                        <label>City:</label>
                        <input type="text" name="city" value={restaurantToEdit.city} onChange={handleProfileChange} />

                        <label>State:</label>
                        <input type="text" name="state" value={restaurantToEdit.state} onChange={handleProfileChange} />

                        <label>ZIP:</label>
                        <input type="text" name="zip" value={restaurantToEdit.zip} onChange={handleProfileChange} />

                        <label>Cuisine:</label>
                        <input type="text" name="cuisine" value={restaurantToEdit.cuisine} onChange={handleProfileChange} />

                        <label>Website:</label>
                        <input type="text" name="website" value={restaurantToEdit.website} onChange={handleProfileChange} />

                        <label>Description:</label>
                        <textarea name="description" rows="3" value={restaurantToEdit.description} onChange={handleProfileChange}></textarea>

                        <button onClick={handleSaveProfile}>Save</button>
                        <button onClick={handleCancelProfileEdit}>Cancel</button>
                    </div>
                )}
            </div>

            <h2>Your Dishes</h2>
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
                                            <>
                                                <button onClick={() => startEditing(dish)}>
                                                    Edit
                                                </button>
                                                <Link
                                                    to={`/dish-details/${dish._id}`}
                                                    className="view-dish-button"
                                                >
                                                    View
                                                </Link>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>No dishes found. Add a dish below!</p>
            )}

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

                <label htmlFor="tags">Dietary Tags (select multiple with CTRL/CMD):</label>
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

                <button type="submit">Add Dish</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && !isLoading && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default RestaurantProfile;
