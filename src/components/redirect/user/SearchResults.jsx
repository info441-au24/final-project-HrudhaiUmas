import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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
                `/api/dishes/search?food=${encodeURIComponent(dishToSearch)}&username=${encodeURIComponent(user.username)}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("fetched data:");
            console.log(data);

            // Filter results only if dietary restrictions exist
            const filteredData = dietaryRestrictions.length > 0
                ? data.filter((dish) =>
                    dietaryRestrictions.every((restriction) =>
                        dish.tags?.includes(restriction)
                    )
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
        const initializeSearch = async () => {
            await fetchDietaryRestrictions();
            if (dish) {
                setSearchDish(dish);
                fetchSearchResults(dish);
            }
        };

        initializeSearch();
    }, [dish, user]);

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

    // const onViewButtonClick = (dish) => {
    //     navigate("/dish-details", {
    //         state: {
    //             dishID: dish.id
    //         }
    //     })
    // }

    // const contents =
    //     searchResults.length > 0 ? (
    //         searchResults.map((dish, index) => (
    //             <div key={index} className="search-results-item">
    //                 <div className="search-results-subitem">
    //                     <p>{dish.restaurant}</p>
    //                 </div>
    //                 <div className="search-results-subitem">
    //                     <p>{dish.name}</p>
    //                 </div>
    //                 <div className="search-results-subitem">
    //                     <p>Location: {dish.location}</p>
    //                 </div>
    //                 <div className="search-results-subitem">
    //                     <button id="view-dish-details-button" onClick={onViewButtonClick(dish)}>View</button>
    //                 </div>
    //             </div>
    //         ))
    //     ) : (
    //         <p>No dishes found. Try searching for something else!</p>
    //     );

    const content = searchResults.length > 0 ? (
        searchResults.map((dish, index) => {
            return <DishCard dish={dish} index={index}/>
        })
    ) : (
        <p>No dishes found. Try searching for something else!</p>
    )

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
            <div className="search-results">{content}</div>
        </div>
    );
}

function DishCard({ dish, index }) {
    return (
        <div key={index} className="search-results-item">
            <div className="search-results-subitem">
                <p>{dish.restaurant}</p>
            </div>
            <div className="search-results-subitem">
                <p>{dish.name}</p>
            </div>
            <div className="search-results-subitem">
                <p>Location: {dish.location}</p>
            </div>
            <div className="search-results-subitem">
                <Link to={`/dish-details/${dish.id}`}><button id="view-dish-details-button">View</button></Link>
            </div>
        </div>
    )
}

export default SearchResults;
