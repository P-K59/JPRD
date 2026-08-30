"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './FinalCTA.module.css';
import Button from '../ui/Button';

const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={styles.finalCta} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <div className={styles.glow} />
          <h2 className={styles.title}>Change Begins With Action.</h2>
          <div className={styles.actions}>
            <Button variant="primary" size="lg" href="#contact">Support Our Work</Button>
            <Button variant="glass" size="lg" href="#volunteer">Volunteer</Button>
            <Button variant="glass" size="lg" href="#csr">Partner With Us</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
