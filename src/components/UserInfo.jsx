import React, { useState } from "react";
import { useAuth } from "./AuthContext"

function UserInfo() {
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const { user } = useAuth();

    const handleDietarySelection = async (event) => {
        event.preventDefault();

        console.log("clicked the dietary restriction button");
        console.log(user.username);
        console.log(dietaryRestrictions);

        // This post request is not working. Needs to be fixed
        await fetch("/users/dietary-restrictions", {
            method: "POST", 
            body: {username: user.username, dietaryRestrictions: dietaryRestrictions}
        });
    }

    const handleChange = (event) => {
        const selectedRestrictions = Array.from(event.target.selectedOptions, option => option.value);
        setDietaryRestrictions(selectedRestrictions);
    }

    return (
        <div className="user-info-container">
            <div className="user-dietary-restrictions">
                <h1>Your dietary restrictions:</h1>
                {/* <p>{dietaryRestrictions.join(', ')}</p> */}
            </div>
            <div className="select-dietary-restrictions">
                <h1>Select your dietary restrictions</h1>
                <p>Hold down <b>CTRL</b> if you're on Windows or <b>Command</b> if you are on Mac to select multiple options</p>

                <form id="dietary-selection-form" onSubmit={handleDietarySelection}>
                    <select
                        id="dietary-restrictions-dropdown"
                        className="dietary-restrictions-dropdown"
                        multiple
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select your dietary restrictions</option>
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
    )
}

export default UserInfo;