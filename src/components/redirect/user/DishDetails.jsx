import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function DishDetails({ user }) {
    const urlParams = useParams();
    const dishID = urlParams.dish;

    const [dishDetails, setDishDetails] = useState();
    const [tags, setTags] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

            console.log("Json Data: ");
            console.log(data);

            const dataTags = data[0].tags.join(", ");
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

    // const tags = dishDetails[0].tags.length > 0 ? (
    //     dishDetails[0].tags.map((index, tag) => {
    //         <div key={index} className="tag">
    //             {tag}
    //         </div>
    //     })
    // ) : (
    //     <p>No tags for this dish yet.</p>
    // )

    const getTags = tags ? (
        <div>
            <h4>Tags:</h4> {tags};
        </div>
    ) : (
        <p><h4>Tags:</h4> No tags for this dish yet</p>
    )

    return (
        <>
            {
                dishDetails ? (
                    <div className="recipe-details-container">
                        <h3>{dishDetails[0].name}</h3>
                        <h4>Restaurant: {dishDetails[0].restaurant}</h4>
                        <h4>Location: {dishDetails[0].location}</h4>

                        <div className="tags-container">
                            {getTags}
                        </div>

                        <div className="add-tags">
                            <h4>Add tags for this dish:</h4>
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