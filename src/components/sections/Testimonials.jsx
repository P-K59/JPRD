"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';
import { dbService } from '../../lib/dbService';

const defaultTestimonials = [
  {
    name: "Rohan Verma",
    role: "Education Drive Beneficiary",
    quote: "Thanks to JPRD Foundation, I received a learning scholarship and academic supplies. They support rural pupils like me who otherwise have restricted educational resources.",
    avatar: "RV"
  },
  {
    name: "Dr. Shalini Mehta",
    role: "Voluntary General Physician",
    quote: "Volunteering at JPRD's health camps has been incredibly fulfilling. Their team handles planning and execution with absolute sincerity, putting community welfare first.",
    avatar: "SM"
  },
  {
    name: "Vikram Malhotra",
    role: "CSR Partner Representative",
    quote: "Our company partnered with JPRD for digital literacy training. Their clear documentation and regular output indicators make them a highly dependable CSR execution partner.",
    avatar: "VM"
  }
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const unsubscribe = dbService.subscribe('testimonials', defaultTestimonials, (data) => {
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  // Make sure activeIndex doesn't overshoot if testimonials length decreases
  const safeIndex = activeIndex >= testimonials.length ? 0 : activeIndex;

  return (
    <section id="testimonials" className={styles.testimonials} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Voices of Impact.</h2>
          <p className={styles.subtitle}>
            Hear directly from our volunteers, community beneficiaries, and corporate partners.
          </p>
        </motion.div>

        <div className={styles.carouselContainer}>
          <div className={styles.slider}>
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                className={styles.slide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.quoteWrapper}>
                  <Quote size={56} className={styles.quoteIcon} />
                  <p className={styles.quoteText}>
                    “{testimonials[safeIndex].quote}”
                  </p>
                </div>
                
                <div className={styles.authorInfo}>
                  <div className={styles.avatar}>
                    {testimonials[safeIndex].avatar}
                  </div>
                  <div>
                    <h4 className={styles.name}>{testimonials[safeIndex].name}</h4>
                    <p className={styles.role}>{testimonials[safeIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className={styles.navigation}>
              <button className={styles.navBtn} onClick={handlePrev} aria-label="Previous testimonial">
                <ChevronLeft size={24} />
              </button>
              <div className={styles.indicators}>
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.indicator} ${idx === safeIndex ? styles.activeIndicator : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button className={styles.navBtn} onClick={handleNext} aria-label="Next testimonial">
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
