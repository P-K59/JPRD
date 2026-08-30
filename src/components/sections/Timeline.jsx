"use client";
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Timeline.module.css';

const milestones = [
  {
    year: "July 2026",
    title: "Foundation & Inception",
    description: "JPRD Foundation was established to bridge key rural development gaps. Formulated core operations targeting skill acquisition, educational empowerment, and rural support."
  },
  {
    year: "Late 2026",
    title: "Initial Outreach Drives",
    description: "Launched our first community learning drives and health camps in Mau district, delivering direct resources to rural families."
  },
  {
    year: "2027 (Future Goals)",
    title: "Roadmap: Digital Empowerment Hubs",
    description: "Planning to construct permanent digital empowerment nodes in underprivileged sectors, educating youth in essential modern literacy tools."
  }
];

const Timeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="timeline" className={styles.timeline} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Our Journey & Roadmap.</h2>
          <p className={styles.subtitle}>
            A timeline of our core milestones and strategic vision for the upcoming years.
          </p>
        </motion.div>

        <div className={styles.timelineTrack}>
          <div className={styles.centerLine} />
          
          {milestones.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={idx} 
                className={`${styles.timelineItem} ${isEven ? styles.left : styles.right}`}
              >
                <div className={styles.timelineIndicator}>
                  <div className={styles.pulseDot} />
                </div>
                
                <motion.div 
                  className={styles.timelineCard}
                  initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                  transition={{ duration: 0.7, delay: idx * 0.2 }}
                >
                  <span className={styles.year}>{item.year}</span>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
