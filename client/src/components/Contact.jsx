import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from "framer-motion";
import "../style/Contact.css"; // External CSS file

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Sending...");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus("❌ Please fill all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const form = e.target;
      await emailjs.sendForm(
        "service_95ulhwq",    // Replace with your EmailJS Service ID
        "template_1s2w0yi",   // Replace with your EmailJS Template ID
        form,
        "nhKT0pj_XHjn32KlL"     // Replace with your EmailJS Public Key
      );
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("❌ Failed to send message. Try again.");
      console.error("EmailJS Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="contact-content">
        <motion.h2 
          className="contact-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Contact Task Bridge
        </motion.h2>
        <motion.p 
          className="contact-description"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Have questions or want to collaborate? Reach out to us! We're here to help you streamline your tasks and projects.
        </motion.p>

        <form onSubmit={handleSubmit} className="contact-form">
          <motion.input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
          <motion.input 
            type="text" 
            name="subject" 
            placeholder="Subject" 
            value={formData.subject} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          />
          <motion.textarea 
            name="message" 
            placeholder="Your Message" 
            rows="4" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
          <motion.button 
            type="submit" 
            className={`contact-btn ${isLoading ? "loading" : ""}`} 
            disabled={isLoading}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>

        <motion.p 
          className="status-message"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {status}
        </motion.p>

        <div className="social-links">
          <motion.h3 
            className="social-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            Connect with Owner of Task Bridge
          </motion.h3>
          <div className="connect-cards">
            <motion.a 
              href="https://www.linkedin.com/in/priy-mavani/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="connect-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <FaLinkedin className="connect-icon" />
              <span>LinkedIn</span>
            </motion.a>
            <motion.a 
              href="https://github.com/priymavani" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="connect-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              <FaGithub className="connect-icon" />
              <span>GitHub</span>
            </motion.a>
            <motion.a 
              href="mailto:priymavani02@gmail.com" 
              className="connect-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <FaEnvelope className="connect-icon" />
              <span>Email</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;