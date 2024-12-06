import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const dishesByCuisine = {
    italian: [
        'Spaghetti Carbonara', 'Margherita Pizza', 'Lasagna', 'Risotto', 'Tiramisu'
    ],
    chinese: [
        'Kung Pao Chicken','Sweet and Sour Pork','Spring Rolls','Fried Rice','Dumplings'
    ],
    mexican: [
        'Tacos', 'Burritos', 'Quesadillas', 'Enchiladas', 'Churros'
    ],
    indian: [
        'Butter Chicken', 'Paneer Tikka', 'Biryani', 'Naan', 'Samosas'
    ],
    japanese: [
        'Sushi', 'Ramen', 'Tempura', 'Teriyaki Chicken', 'Mochi'
    ],
    french: [
        'Croissant', 'Escargot', 'Ratatouille', 'Crepes', 'Crème Brûlée'
    ],
    american: [
        'Cheeseburger', 'BBQ Ribs', 'Mac and Cheese', 'Fried Chicken', 'Apple Pie'
    ]
};

function SearchBox() {
    const navigate = useNavigate();
    const [searchDish, setSearchDish] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState("");

    const handleSurpriseMe = (e) => {
        e.preventDefault();

        const allDishes = Object.values(dishesByCuisine).flat();
        const dishes = selectedCuisine === 'any' ? allDishes : dishesByCuisine[selectedCuisine];

        if (!dishes || dishes.length === 0) {
            setSuggestion('No dishes found for the selected cuisine!');
            return;
        }

        const randomIndex = Math.floor(Math.random() * dishes.length);
        const randomDish = dishes[randomIndex];

        setSearchDish(randomDish);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/search", {
            state: {
                dish: searchDish
            }
        });
    }

    return (
        <section id="home" className="hero">
            <div className="hero-content">
                <div className="overlay">
                    <h2>Discover Your Next Bite</h2>
                    <p>Find the best dishes in Seattle, tailored to your taste!</p>

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

                    <p>--- Or, select a cuisine and let us find you a bite ---</p>

                    <form className="search-form" onSubmit={handleSurpriseMe}>
                        <div className="restaurant-input">
                            <select
                                id="cuisine-dropdown"
                                className="cuisine-dropdown"
                                value={selectedCuisine}
                                onChange={(e) => setSelectedCuisine(e.target.value)}
                            >
                                <option value="" disabled>Select a cuisine</option>
                                <option value="any">Any</option>
                                <option value="italian">Italian</option>
                                <option value="chinese">Chinese</option>
                                <option value="mexican">Mexican</option>
                                <option value="indian">Indian</option>
                                <option value="japanese">Japanese</option>
                                <option value="french">French</option>
                                <option value="american">American</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="search-btn"
                            disabled={!selectedCuisine}
                            onClick={handleSurpriseMe}
                        >
                            Find My Next Bite 😋
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default SearchBox;