"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Impact.module.css';

const metrics = [
  { value: 15, suffix: '+', label: 'Projects' },
  { value: 25, suffix: '+', label: 'Communities' },
  { value: 120, suffix: '+', label: 'Volunteers' },
  { value: 5000, suffix: '+', label: 'People Reached' }
];

const Counter = ({ target, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const isElementInView = useInView(elementRef, { once: true });

  useEffect(() => {
    if (!isElementInView) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isElementInView, target, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
};

const Impact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring' } }
  };

  return (
    <section id="impact" className={styles.impact} ref={ref}>
      <div className={styles.particles} />
      
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Impact That Matters.</h2>
          <p className={styles.subtitle}>
            Every initiative begins with one meaningful step. We focus on qualitative change and local community growth, measured through direct social outcomes.
          </p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {metrics.map((metric, idx) => (
            <motion.div key={idx} variants={itemVariants} className={styles.metricCardWrapper}>
              <div className={styles.glassCard}>
                <div className={styles.number}>
                  <Counter target={metric.value} />{metric.suffix}
                </div>
                <div className={styles.label}>{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;
