"use client";
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Events.module.css';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';

const defaultEvents = [
  {
    id: 1,
    date: '24 Oct 2026',
    title: 'Annual Education Drive',
    location: 'Bhaisakharag, Mau',
    desc: 'Distribution of study materials and scholarships to 500+ students.',
  },
  {
    id: 2,
    date: '10 Nov 2026',
    title: 'Women Empowerment Seminar',
    location: 'Community Hall, Sector 4',
    desc: 'A comprehensive workshop on digital literacy and financial independence.',
  },
  {
    id: 3,
    date: '05 Dec 2026',
    title: 'Rural Health Camp',
    location: 'Village Panchayat',
    desc: 'Free health checkups and medicine distribution for underprivileged families.',
  }
];

const Events = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    // Load events from localStorage if admin has set them
    const stored = localStorage.getItem('jprd_events');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) setEvents(parsed);
    } else {
      // Seed defaults into localStorage so admin can see them
      localStorage.setItem('jprd_events', JSON.stringify(defaultEvents));
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="events" className={styles.events} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className={styles.title}>Together, In Action.</motion.h2>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Join us in our upcoming initiatives, workshops, awareness drives, and community activities.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants} className={styles.cardWrapper}>
              <Card className={styles.eventCard}>
                <div className={styles.dateBadge}>
                  <Calendar size={18} />
                  <span>{event.date}</span>
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <div className={styles.meta}>
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <p className={styles.eventDesc}>{event.desc}</p>
                <button className={styles.registerBtn}>
                  Register Now <ArrowRight size={16} />
                </button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
