// Function to handle the search form submission
async function handleSearchForm(event) {
    event.preventDefault();
    const food = document.getElementById('restaurant').value;

    if (food) {
        console.log("Searching for food...");
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
        document.getElementById('suggestion').textContent = 'Please enter a dish to search!';
    }
}

// Function to handle "Surprise Me" button click
// Includes cuisines
function handleSurpriseMe() {
    // Define dishes for each cuisine type
    const dishesByCuisine = {
        italian: [
            'Spaghetti Carbonara',
            'Margherita Pizza',
            'Lasagna',
            'Risotto',
            'Tiramisu'
        ],
        chinese: [
            'Kung Pao Chicken',
            'Sweet and Sour Pork',
            'Spring Rolls',
            'Fried Rice',
            'Dumplings'
        ],
        mexican: [
            'Tacos',
            'Burritos',
            'Quesadillas',
            'Enchiladas',
            'Churros'
        ],
        indian: [
            'Butter Chicken',
            'Paneer Tikka',
            'Biryani',
            'Naan',
            'Samosas'
        ],
        japanese: [
            'Sushi',
            'Ramen',
            'Tempura',
            'Teriyaki Chicken',
            'Mochi'
        ],
        french: [
            'Croissant',
            'Escargot',
            'Ratatouille',
            'Crepes',
            'Crème Brûlée'
        ],
        american: [
            'Cheeseburger',
            'BBQ Ribs',
            'Mac and Cheese',
            'Fried Chicken',
            'Apple Pie'
        ]
    };

    // Combine all dishes into a single array for the "Any" option
    const allDishes = Object.values(dishesByCuisine).flat();

    // Get the selected cuisine from the dropdown
    const selectedCuisine = document.getElementById('cuisine-dropdown').value;

    // Handle the "Any" option
    let dishes;
    if (selectedCuisine === 'any') {
        dishes = allDishes;
    } else {
        dishes = dishesByCuisine[selectedCuisine];
    }

    // If no dishes are found, show an error message
    if (!dishes || dishes.length === 0) {
        document.getElementById('suggestion').textContent = 'No dishes found for the selected cuisine!';
        return;
    }

    // Get a random dish from the selected cuisine or all dishes
    const randomIndex = Math.floor(Math.random() * dishes.length);
    const suggestion = dishes[randomIndex];

    // Update the suggestion div with the selected dish
    document.getElementById('suggestion').textContent = `BiteMap suggests you try: ${suggestion}`;
}

// Function to attach event listeners to elements
function attachEventListeners() {
    // Attach the handler for the "Find My Next Bite" button
    document.querySelector('.search-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        handleSurpriseMe(); // Use the surprise-me logic for dish suggestions
    });
}


document.addEventListener('DOMContentLoaded', attachEventListeners);
