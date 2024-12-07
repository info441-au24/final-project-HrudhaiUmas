import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function RestaurantCard() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
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
                    <p><strong>Website:</strong> <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a></p>
                )}
                <p><strong>Description:</strong> {restaurant.description}</p>
                <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            </div>

            <h2>Menu</h2>
            {restaurant.menu && restaurant.menu.length > 0 ? (
                <ul className="menu-list">
                    {restaurant.menu.map((dish) => (
                        <li key={dish._id} className="menu-item">
                            <strong>{dish.name}</strong>: ${dish.price.toFixed(2)}
                            <p>{dish.description}</p>
                            <p><strong>Tags:</strong> {dish.tags.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No dishes available.</p>
            )}
            
        </div>
    );
}

export default RestaurantCard;