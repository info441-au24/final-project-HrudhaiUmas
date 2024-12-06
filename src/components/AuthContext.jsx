import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        try {
            const response = await fetch("/auth/status", {
                credentials: "include"
            });
            const data = await response.json();
            setUser(data.authenticated ? data.user : null);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);