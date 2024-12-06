import React, { useState } from "react";

function Contact() {
    // State for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log or process the message (you can replace this with API logic)
        console.log("Message Sent:", { name, email, message });

        // Clear form fields
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <section id="contact" className="contact">
            <div className="container">
                <h2>Contact Us</h2>
                <p>Have questions or suggestions? We'd love to hear from you!</p>
                <form onSubmit={handleSubmit} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        autoComplete="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="submit-button">
                        Send Message
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Contact;
