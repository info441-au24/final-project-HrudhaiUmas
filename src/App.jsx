import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import SearchBox from "./components/SearchBox";
import SearchResults from "./components/SearchResults";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;