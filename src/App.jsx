import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import Home from "./components/redirect/Home";
import Profile from "./components/redirect/Profile";

import Login from "./components/Login";
import SignUp from "./components/SignUp";

import SearchResults from "./components/redirect/user/SearchResults";
import DishDetails from "./components/redirect/user/DishDetails";

function App() {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        try {
            const response = await fetch("/auth/status");
            const userData = await response.json();

            if (userData.authenticated) {
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log(err);
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <BrowserRouter>
            <div className="app">
                <Header user={user} refreshUser={refreshUser} />
                <Routes>
                    <Route path="/" element={
                        <main>
                            <Home user={user} />
                            <About />
                            <Services />
                            <Contact />
                        </main>
                    } />
                    <Route path="/search" element={<SearchResults user={user} />} />
                    <Route path="/login" element={<Login refreshUser={refreshUser} />} />
                    <Route path="/signup" element={<SignUp refreshUser={refreshUser} />} />
                    <Route path="/profile" element={<Profile user={user} refreshUser={refreshUser} />} />
                    <Route path="/dish-details/:dish" element={<DishDetails />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;