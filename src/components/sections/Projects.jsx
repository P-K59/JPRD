"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import styles from './Projects.module.css';
import { ArrowRight, MapPin } from 'lucide-react';
import Card from '../ui/Card';

const projects = [
  {
    id: 'village-education-initiative',
    title: 'Village Education Initiative',
    location: 'Rural Districts',
    category: 'Education',
    status: 'ONGOING',
    desc: 'Setting up learning centers and providing study materials to underprivileged children in remote districts.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'women-skill-workshop',
    title: 'Women Skill Workshop',
    location: 'Community Centers',
    category: 'Empowerment',
    status: 'COMPLETED',
    desc: 'Vocational training in stitching, digital literacy, and financial independence for women.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'solar-powered-schools',
    title: 'Solar-Powered Schools',
    location: 'Naibazar, Mau',
    category: 'Environment',
    status: 'PLANNED',
    desc: 'Equipping rural schools with solar panels to ensure uninterrupted learning environments.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
  }
];

const Projects = () => {
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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ONGOING': return styles.statusOngoing;
      case 'COMPLETED': return styles.statusCompleted;
      case 'PLANNED': return styles.statusPlanned;
      default: return '';
    }
  };

  return (
    <section id="projects" className={styles.projects} ref={ref}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className={styles.title}>Turning Purpose Into Action.</motion.h2>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            From ideas to implementation, our projects focus on practical solutions that create meaningful community impact.
          </motion.p>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((proj, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Link href={`/projects/${proj.id}`} className={styles.cardLink}>
                <Card className={styles.projectCard} hoverEffect={false}>
                  <div className={styles.imageWrapper}>
                    <img src={proj.image} alt={proj.title} className={styles.image} />
                    <div className={styles.badgesWrapper}>
                      <span className={styles.categoryBadge}>{proj.category}</span>
                      <span className={`${styles.statusBadge} ${getStatusColor(proj.status)}`}>
                        {proj.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <MapPin size={16} />
                      <span>{proj.location}</span>
                    </div>
                    <h3 className={styles.projectTitle}>{proj.title}</h3>
                    <p className={styles.projectDesc}>{proj.desc}</p>
                    
                    <div className={styles.viewBtn}>
                      View Project <ArrowRight size={16} />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
