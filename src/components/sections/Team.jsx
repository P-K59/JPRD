"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Link, ChevronDown, ChevronUp, Users } from 'lucide-react';
import styles from './Team.module.css';

const teamMembers = [
  {
    name: "Dharmesh Kumar",
    role: "Founder & Chairman",
    bio: "Sets long-term Vision and Mission, approves major decisions, represents JPRD before external bodies, and ensures structural transparency.",
    image: "/images/team-dharmesh.jpg",
    initials: "DK"
  },
  {
    name: "Pankaj Kumar",
    role: "Vice Chairman",
    bio: "Assists the Chairman and leads in their absence, monitors planning and implementation of projects, coordinates teams, and drives initiatives.",
    image: "/images/team-pankaj.jpg",
    initials: "PK"
  },
  {
    name: "Ratnesh Kumar",
    role: "General Secretary",
    bio: "Organizes meetings, documents minutes, manages official correspondence, monitors compliance, and administers daily operations.",
    image: "/images/team-ratnesh.jpg",
    initials: "RK"
  },
  {
    name: "Harindra Kumar Rao",
    role: "Treasurer / Finance Secretary",
    bio: "Prepares budgets, maintains income-expenditure records, guarantees financial transparency, and presents financial reports.",
    image: "/images/team-harindra.jpg",
    initials: "HR"
  },
  {
    name: "Sandeep Kumar",
    role: "Youth President",
    bio: "Leads and guides youth volunteers, coordinates active youth campaigns, onboards new helpers, and scales operations.",
    image: "/images/team-sandeep.jpg",
    initials: "SK"
  },
  {
    name: "Usha Rao",
    role: "Women Welfare President",
    bio: "Runs empowerment and welfare initiatives, executes girl-child awareness drives, coordinates volunteers, and advocates for women's issues.",
    image: "/images/team-usha.jpg",
    initials: "UR"
  }
];

const TeamMemberCard = ({ member }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.teamCard}>
      <div className={styles.avatarWrapper}>
        {!imgError ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className={styles.avatarImg} 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.avatar}>
            {member.initials}
          </div>
        )}
      </div>
      
      <h3 className={styles.name}>{member.name}</h3>
      <p className={styles.role}>{member.role}</p>
      <p className={styles.bio}>{member.bio}</p>
      
      <div className={styles.socials}>
        <a href="#" className={styles.socialLink} aria-label="LinkedIn Profile">
          <Link size={18} />
        </a>
        <a href="#" className={styles.socialLink} aria-label="Email Contact">
          <Mail size={18} />
        </a>
      </div>
    </div>
  );
};

const Team = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#team') {
        setIsExpanded(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="team" className={styles.team} ref={ref}>
      <div className={styles.container}>
        
        {!isExpanded ? (
          /* Collapsed Card Banner State */
          <motion.div 
            className={`${styles.collapsedBanner} premium-3d-card`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.bannerIconBg}>
              <Users size={32} />
            </div>
            <h2>Meet the JPRD Leadership & Team</h2>
            <p>Our founding members and advisors are committed to building opportunities and community empowerment.</p>
            <button className={styles.revealBtn} onClick={() => setIsExpanded(true)}>
              Reveal Team Members & Responsibilities <ChevronDown size={18} />
            </button>
          </motion.div>
        ) : (
          /* Expanded Active Grid State */
          <div>
            <motion.div 
              className={styles.header}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={styles.title}>Faces Behind the Mission.</h2>
              <p className={styles.subtitle}>
                Meet our founding team and advisors working consistently to construct opportunities.
              </p>
            </motion.div>

            <motion.div 
              className={styles.grid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member, idx) => (
                <motion.div key={idx} variants={itemVariants} className={styles.cardWrapper}>
                  <TeamMemberCard member={member} />
                </motion.div>
              ))}
            </motion.div>

            <div className={styles.collapseActions}>
              <button className={styles.collapseBtn} onClick={() => setIsExpanded(false)}>
                Collapse Section <ChevronUp size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Team;
