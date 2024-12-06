import React from "react";

import UserInfo from "./user/UserInfo";
import RestaurantInfo from "./restaurant/RestaurantInfo";

function Profile({ user }) {
    if (!user) {
        return (
            <div>
                Please sign in
            </div>
        );
    }

    return (
        <div>
            {(user?.role  === "restaurant") ? <RestaurantInfo user={user} /> : <UserInfo user={user} />}
        </div>
    )
}

export default Profile;