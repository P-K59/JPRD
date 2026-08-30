"use client";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import Button from '../ui/Button';
import { dbService } from '../../lib/dbService';

const defaultCarousel = [
  { url: '/images/carousel-1.jpg' },
  { url: '/images/carousel-2.jpg' },
  { url: '/images/carousel-3.jpg' },
  { url: '/images/carousel-4.jpg' }
];

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [carousel, setCarousel] = useState(defaultCarousel);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = dbService.subscribe('carousel', defaultCarousel, (data) => {
      if (data && data.length > 0) {
        setCarousel(data);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isHovered || carousel.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carousel.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, carousel]);

  if (carousel.length === 0) return null;

  const currentImage = carousel[currentIndex]?.url || '/images/carousel-1.jpg';

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
        >
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Creating Opportunities.<br/>
            <span className={styles.highlight}>Building Stronger Communities.</span>
          </motion.h1>
          
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            JPRD Foundation works towards meaningful social development through education, skills, rural development and community empowerment.
          </motion.p>
          
          <motion.div 
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button variant="primary" size="lg" href="#programs">Explore Our Work</Button>
            <Button variant="glass" size="lg" href="#volunteer">Join the Movement</Button>
          </motion.div>
        </motion.div>

        <motion.div className={styles.visual}>
          <motion.div 
            className={styles.abstractShape1}
            style={{ y: y1 }}
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className={styles.abstractShape2}
            style={{ y: y2 }}
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className={styles.mainVisual}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Background 3D stack cards */}
            <div className={styles.stackCardBackLeft} />
            <div className={styles.stackCardBackRight} />

            <div className={styles.carouselContainer}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={currentImage}
                  alt="JPRD Impact"
                  className={styles.carouselImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>

              <div className={styles.carouselOverlay}>
                <p className={styles.carouselOverlayText}>
                  “Together we serve today, we empower lives and build a better tomorrow.”
                </p>
              </div>
              
              <div className={styles.dots}>
                {carousel.map((_, i) => (
                  <div 
                    key={i} 
                    className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
