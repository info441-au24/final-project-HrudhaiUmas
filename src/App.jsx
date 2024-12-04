import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import SearchBox from './components/SearchBox';
import SearchResults from './components/SearchResults';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
    return (
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
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;