import React from "react";

import UserInfo from "./user/UserInfo";
import RestaurantInfo from "./restaurant/RestaurantInfo";

function Profile({ user, refreshUser }) {
    if (!user) {
        return (
            <div>
                Please sign in
            </div>
        );
    }

    return (
        <div>
            {(user?.role  === "restaurant") ?
                <RestaurantInfo user={user} refreshUser={refreshUser} /> :
                <UserInfo user={user} refreshUser={refreshUser} />}
        </div>
    )
}

export default Profile;