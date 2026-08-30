"use client";
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './StoryCards.module.css';

const stories = [
  {
    name: "Roshni Kumari",
    age: 14,
    village: "Raopura, Mau",
    program: "Girls Education Drive",
    before: "Out of school at age 11 due to family hardship. Helped at home full time.",
    after: "Now studying in Class 9. Aspires to become a nurse.",
    progress: 80,
    progressLabel: "School attendance: 40% → 96%",
    gradient: "linear-gradient(135deg, #1F5B35, #0B2545)",
    initials: "RK"
  },
  {
    name: "Arjun Prajapati",
    age: 22,
    village: "Naibazar, Mau",
    program: "Youth Skills Training",
    before: "Unemployed for 2 years after completing Class 12. No vocational skills.",
    after: "Completed electrician certification. Now earning ₹12,000/month.",
    progress: 100,
    progressLabel: "Employment: 0% → Placed & Earning",
    gradient: "linear-gradient(135deg, #D96B27, #C5A059)",
    initials: "AP"
  },
  {
    name: "Savitri Devi",
    age: 45,
    village: "Bhaisakharag, Mau",
    program: "Women Welfare & Health",
    before: "No access to regular healthcare. 3 km to nearest clinic with no transport.",
    after: "Part of JPRD's health monitoring programme. Blood pressure managed.",
    progress: 70,
    progressLabel: "Health checkups: Never → Monthly",
    gradient: "linear-gradient(135deg, #0B2545, #1a3a5c)",
    initials: "SD"
  },
  {
    name: "Rameshwar Yadav",
    age: 38,
    village: "Raopura, Mau",
    program: "Rural Livelihood Support",
    before: "Seasonal farm work only. Income dropped to zero in off-seasons.",
    after: "Trained in vegetable cultivation and organic farming. Year-round income now.",
    progress: 90,
    progressLabel: "Income stability: Seasonal → Year-round",
    gradient: "linear-gradient(135deg, #1F5B35, #2d8a50)",
    initials: "RY"
  },
  {
    name: "Priya Singh",
    age: 17,
    village: "Naibazar, Mau",
    program: "Digital Literacy for Girls",
    before: "Never used a computer. No digital awareness in her village.",
    after: "Completed MS Office & Internet training. Helping peers in her village now.",
    progress: 95,
    progressLabel: "Digital Skills: 0% → Certified",
    gradient: "linear-gradient(135deg, #C5A059, #D96B27)",
    initials: "PS"
  }
];

export default function StoryCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + stories.length) % stories.length);
  const next = () => setActive(i => (i + 1) % stories.length);

  const story = stories[active];

  return (
    <section id="stories" className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.tag}>Stories of Change</span>
          <h2 className={styles.title}>Real Lives. Real Impact.</h2>
          <p className={styles.subtitle}>
            Behind every statistic is a person. These are the stories of transformation from our communities.
          </p>
        </motion.div>

        <motion.div
          className={styles.storyWrapper}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Navigation */}
          <button className={styles.navBtn} onClick={prev} aria-label="Previous story">
            <ChevronLeft size={22} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className={styles.card}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              {/* Left: Avatar + Info */}
              <div className={styles.cardLeft} style={{ background: story.gradient }}>
                <div className={styles.avatarCircle}>{story.initials}</div>
                <div className={styles.personInfo}>
                  <h3>{story.name}</h3>
                  <p className={styles.personAge}>Age {story.age}</p>
                </div>
                <div className={styles.locationBadge}>
                  <MapPin size={14} />
                  <span>{story.village}</span>
                </div>
                <div className={styles.programBadge}>{story.program}</div>
              </div>

              {/* Right: Story */}
              <div className={styles.cardRight}>
                <div className={styles.storyBlock}>
                  <span className={styles.storyLabel}>Before JPRD</span>
                  <p className={styles.storyText}>{story.before}</p>
                </div>
                <div className={styles.storyBlock}>
                  <span className={`${styles.storyLabel} ${styles.afterLabel}`}>After JPRD Support</span>
                  <p className={styles.storyText}>{story.after}</p>
                </div>

                {/* Progress bar */}
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <TrendingUp size={16} className={styles.trendIcon} />
                    <span>{story.progressLabel}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${story.progress}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className={styles.navBtn} onClick={next} aria-label="Next story">
            <ChevronRight size={22} />
          </button>
        </motion.div>

        {/* Dot indicators */}
        <div className={styles.dots}>
          {stories.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Story ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p>Help write the next story of change.</p>
          <a href="#volunteer" className={styles.ctaLink}>
            Join as Volunteer <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
