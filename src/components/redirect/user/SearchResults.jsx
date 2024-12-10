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
    const [spiceLevelRange, setSpiceLevelRange] = useState({ min: 1, max: 5 });
    const [excludedIngredients, setExcludedIngredients] = useState([]);
    const [customIngredient, setCustomIngredient] = useState("");
    const [allIngredients] = useState([
        "Chicken", "Beef", "Pork", "Tofu", "Tomato", "Fish", "Garlic", "Onion", 
        "Peanuts", "Mushrooms", "Dairy", "Eggs", "Gluten", "Soy", "Nuts"
    ]);
    const [ingredientSearch, setIngredientSearch] = useState("");
    const filteredIngredients = allIngredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(ingredientSearch.toLowerCase())
    );
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

            const filteredData = data.filter((dish) => {
                const withinSpiceLevel =
                    dish.spiceLevel >= spiceLevelRange.min &&
                    dish.spiceLevel <= spiceLevelRange.max;
                const noExcludedIngredients = excludedIngredients.every(
                    (ingredient) => !dish.ingredients?.includes(ingredient)
                );
                return withinSpiceLevel && noExcludedIngredients;
            });

            setSearchResults(filteredData);
        } catch (error) {
            console.error("Error fetching search results:", error);
            if(user) {
                setError("Error fetching search results. Please try again later.");
            } else {
                setError("Please sign in before searching so we can make a personal connection ;)")
            }
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

    const handleSpiceLevelInputChange = (e) => {
        const { name, value } = e.target;
        setSpiceLevelRange((prevRange) => ({ ...prevRange, [name]: Number(value) }));
    };

    const handleExcludedIngredientsChange = (ingredient) => {
        setExcludedIngredients((prevExcluded) =>
            prevExcluded.includes(ingredient)
                ? prevExcluded.filter((item) => item !== ingredient)
                : [...prevExcluded, ingredient]
        );
    };

    const handleAddCustomIngredient = () => {
        if (customIngredient && !excludedIngredients.includes(customIngredient)) {
            setExcludedIngredients((prev) => [...prev, customIngredient]);
        }
        setCustomIngredient(""); // Reset input
    };

    const handleRemoveIngredient = (ingredient) => {
        setExcludedIngredients((prevExcluded) =>
            prevExcluded.filter((item) => item !== ingredient)
        );
    };

    const handleResetFilters = () => {
        setSpiceLevelRange({ min: 1, max: 5 });
        setExcludedIngredients([]);
        setCustomIngredient("");
        setIngredientSearch("");
        fetchSearchResults(searchDish);
    };

    const handleApplyFilters = () => {
        fetchSearchResults(searchDish);
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

    const content = searchResults.length > 0 ? (
        searchResults.map((dish, index) => (
            <div className="search-results-item" key={index}>
                <DishCard dish={dish} />
            </div>
        ))
    ) : (
        <p>No dishes found. Try adjusting the filters!</p>
    );

    return (
        <div>
            <form className="custom-search-form" id="custom-search-form" onSubmit={(e) => e.preventDefault()}>
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
                        type="button"
                        id="custom-search-btn"
                        className="custom-search-btn"
                        onClick={() => fetchSearchResults(searchDish)}
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Filters Section */}
            <div className="filters">
                <div className="excluded-ingredients-display">
                    <h4>Excluded Ingredients:</h4>
                    <ul>
                        {excludedIngredients.map((ingredient) => (
                            <li key={ingredient}>
                                {ingredient}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngredient(ingredient)}
                                    style={{
                                        marginLeft: "8px",
                                        background: "transparent",
                                        border: "none",
                                        color: "red",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="filter-group">
                    <label>Spice Level Range:</label>
                    <div className="spice-level-inputs">
                        <input
                            type="number"
                            name="min"
                            min="1"
                            max="5"
                            value={spiceLevelRange.min}
                            onChange={handleSpiceLevelInputChange}
                        />
                        <span>to</span>
                        <input
                            type="number"
                            name="max"
                            min="1"
                            max="5"
                            value={spiceLevelRange.max}
                            onChange={handleSpiceLevelInputChange}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label htmlFor="excluded-ingredients">Exclude Ingredients:</label>
                    <input
                        type="text"
                        placeholder="Search Ingredients..."
                        value={ingredientSearch}
                        onChange={(e) => setIngredientSearch(e.target.value)}
                    />
                    <div className="ingredient-options">
                        {filteredIngredients.map((ingredient) => (
                            <div key={ingredient} className="ingredient-option">
                                <input
                                    type="checkbox"
                                    id={ingredient}
                                    value={ingredient}
                                    checked={excludedIngredients.includes(ingredient)}
                                    onChange={() => handleExcludedIngredientsChange(ingredient)}
                                />
                                <label htmlFor={ingredient}>{ingredient}</label>
                            </div>
                        ))}
                    </div>

                    <div className="custom-ingredient">
                        <input
                            type="text"
                            placeholder="Add Custom Ingredient"
                            value={customIngredient}
                            onChange={(e) => setCustomIngredient(e.target.value)}
                        />
                        <button type="button" onClick={handleAddCustomIngredient}>
                            Add
                        </button>
                    </div>
                </div>

                <div className="filter-actions">
                    <button
                        type="button"
                        className="apply-filters-button"
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </button>
                    <button
                        type="button"
                        className="reset-filters-button"
                        onClick={handleResetFilters}
                    >
                        Reset All Filters
                    </button>
                </div>
            </div>

            <div className="search-results">{content}</div>
        </div>
    );
}

function DishCard({ dish }) {
    return (
        <div className="search-results-item">
            <div className="header">
                <p>{dish.restaurant}</p>
            </div>
            <div className="content">
                <p><strong>Dish Name:</strong> {dish.name}</p>
                <p><strong>Location:</strong> {dish.location}</p>
                <p><strong>Tags:</strong> {dish.tags?.join(", ") || "No tags available"}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients?.join(", ") || "No ingredients available"}</p>
                <p><strong>Spice Level:</strong> {dish.spiceLevel || "Not specified"}</p>
            </div>
            <button className="view-button">
                <Link to={`/dish-details/${dish.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    View
                </Link>
            </button>
        </div>
    );
}

export default SearchResults;
