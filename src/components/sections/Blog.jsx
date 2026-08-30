"use client";
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import styles from './Blog.module.css';

const articles = [
  {
    tag: "Education",
    date: "August 15, 2026",
    readTime: "4 min read",
    title: "Empowering Rural Schools: The 2026 JPRD Learning Initiative",
    description: "An overview of our learning kits distribution, outcomes, and what the future holds for rural academic accessibility in Mau villages.",
    imageText: "🎓 Education Initiative"
  },
  {
    tag: "Skills",
    date: "July 28, 2026",
    readTime: "5 min read",
    title: "Bridging the Skill Gap: Youth Vocational Programs",
    description: "How our structured vocational workshop plans are aiding young adults in acquiring key employability skills for sustainable livelihoods.",
    imageText: "💻 Skill Workshops"
  },
  {
    tag: "CSR",
    date: "June 12, 2026",
    readTime: "3 min read",
    title: "The Power of Collaboration: CSR Alignment Policies",
    description: "Detailing the strategic frameworks corporate partners use with JPRD to deploy resources cleanly and achieve community outcomes.",
    imageText: "🤝 CSR Partnership"
  }
];

const Blog = () => {
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
    <section id="blog" className={styles.blog} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>Updates & Community Stories.</h2>
          <p className={styles.subtitle}>
            Read recent accounts of our drives, training updates, CSR milestones, and local beneficiary accomplishments.
          </p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {articles.map((article, idx) => (
            <motion.div key={idx} variants={itemVariants} className={styles.cardWrapper}>
              <div className={styles.blogCard}>
                <div className={styles.cardVisual}>
                  <span className={styles.tag}>{article.tag}</span>
                  <div className={styles.imagePlaceholder}>
                    <span>{article.imageText}</span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardDesc}>{article.description}</p>
                  
                  <a href="#" className={styles.readMore}>
                    Read Full Story <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
