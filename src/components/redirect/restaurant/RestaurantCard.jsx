import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function RestaurantCard() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchRestaurantData();
    }, [id]);

    const fetchRestaurantData = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await fetch(`/api/restaurants/${id}`);
            const data = await response.json();

            if (response.ok) {
                setRestaurant(data.restaurant);

                const menuResponse = await fetch(`/api/restaurants/${data.restaurant._id}/menu`);
                const menuData = await menuResponse.json();

                if (menuResponse.ok) {
                    setMenu(menuData.dishes || []);
                } else {
                    setErrorMessage(menuData.message || "Failed to fetch menu details.");
                }
            } else {
                setErrorMessage(data.message || "Failed to fetch restaurant details.");
            }
        } catch (error) {
            console.error("Error fetching restaurant details:", error);
            setErrorMessage("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading restaurant details...</div>;
    }

    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    return (
        <div className="restaurant-card-page">
            <h1>{restaurant.name}</h1>
            <div className="restaurant-info">
                <p><strong>Location:</strong> {restaurant.address}, {restaurant.city}, {restaurant.state}, {restaurant.zip}</p>
                <p><strong>Phone:</strong> {restaurant.phone}</p>
                {restaurant.website && (
                    <p>
                        <strong>Website:</strong>{" "}
                        <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                            {restaurant.website}
                        </a>
                    </p>
                )}
                <p><strong>Description:</strong> {restaurant.description}</p>
                <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            </div>

            <h2>Menu</h2>
            {menu && menu.length > 0 ? (
                <table className="menu-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((dish) => (
                            <tr key={dish._id}>
                                <td>{dish.name}</td>
                                <td>${dish.price.toFixed(2)}</td>
                                <td>{dish.description || "No description available"}</td>
                                <td>{dish.tags.join(", ") || "No tags"}</td>
                                <td>
                                <Link to={`/dish-details/${dish._id}`} className="view-dish-button">
                                    View Dish
                                </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No dishes available.</p>
            )}
        </div>
    );
}

export default RestaurantCard;