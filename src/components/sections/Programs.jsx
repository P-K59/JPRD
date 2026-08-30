"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import styles from './Programs.module.css';
import { BookOpen, Settings, Map, Users, Target, HeartPulse, Briefcase, Leaf, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

const programs = [
  { id: 'education-digital-literacy', icon: BookOpen, category: 'Education', title: 'Education & Digital Literacy', desc: 'Supporting access to education, digital skills and learning opportunities.' },
  { id: 'skill-development', icon: Settings, category: 'Skills', title: 'Skill Development', desc: 'Building practical skills that improve employability, confidence and livelihood opportunities.' },
  { id: 'rural-development', icon: Map, category: 'Community', title: 'Rural Development', desc: 'Supporting sustainable development and stronger communities in rural and underserved areas.' },
  { id: 'women-empowerment', icon: Users, category: 'Empowerment', title: 'Women Empowerment', desc: 'Creating opportunities that support dignity, confidence, skills and economic participation.' },
  { id: 'youth-development', icon: Target, category: 'Youth', title: 'Youth Development', desc: 'Helping young people develop skills, leadership, confidence and opportunities for the future.' },
  { id: 'livelihood-development', icon: Briefcase, category: 'Livelihood', title: 'Livelihood Development', desc: 'Supporting individuals and communities with pathways towards sustainable livelihoods.' },
  { id: 'environmental-awareness', icon: Leaf, category: 'Environment', title: 'Environmental Awareness', desc: 'Encouraging responsible environmental practices and community participation.' }
];

const Programs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="programs" className={styles.programs} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className={styles.title}>Where We Create Impact</motion.h2>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Our programs focus on creating opportunities, building capabilities and strengthening communities.
          </motion.p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className={styles.cardWrapper}>
                <Link href={`/programs/${prog.id}`} className={styles.cardLink}>
                  <Card className={styles.programCard}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}>
                          <Icon className={styles.icon} size={28} />
                        </div>
                        <span className={styles.categoryBadge}>{prog.category}</span>
                      </div>
                      <h3 className={styles.programTitle}>{prog.title}</h3>
                      <p className={styles.programDesc}>{prog.desc}</p>
                      
                      <div className={styles.exploreBtn}>
                        Explore Program <ArrowRight size={16} />
                      </div>
                    </div>
                    <div className={styles.hoverBg} />
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Programs;
