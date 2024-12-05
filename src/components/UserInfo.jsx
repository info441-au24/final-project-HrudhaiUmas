import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

function UserInfo() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const { user } = useAuth();

    // Fetch dietary restrictions on load
    const fetchDietaryRestrictions = async () => {
        try {
            const response = await fetch(`/api/users/${user.username}/dietary-restrictions`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched dietary restrictions:", data.dietaryRestrictions);
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
                alert("Dietary restrictions updated successfully!");
                fetchDietaryRestrictions(); // Refresh dietary restrictions
            } else {
                console.error("Failed to update dietary restrictions.");
            }
        } catch (err) {
            console.error("Error updating dietary restrictions:", err);
        }
    };

    // Handle change in dietary restrictions selection
    const handleChange = (event) => {
        const selectedRestrictions = Array.from(event.target.selectedOptions, (option) => option.value);
        console.log("Selected restrictions:", selectedRestrictions);
        setDietaryRestrictions(selectedRestrictions);
    };

    return (
        <div className="user-info-container">
            <div className="user-dietary-restrictions">
                <h1>Your dietary restrictions:</h1>
                <p>{dietaryRestrictions.join(", ") || "None selected"}</p>
            </div>
            <div className="select-dietary-restrictions">
                <h1>Select your dietary restrictions</h1>
                <p>
                    Hold down <b>CTRL</b> if you're on Windows or <b>Command</b> if you are on Mac to select multiple options.
                </p>
                <form id="dietary-selection-form" onSubmit={handleDietarySelection}>
                    <select
                        id="dietary-restrictions-dropdown"
                        className="dietary-restrictions-dropdown"
                        multiple
                        onChange={handleChange}
                        value={dietaryRestrictions}
                    >
                        <option value="Vegan">Vegan</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Lactose Intolerant">Lactose Intolerant</option>
                        <option value="Gluten Intolerant">Gluten Intolerant</option>
                        <option value="Kosher">Kosher</option>
                        <option value="Halal">Halal</option>
                    </select>
                    <button id="submit-dietary-selection">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UserInfo;
