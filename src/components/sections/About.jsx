"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './About.module.css';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';

const coreCards = [
  {
    icon: Target,
    title: 'Mission',
    desc: 'To create opportunities that improve lives, strengthen communities and enable individuals to move towards a better future.'
  },
  {
    icon: Eye,
    title: 'Vision',
    desc: 'To build empowered, resilient and inclusive communities where every individual has the opportunity to progress with dignity.'
  },
  {
    icon: Heart,
    title: 'Values',
    desc: 'JOY • PROGRESS • RESPECT • DEVELOPMENT'
  }
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'Understand community needs.' },
  { num: '02', title: 'Empower', desc: 'Build knowledge, skills and opportunities.' },
  { num: '03', title: 'Collaborate', desc: 'Work with communities, volunteers, institutions and partners.' },
  { num: '04', title: 'Sustain', desc: 'Create long-term and measurable impact.' }
];

const About = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className={styles.container}>
        
        {/* Storytelling Header */}
        <motion.div 
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className={styles.title}>Building Change With Purpose.</motion.h2>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            JPRD Foundation is committed to creating meaningful opportunities and strengthening communities through inclusive and sustainable development.
          </motion.p>
        </motion.div>

        {/* 3 Core Cards */}
        <motion.div 
          className={styles.coreGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {coreCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className={styles.cardWrapper}>
                <Card className={styles.coreCard}>
                  <div className={styles.iconWrapper}>
                    <Icon size={32} />
                  </div>
                  <h3 className={styles.coreTitle}>{card.title}</h3>
                  <p className={styles.coreDesc}>{card.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className={styles.storyCta}>
          <Button variant="glass" className={styles.storyBtn}>
            Know Our Story <ArrowRight size={18} />
          </Button>
        </motion.div>

        {/* Our Approach / Process */}
        <motion.div 
          className={styles.processSection}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 variants={itemVariants} className={styles.processHeader}>Our Approach</motion.h3>
          
          <div className={styles.processGrid}>
            {processSteps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
                
                {idx !== processSteps.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
