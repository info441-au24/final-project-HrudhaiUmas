import React from 'react';

function Services() {
    const services = [
        {
            title: "Personalized Recommendations",
            description: "Get dish recommendations tailored to your dietary needs and preferences."
        },
        {
            title: "Discover Top-Rated Dishes",
            description: "Explore highly-rated dishes from your favorite restaurants."
        },
        {
            title: "Advanced Filtering",
            description: "Filter dishes by ingredients, spice levels, or dietary restrictions."
        }
    ];

    return (
        <section id="services" className="services">
        <div className="container">
            <h2>Our Services</h2>
            <div className="service-grid">
            {services.map((service, index) => (
                <div key={index} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}

export default Services;