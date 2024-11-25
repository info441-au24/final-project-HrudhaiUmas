// Created method to be able to get the current location of user!
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
        alert('Location service is not supported by browser.');
    }
}

// handle the search form submission TODO NEED TO DO ALG HERE (this also isnt working idk why :( ))
function handleSearchForm(event) {
    event.preventDefault();
    const food = document.getElementById('restaurant').value;
    const location = document.getElementById('location').value;

    if (food && location) {
        alert(`Searching for "${food}" near "${location}"`);
        // THIS IS WHREE WE NEED TO DO SEARCH LOGIC
    } else {
        alert('Please fill in both fields!');
    }
}



function attachEventListeners() {
    document.getElementById('current-location').addEventListener('click', getCurrentLocation);

    document.getElementById('surprise-me').addEventListener('click', () => {
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
            'Tiramisu'
        ];

        const randomIndex = Math.floor(Math.random() * randomDishes.length);
        document.getElementById('restaurant').value = randomDishes[randomIndex];
        alert(`Surprise! How about trying: ${randomDishes[randomIndex]}?`);
    });

    // not working for some reason should show an alert
    document.querySelector('.search-form').addEventListener('submit', handleSearchForm);
}

document.addEventListener('DOMContentLoaded', attachEventListeners);
