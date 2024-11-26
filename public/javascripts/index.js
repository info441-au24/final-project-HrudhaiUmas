// Function to get the current location of the user
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('location').value = `Lat: ${latitude}, Lon: ${longitude}`;
            },
            (error) => {
                alert('Unable to retrieve your location. Please enter it manually.');
            }
        );
    } else {
        alert('Location service is not supported by your browser.');
    }
}

// Function to handle the search form submission
async function handleSearchForm(event) {
    event.preventDefault();
    const food = document.getElementById('restaurant').value;
    const location = document.getElementById('location').value;

    if (food && location) {
        console.log("Searching for food and location...");
        const searchResultsSection = document.getElementById("search-results");

        try {
            const response = await fetch(`api/dishes/search?food=${encodeURIComponent(food)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const searchResultsJSON = await response.json();
            console.log("Search Results JSON: ", searchResultsJSON);

            if (searchResultsJSON.length > 0) {
                const searchResultHTML = searchResultsJSON.map(dish => `
                    <div class="search-results-item">
                        <p>${dish.name}</p>
                    </div>
                `).join("");
                searchResultsSection.innerHTML = searchResultHTML;
            } else {
                searchResultsSection.innerHTML = '<p>No dishes found. Try searching for something else!</p>';
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            searchResultsSection.innerHTML = '<p>Error fetching search results. Please try again later.</p>';
        }
    } else {
        document.getElementById('suggestion').textContent = 'Please fill in both fields!';
    }
}

// Function to handle "Surprise Me" button click
function handleSurpriseMe() {
    const randomDishes = [
        'Spaghetti Carbonara',
        'Sushi Platter',
        'BBQ Ribs',
        'Avocado Toast',
        'Pad Thai',
        'Cheeseburger',
        'Vegetarian Pizza',
        'Butter Chicken',
        'Pho',
        'Tiramisu',
        'Fish Tacos',
        'Ramen',
        'Chocolate Lava Cake',
        'Falafel Wrap',
        'Chicken Alfredo',
        'Margherita Pizza',
        'Lobster Roll',
        'Greek Salad',
        'Shawarma',
        'Crème Brûlée',
        'Tom Yum Soup',
        'Steak Frites',
        'Korean Fried Chicken',
        'Vegan Buddha Bowl',
        'Mac and Cheese',
        'Churros with Chocolate Sauce',
        'Beef Wellington',
        'Paneer Tikka',
        'Tempura Shrimp',
        'Ice Cream Sundae'
    ];

    // Select a random dish from the list
    const randomIndex = Math.floor(Math.random() * randomDishes.length);
    const suggestion = randomDishes[randomIndex];

    // Update the suggestion div with the selected dish
    document.getElementById('suggestion').textContent = `BiteMap suggests you try: ${suggestion}`;
}

// Function to attach event listeners to elements
function attachEventListeners() {
    document.getElementById('current-location').addEventListener('click', getCurrentLocation);

    // Attach the Surprise Me handler
    document.getElementById('surprise-me').addEventListener('click', handleSurpriseMe);

    // Attach the search form handler
    document.querySelector('.search-form').addEventListener('submit', handleSearchForm);
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', attachEventListeners);
