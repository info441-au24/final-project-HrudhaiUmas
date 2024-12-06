import React from "react";

import SearchBox from "./user/SearchBox";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";

function Home({ user }) {
    return (
        <div>
            {(user?.role  === "restaurant") ? <RestaurantDashboard /> : <SearchBox />}
        </div>
    );
}

export default Home;