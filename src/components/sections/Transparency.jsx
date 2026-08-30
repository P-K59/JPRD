"use client";
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Heart, Award } from 'lucide-react';
import styles from './Transparency.module.css';

const allocations = [
  { category: "Education & Skill Development", percentage: 45, color: "var(--color-secondary)" },
  { category: "Rural Infrastructure & Support", percentage: 30, color: "var(--color-accent)" },
  { category: "Community Health & Awareness Camps", percentage: 15, color: "#e06666" },
  { category: "Administration & Advocacy Support", percentage: 10, color: "var(--color-primary)" }
];

const Transparency = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="transparency" className={styles.transparency} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Financial Integrity & Trust.</h2>
          <p className={styles.subtitle}>
            We believe in complete openness. Here is how resources, funds, and corporate partnerships are allocated to empower local communities.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* Chart details */}
          <motion.div 
            className={styles.barsContainer}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className={styles.sectionHeading}>Resource Allocation Model</h3>
            <div className={styles.barsList}>
              {allocations.map((item, idx) => (
                <div key={idx} className={styles.barItem}>
                  <div className={styles.barHeader}>
                    <span className={styles.categoryName}>{item.category}</span>
                    <span className={styles.percentageText}>{item.percentage}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <motion.div 
                      className={styles.progressBarFill}
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.percentage}%` } : { width: 0 }}
                      transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Cards detail */}
          <motion.div 
            className={styles.cardsContainer}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.trustCard}>
              <ShieldCheck className={styles.cardIcon} size={32} />
              <div>
                <h4>100% Transparency</h4>
                <p>Every rupee and dollar contributed is tracked directly to project audits and local implementation drives.</p>
              </div>
            </div>
            <div className={styles.trustCard}>
              <Heart className={styles.cardIcon} size={32} />
              <div>
                <h4>Impact-First Strategy</h4>
                <p>We keep administrative overhead minimal to ensure direct benefits reach our student and community program layers.</p>
              </div>
            </div>
            <div className={styles.trustCard}>
              <Award className={styles.cardIcon} size={32} />
              <div>
                <h4>Regular Auditing</h4>
                <p>Comprehensive activity logs and financial reports are shared with partners to guarantee outcome accountability.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Transparency;
