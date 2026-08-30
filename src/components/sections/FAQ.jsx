"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
  {
    question: "What is the mission of JPRD Foundation?",
    answer: "JPRD Foundation works towards sustainable social development through targeted initiatives in quality education, vocational skill development, rural infrastructure development, and community empowerment."
  },
  {
    question: "How can I volunteer or contribute to JPRD?",
    answer: "You can sign up as a volunteer directly through our Volunteer section form on this page. For financial contributions or specific material support, please reach out to us at contact@jprd.org."
  },
  {
    question: "Where does JPRD Foundation primarily operate?",
    answer: "We currently focus our efforts in rural and semi-urban communities, with active project implementations running in the Mau district and surrounding areas, addressing key localized development gaps."
  },
  {
    question: "How does JPRD ensure transparency in its programs?",
    answer: "Transparency is core to our model. We implement a systematic tracking system mapping Inputs, Activities, Outputs, and final Outcomes, providing regular updates to our partners and community stakeholders."
  },
  {
    question: "Can corporations partner with JPRD under CSR guidelines?",
    answer: "Yes, JPRD is fully eligible to partner with corporate organisations for CSR programs. We design, execute, measure, and report on specific CSR-compliant initiatives in education, digital literacy, and community building."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faq} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Have Questions? We Have Answers.</h2>
          <p className={styles.subtitle}>
            Find quick answers to common questions about JPRD Foundation, our volunteering programs, and corporate partnerships.
          </p>
        </motion.div>

        <div className={styles.accordion}>
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div 
                key={idx} 
                className={`${styles.item} ${isOpen ? styles.activeItem : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <button 
                  className={styles.questionButton} 
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                >
                  <div className={styles.questionContent}>
                    <HelpCircle size={20} className={styles.helpIcon} />
                    <span className={styles.question}>{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className={styles.chevron} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={styles.answerWrapper}
                    >
                      <div className={styles.answer}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
