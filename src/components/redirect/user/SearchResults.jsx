import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchResults({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDish, setSearchDish] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const dish = location.state?.dish;

    const fetchDietaryRestrictions = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${user.username}/dietary-restrictions`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setDietaryRestrictions(data.dietaryRestrictions || []);
            }
        } catch (err) {
            console.error("Error fetching dietary restrictions:", err);
        }
    };

    const fetchSearchResults = async (dishToSearch) => {
        if (!dishToSearch) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/dishes/search?food=${encodeURIComponent(dishToSearch)}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter results only if dietary restrictions exist
            const filteredData = dietaryRestrictions.length > 0
                ? data.filter((dish) =>
                      dish.tags?.some((tag) => dietaryRestrictions.includes(tag))
                  )
                : data; // If no dietary restrictions, include all dishes

            setSearchResults(filteredData);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Error fetching search results. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch dietary restrictions on load
        fetchDietaryRestrictions();

        // Fetch search results if a dish is provided
        if (dish) {
            setSearchDish(dish);
            fetchSearchResults(dish);
        }
    }, [dish, user]);

    useEffect(() => {
        // Refetch search results whenever dietary restrictions change
        if (searchDish) {
            fetchSearchResults(searchDish);
        }
    }, [dietaryRestrictions]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/search", {
            state: { dish: searchDish },
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!dish) {
        return <div>Please enter a dish to search!</div>;
    }

    const contents =
        searchResults.length > 0 ? (
            searchResults.map((dish, index) => (
                <div key={index} className="search-results-item">
                    <p>Restaurant Name: Pizza on the Ave</p>
                    <p>Location: 4801 24th Ave NE, Seattle WA 98105</p>
                    <p>{dish.name}</p>
                </div>
            ))
        ) : (
            <p>No dishes found. Try searching for something else!</p>
        );

    return (
        <div>
            <form
                className="custom-search-form"
                id="custom-search-form"
                onSubmit={handleSearch}
            >
                <div className="restaurant-input">
                    <input
                        type="text"
                        id="restaurant"
                        placeholder="What's Your Next Bite?"
                        value={searchDish}
                        onChange={(e) => setSearchDish(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        id="custom-search-btn"
                        className="custom-search-btn"
                    >
                        Search
                    </button>
                </div>
            </form>
            <div className="search-results">{contents}</div>
        </div>
    );
}

export default SearchResults;
