"use client";
import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Volunteer.module.css';
import Button from '../ui/Button';
import { CheckCircle2 } from 'lucide-react';

const Volunteer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [formState, setFormState] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('submitting');

    const name = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const phone = e.target.elements[2].value;
    const interest = e.target.elements[3].value;

    setTimeout(() => {
      // Save volunteer log in localStorage for Admin Panel view
      const stored = localStorage.getItem('jprd_volunteers');
      const volunteersList = stored ? JSON.parse(stored) : [];
      
      const interestMap = {
        education: "Education & Teaching",
        health: "Health Campaigns",
        events: "Event Organizing",
        skills: "Skill Training",
        other: "General Interest"
      };

      const newVol = {
        id: Date.now(),
        name,
        email,
        phone,
        interest: interestMap[interest] || "General Interest",
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      
      localStorage.setItem('jprd_volunteers', JSON.stringify([newVol, ...volunteersList]));
      setFormState('success');
    }, 1500);
  };

  return (
    <section id="volunteer" className={styles.volunteer} ref={ref}>
      <div className={styles.background}>
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.textContent}>
            <h2 className={styles.title}>Your Time Can Create Change.</h2>
            <p className={styles.subtitle}>
              Join a community of people who believe that meaningful change begins with action.
            </p>
          </div>

          <div className={styles.formWrapper}>
            {formState === 'success' ? (
              <motion.div 
                className={styles.successMessage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h3>Thank you for stepping up!</h3>
                <p>We've received your details and our team will connect with you shortly.</p>
              </motion.div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <input type="text" placeholder="Full Name" required className={styles.input} />
                  <input type="email" placeholder="Email Address" required className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="tel" placeholder="Phone Number" required className={styles.input} />
                  <select className={styles.select} required defaultValue="">
                    <option value="" disabled>Area of Interest</option>
                    <option value="education">Education & Teaching</option>
                    <option value="health">Health Campaigns</option>
                    <option value="events">Event Organizing</option>
                    <option value="skills">Skill Training</option>
                    <option value="other">Other / Open to anything</option>
                  </select>
                </div>
                <textarea placeholder="Why do you want to volunteer? (Optional)" className={styles.textarea}></textarea>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className={styles.submitBtn} 
                  type="submit"
                  disabled={formState === 'submitting'}
                >
                  {formState === 'submitting' ? 'Sending...' : 'Become a Volunteer'}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Volunteer;
