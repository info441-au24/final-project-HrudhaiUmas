import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SearchBox from "./user/SearchBox";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";

function Home({ user }) {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== "restaurant") {
            fetchRestaurants();
        }
    }, [user]);

    const fetchRestaurants = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch("/api/restaurants/all");
            const data = await response.json();

            if (response.ok) {
                setRestaurants(data.restaurants);
            } else {
                setError(data.message || "Failed to fetch restaurants.");
            }
        } catch (err) {
            console.error("Error fetching restaurants:", err);
            setError("An error occurred while fetching restaurants. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (restaurantId) => {
        navigate(`/restaurant-card/${restaurantId}`);
    };

    if (user?.role === "restaurant") {
        return <RestaurantDashboard />;
    }

    return (
        <div>
            <SearchBox />
            <h2>Restaurants Near You</h2>
            {isLoading && <p>Loading restaurants...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div key={restaurant._id} className="restaurant-card">
                        <h3>{restaurant.name}</h3>
                        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                        <p><strong>Location:</strong> {restaurant.address}, {restaurant.city}, {restaurant.state}</p>
                        <p><strong>Contact:</strong> {restaurant.phone}</p>
                        {restaurant.website && (
                            <p>
                                <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                </a>
                            </p>
                        )}
                        <p>{restaurant.description}</p>
                        <button
                            className="view-details-button"
                            onClick={() => handleViewDetails(restaurant._id)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;