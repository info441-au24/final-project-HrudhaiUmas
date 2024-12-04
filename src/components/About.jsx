import React from "react";

function About() {
    const teamMembers = [
        {
            name: "Hrudhai Umas",
            major: "Informatics & Data Science",
            year: "Class of 2026",
            image: "/images/HrudhaiPFP.jpeg",
            linkedin: "https://linkedin.com/in/hrudhai-umas"
        },
        {
            name: "Kaden Kapadia",
            major: "Informatics & Data Science",
            year: "Class of 2026",
            image: "/images/KadenPFP.jpeg",
            linkedin: "https://www.linkedin.com/in/kadenkapadia/"
        },
        {
            name: "Kush Patel",
            major: "Informatics",
            year: "Class of 2025",
            image: "/images/KushPFP.jpeg",
            linkedin: "https://www.linkedin.com/in/kushpateluw"
        },
        {
            name: "An Nguyen",
            major: "Informatics",
            year: "Class of 2027",
            image: "/images/AnPFP.jpg",
            linkedin: "https://www.linkedin.com/in/nguyean/"
        }
    ];

    return (
        <section id="about" className="about">
        <div className="container">
            <h2>About Us</h2>
            <p>
                At BiteMap, we're passionate food enthusiasts committed to redefining how you explore and enjoy your meals.
                Our mission is to provide personalized dining experiences by focusing on individual menu items rather than
                just restaurants, helping you find hidden culinary gems that suit your unique taste.
            </p>
            <div className="team-grid">
            {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                <img src={member.image} alt={`${member.name} headshot`} className="team-photo" />
                <h3>{member.name}</h3>
                <p>Major: {member.major}</p>
                <p>{member.year}</p>
                <a href={member.linkedin} target="_blank" className="linkedin-link">
                    LinkedIn
                </a>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}

export default About;