import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { checkAuthStatus } from "./components/utils/authStatus";

import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        const userData = await checkAuthStatus();
        if (userData.authenticated) {
            setUser(userData);
        } else {
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
                    <Route path="/login" element={<Login refreshUser={refreshUser} />} />
                    <Route path="/signup" element={<SignUp refreshUser={refreshUser} />} />
                    <Route path="/profile" element={<Profile user={user} /> } />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;