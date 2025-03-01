import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../style/Faq.css";

const faqData = [
    {
      category: "Getting Started",
      questions: [
        { question: "What is Task Bridge?", answer: "Task Bridge is a collaborative project management tool that helps teams track tasks, communicate efficiently, and manage projects with ease. It offers features like real-time messaging, document sharing, and a built-in calendar." },
        { question: "How do I sign up for Task Bridge?", answer: "To sign up, visit our website, click on 'Sign Up,' enter your details, verify your email, and log in to access your dashboard." },
        { question: "Is Task Bridge free to use?", answer: "Yes! We offer a free plan with essential features. For advanced project management tools, you can upgrade to our premium plan." },
        { question: "Can I invite my team members?", answer: "Absolutely! You can invite team members by going to the 'Team Management' section and sending an invite via email." },
        { question: "Does Task Bridge support guest users?", answer: "Yes! You can invite external stakeholders as guest users with limited permissions." },
        { question: "Is Task Bridge available on mobile?", answer: "Yes! Our web version is mobile-friendly, and we are working on a mobile app release soon." },
        { question: "Can I use Task Bridge without an internet connection?", answer: "Currently, an internet connection is required, but we are working on an offline mode for future updates." },
        { question: "What browsers support Task Bridge?", answer: "Task Bridge works best on Chrome, Firefox, Safari, and Edge." },
        { question: "How do I reset my password?", answer: "Go to the login page, click on 'Forgot Password,' and follow the instructions to reset it via email verification." },
        { question: "Where can I get support?", answer: "You can visit our Help Center or contact our support team via email or live chat." },
      ],
    },
    {
      category: "Task Management",
      questions: [
        { question: "How do I create a new task?", answer: "Click the 'New Task' button, enter task details, assign members, and set deadlines. Your task will be added to the project board." },
        { question: "Can I assign tasks to multiple people?", answer: "Yes! You can assign tasks to multiple team members for better collaboration." },
        { question: "What are task priorities?", answer: "Task priorities indicate urgency levels: High, Medium, and Low, helping teams focus on important work first." },
        { question: "How can I track the progress of a task?", answer: "Each task has statuses: 'To Do,' 'In Progress,' 'Review,' and 'Done.' Progress is updated as the task moves through these stages." },
        { question: "Can I set task deadlines?", answer: "Yes! You can set deadlines while creating tasks. Overdue tasks will be highlighted." },
        { question: "How do I edit or delete a task?", answer: "Click on the task, select 'Edit' to update details, or 'Delete' to remove it permanently." },
        { question: "Can I add attachments to tasks?", answer: "Yes, you can attach files, images, and documents to any task for better collaboration." },
        { question: "How does task approval work?", answer: "When a task is marked as 'Review,' an admin must approve it before it moves to 'Done.'" },
        { question: "Can I add comments on tasks?", answer: "Yes, you can add comments, mention team members, and attach files in the task discussion panel." },
        { question: "Can I duplicate a task?", answer: "Yes, you can duplicate tasks to create similar ones without entering details from scratch." },
      ],
    },
    {
      category: "Messaging & Communication",
      questions: [
        { question: "Does Task Bridge have real-time chat?", answer: "Yes! Our real-time chat system allows seamless one-to-one communication." },
        { question: "Can I send audio messages?", answer: "Yes! You can record and send voice messages directly in the chat." },
        { question: "How do I check if a message is read?", answer: "We use read receipts—'Sent,' 'Delivered,' and 'Seen' indicators." },
        { question: "Is there a typing indicator?", answer: "Yes, you'll see when the other person is typing in real-time." },
        { question: "Can I delete a message?", answer: "Yes, you can delete messages for yourself or for everyone." },
        { question: "Does Task Bridge have group chat?", answer: "Currently, we only support one-to-one messaging. Group chat will be introduced soon." },
        { question: "Can I see my chat history?", answer: "Yes, all conversations are stored and can be accessed anytime." },
        { question: "Can I mute chat notifications?", answer: "Yes, you can mute notifications for specific conversations." },
        { question: "Is chat encrypted?", answer: "Yes, we use end-to-end encryption for secure communication." },
        { question: "Can I send images or documents in chat?", answer: "Yes! You can attach files, images, and documents in messages." },
      ],
    },
  ];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (



    <div className="faq-container">

             {/* Home Button */}
     <div className="faq-header">
     <Link to="/home" className="home-faq-button">
       Home
     </Link>
    </div>

      <motion.h1 
        className="faq-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Frequently Asked Questions
      </motion.h1>

      {faqData.map((section, sectionIndex) => (
        <motion.div 
          key={sectionIndex} 
          className="faq-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.3 }}
        >
          <h2 className="faq-category">{section.category}</h2>
          {section.questions.map((faq, index) => (
            <motion.div 
              key={index} 
              className="faq-item"
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleAccordion(`${sectionIndex}-${index}`)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-icon">{openIndex === `${sectionIndex}-${index}` ? "−" : "+"}</span>
              </div>
              {openIndex === `${sectionIndex}-${index}` && (
                <motion.div 
                  className="faq-answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default Faq;
