import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        try {
            const response = await fetch("/login/status", {
                credentials: "include"
            });
            const data = await response.json();
            setUser(data.authenticated ? data.user : null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);