import React, { useState } from "react";
import Navbar from "../components/Navbar";


const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="homepage-container">
            <Navbar />
                <div
                    className="main-content"
                    style={{
                    display: "flex",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    width: "100%",
                    }}
                >
                <input
                    type="text"
                    placeholder="Search for anything"
                    className="navbar-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            <h1>EventSphere</h1>
                </div>
            

      </div>
    );
};

export default HomePage;

