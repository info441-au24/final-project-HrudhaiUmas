import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const TAG_OPTIONS = [
    "Vegan",
    "Vegetarian",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Kosher",
    "Halal"
];

function DishDetails({ user }) {
    const urlParams = useParams();
    const dishID = urlParams.dish;

    const [dishDetails, setDishDetails] = useState();
    const [tags, setTags] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const initializeFetch = async () => {
            await fetchDishDetails();
        };

        initializeFetch();
    }, [dishID, user]);

    const fetchDishDetails = async () => {
        try {
            console.log("sending fetch request")
            const response = await fetch(`/api/dishes/details?id=${encodeURIComponent(dishID)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Getting the json response");
            const data = await response.json();

            const dataTags = data[0].tags;
            console.log("dataTags: ", dataTags);

            setTags(dataTags);

            console.log("Saving data to state");
            setDishDetails(data);
        } catch (error) {
            console.log("Error fetching dish details: ", error)
            setError("Error fetching dish details. Please try again later.")
        } finally {
            setIsLoading(false);
        }
    }

    if (error) {
        return <div>{error}</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const handleChange = (event) => {
        const newSelected = Array.from(event.target.selectedOptions, (option) => option.value);
        console.log("newSelected: ", newSelected);
        setSelectedTags(newSelected);
    };

    const handleTagSelection = async (event) => {
        event.preventDefault();

        let allTags = [];

        for(let i = 0; i < tags.length; i++) {
            allTags.push(tags[i]);
        }

        for(let i = 0; i < selectedTags.length; i++) {
            allTags.push(selectedTags[i]);
        }

        console.log("All tags: ", allTags)

        try {
            const response = await fetch("/api/dishes/tag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: dishID,
                    tags: allTags,
                }),
                credentials: "include",
            });

            if (response.ok) {
                setTags(allTags);
                setStatusMessage("Tags updated successfully!");
            } else {
                setSelectedTags(tags);
                setStatusMessage("Failed to update tags.");
            }
        } catch (err) {
            console.error("Error updating tags:", err);
            setStatusMessage("Error updating tags.");
            setSelectedTags(tags);
        }

        // Clear the status message after 5 seconds
        setTimeout(() => setStatusMessage(""), 5000);
    };

    return (
        <>
            {
                dishDetails ? (
                    <div className="recipe-details-container">
                        <h3>{dishDetails[0].name}</h3>
                        <h4>Restaurant: {dishDetails[0].restaurant}</h4>
                        <h4>Location: {dishDetails[0].location}</h4>

                        <div className="tags-container">
                            {
                                tags.length > 0 
                                ? (
                                    tags.join(", ")
                                ) : (
                                    "This dish does not have any tags yet."
                                )
                            }
                        </div>

                        <div className="add-tags">
                            <h4>Add tags for this dish:</h4>
                            <h5>To select multiple tags, use the ctrl key on Windows and command key on Mac.</h5>
                            <form onSubmit={handleTagSelection}>
                                <select
                                    multiple
                                    onChange={handleChange}
                                    value={selectedTags}
                                    className="dietary-dropdown"
                                >
                                    {TAG_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
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
                ) : (
                    <p>No details found for this dish.</p>
                )
            }
        </>
    )
}

export default DishDetails;