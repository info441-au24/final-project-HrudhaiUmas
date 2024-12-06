import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

function UserInfo() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [statusMessage, setStatusMessage] = useState(""); // New state for status messages
    const { user } = useAuth();

    // Fetch dietary restrictions on load
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
            } else {
                console.error("Failed to fetch dietary restrictions.");
            }
        } catch (err) {
            console.error("Error fetching dietary restrictions:", err);
        }
    };

    useEffect(() => {
        fetchDietaryRestrictions();
    }, [user]);

    // Handle dietary restrictions update
    const handleDietarySelection = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/users/dietary-restrictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user.username,
                    dietaryRestrictions,
                }),
                credentials: "include",
            });

            if (response.ok) {
                setStatusMessage("Dietary restrictions updated successfully!");
                fetchDietaryRestrictions(); // Refresh dietary restrictions
            } else {
                setStatusMessage("Failed to update dietary restrictions.");
            }
        } catch (err) {
            console.error("Error updating dietary restrictions:", err);
            setStatusMessage("Error updating dietary restrictions.");
        }

        // Clear the status message after 5 seconds
        setTimeout(() => setStatusMessage(""), 5000);
    };

    // Handle change in dietary restrictions selection
    const handleChange = (event) => {
        const selectedRestrictions = Array.from(event.target.selectedOptions, (option) => option.value);
        setDietaryRestrictions(selectedRestrictions);
    };

    return (
        <div className="user-info-page">
            { user ? (
                <>
                    <div className="user-profile-section">
                        <h1>Welcome, {user?.username}!</h1>
                    </div>
                    <div className="user-dietary-section">
                        <h2>Your Dietary Restrictions</h2>
                        <p className="dietary-list">
                            {dietaryRestrictions.length > 0
                                ? dietaryRestrictions.join(", ")
                                : "No dietary restrictions selected."}
                        </p>
                        <div className="dietary-selection-form">
                            <h3>Update Your Dietary Restrictions</h3>
                            <h5>To select multiple or remove any dietary restrictions, use the ctrl key on Windows and command key on Mac.</h5>
                            <form onSubmit={handleDietarySelection}>
                                <select
                                    multiple
                                    onChange={handleChange}
                                    value={dietaryRestrictions}
                                    className="dietary-dropdown"
                                >
                                    <option value="Vegan">Vegan</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Lactose Intolerant">Lactose Intolerant</option>
                                    <option value="Gluten Intolerant">Gluten Intolerant</option>
                                    <option value="Kosher">Kosher</option>
                                    <option value="Halal">Halal</option>
                                </select>
                                <button className="update-button" type="submit">
                                    Save Changes
                                </button>
                            </form>
                            {statusMessage && (
                                <p className="status-message">{statusMessage}</p> // Display status message
                            )}
                        </div>
                    </div>
                    <div className="user-additional-section">
                        <h2>Your Activity</h2>
                        <p>Reviews and other activities will be displayed here.</p>
                    </div>
                </>
            ) : "Please Sign In" }
        </div>
    );
}

export default UserInfo;
