import React from "react";
import { useParams } from 'react-router-dom';

function DishDetails() {
    const urlParams = useParams();
    const dish = urlParams.dish;

    return(
        <div>
            <p>On dish details page for {dish}</p>
        </div>
    )
}

export default DishDetails;