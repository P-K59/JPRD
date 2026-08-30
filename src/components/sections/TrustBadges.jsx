"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, Award, FileText, Users, Globe } from 'lucide-react';
import styles from './TrustBadges.module.css';

const badges = [
  { icon: ShieldCheck, label: "Registered NGO", sub: "Govt. of UP Registered" },
  { icon: FileText, label: "80G Eligible", sub: "Tax Exemption Certificate" },
  { icon: Award, label: "12A Certified", sub: "Income Tax Compliance" },
  { icon: Users, label: "500+ Volunteers", sub: "Across Mau District" },
  { icon: Globe, label: "6 Districts", sub: "Active Reach in UP" },
];

const partners = [
  "District Administration, Mau",
  "UP State Govt. Partnership",
  "Panchayati Raj Dept.",
  "Skill India Mission",
  "NITI Aayog Aligned",
];

export default function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Transparency You Can Trust</h2>
          <p>JPRD Foundation operates with full legal compliance, governance standards, and public accountability.</p>
        </motion.div>

        {/* Trust Badges Row */}
        <div className={styles.badgesGrid}>
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              className={styles.badge}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.badgeIcon}>
                <badge.icon size={22} />
              </div>
              <div>
                <div className={styles.badgeLabel}>{badge.label}</div>
                <div className={styles.badgeSub}>{badge.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner Strip */}
        <motion.div
          className={styles.partnerStrip}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className={styles.partnerLabel}>In Association With:</span>
          <div className={styles.partners}>
            {partners.map((p, i) => (
              <span key={i} className={styles.partnerItem}>
                {p}
                {i < partners.length - 1 && <span className={styles.sep}>·</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
