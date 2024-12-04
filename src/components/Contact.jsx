import React from "react";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
        <section id="contact" className="contact">
        <div className="container">
            <h2>Contact Us</h2>
            <p>Have questions or suggestions? We"d love to hear from you!</p>
            <form onSubmit={handleSubmit} className="contact-form">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit" className="submit-button">Send Message</button>
            </form>
        </div>
        </section>
    );
}

export default Contact;