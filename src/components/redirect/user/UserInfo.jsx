import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DIETARY_OPTIONS = [
    "Vegan",
    "Vegetarian",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Kosher",
    "Halal",
];

function UserInfo({ user }) {
    const [savedRestrictions, setSavedRestrictions] = useState([]);
    const [selectedRestrictions, setSelectedRestrictions] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        fetchDietaryRestrictions();
        fetchUserReviews();
    }, []);

    const fetchDietaryRestrictions = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${user.username}/dietary-restrictions`);

            if (response.ok) {
                const data = await response.json();
                const restrictions = data.dietaryRestrictions || [];
                setSavedRestrictions(restrictions);
                setSelectedRestrictions(restrictions);
            } else {
                console.error("Failed to fetch dietary restrictions.");
            }
        } catch (err) {
            console.error("Error fetching dietary restrictions:", err);
        }
    };

    const fetchUserReviews = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/reviews/user/${user.username}`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUserReviews(data.reviews || []);
            } else {
                console.error("Failed to fetch user reviews.");
            }
        } catch (err) {
            console.error("Error fetching user reviews:", err);
        }
    };

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
                    dietaryRestrictions: selectedRestrictions,
                }),
                credentials: "include",
            });

            if (response.ok) {
                setSavedRestrictions(selectedRestrictions);
                setStatusMessage("Dietary restrictions updated successfully!");
            } else {
                setSelectedRestrictions(savedRestrictions);
                setStatusMessage("Failed to update dietary restrictions.");
            }
        } catch (err) {
            console.error("Error updating dietary restrictions:", err);
            setStatusMessage("Error updating dietary restrictions.");
            setSelectedRestrictions(savedRestrictions);
        }

        setTimeout(() => setStatusMessage(""), 5000);
    };

    const handleChange = (event) => {
        const newSelected = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedRestrictions(newSelected);
    };

    return (
        <div className="user-info-page">
            <div className="user-profile-section">
                <h1>Welcome, {user?.username}!</h1>
            </div>
            <div className="user-dietary-section">
                <h2>Your Dietary Restrictions</h2>
                <p className="dietary-list">
                    {savedRestrictions.length > 0
                        ? savedRestrictions.join(", ")
                        : "No dietary restrictions selected."}
                </p>
                <div className="dietary-selection-form">
                    <h3>Update Your Dietary Restrictions</h3>
                    <h5>To select multiple or remove any dietary restrictions, use the ctrl key on Windows and command key on Mac.</h5>
                    <form onSubmit={handleDietarySelection}>
                        <select
                            multiple
                            onChange={handleChange}
                            value={selectedRestrictions}
                            className="dietary-dropdown"
                        >
                            {DIETARY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <button className="update-button" type="submit">
                            Save Changes
                        </button>
                    </form>
                    {statusMessage && (
                        <p className="status-message">{statusMessage}</p>
                    )}
                </div>
            </div>
            <div className="user-additional-section">
                <h2>Your Activity</h2>
                {userReviews.length > 0 ? (
                    <table className="user-reviews-table">
                        <thead>
                            <tr>
                                <th>Dish</th>
                                <th>Comment</th>
                                <th>Rating</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userReviews.map((review) => (
                                <tr key={review._id}>
                                    <td>{review.dish?.name || "Unknown Dish"}</td>
                                    <td>{review.comment}</td>
                                    <td>{review.rating}/5</td>
                                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {review.dish?._id && (
                                            <Link
                                                to={`/dish-details/${review.dish._id}`}
                                                className="view-dish-button"
                                            >
                                                View Dish
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                ) : (
                    <p>No activity yet. Start by posting your first review!</p>
                )}
            </div>
        </div>
    );
}

export default UserInfo;