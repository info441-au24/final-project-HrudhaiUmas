import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import UserInfo from "./components/user/UserInfo";
import RestaurantInfo from "./components/restaurant/RestaurantInfo";

import SearchBox from "./components/user/SearchBox";
import SearchResults from "./components/user/SearchResults";

import RestaurantDashboard from "./components/restaurant/RestaurantDashboard";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <Header />
                    <Routes>
                        <Route path="/" element={
                            <main>
                                <SearchBox />
                                <About />
                                <Services />
                                <Contact />
                            </main>
                        } />
                        <Route path="/search" element={ <SearchResults /> } />
                        <Route path="/login" element={ <Login /> } />
                        <Route path="/signup" element={ <SignUp /> } />
                        <Route path="/user/info" element={ <UserInfo />} />
                        <Route path="/restaurant/info" element={ <RestaurantInfo /> } />
                        <Route path="/restaurant/dashboard" element={ <RestaurantDashboard /> } />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;