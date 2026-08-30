"use client";
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './CSR.module.css';
import { 
  Building2, Users, HeartHandshake, TrendingUp, 
  BookOpen, Laptop, Settings, PersonStanding, 
  Map, Target, HeartPulse, Briefcase, Leaf, 
  FileText, CheckCircle2, ArrowRight,
  Coins, Activity, BarChart, Globe
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Data Arrays
const partnershipModel = [
  { num: '01', title: 'DISCOVER', desc: 'Understand CSR priorities and community needs.' },
  { num: '02', title: 'DESIGN', desc: 'Develop a project aligned with the organization\'s objectives.' },
  { num: '03', title: 'IMPLEMENT', desc: 'Execute the initiative with structured planning.' },
  { num: '04', title: 'MEASURE', desc: 'Track outcomes and impact.' },
  { num: '05', title: 'REPORT', desc: 'Provide transparent documentation and impact reporting.' }
];

const focusAreas = [
  { icon: BookOpen, title: 'Education' },
  { icon: Laptop, title: 'Digital Literacy' },
  { icon: Settings, title: 'Skill Development' },
  { icon: PersonStanding, title: 'Women Empowerment' },
  { icon: Map, title: 'Rural Development' },
  { icon: Target, title: 'Youth Development' },
  { icon: HeartPulse, title: 'Health & Awareness' },
  { icon: Briefcase, title: 'Livelihoods' },
  { icon: Leaf, title: 'Environment' }
];

const whyPartner = [
  'Community-Centric Approach',
  'Transparent Implementation',
  'Local Engagement',
  'Measurable Outcomes',
  'Responsible Resource Utilization',
  'Impact Reporting'
];

const frameworkCards = [
  {
    icon: Coins,
    title: "INPUT",
    subTitle: "Resources Allocation",
    desc: "Corporate funds, grants, equipment, learning aids, and volunteer hours.",
    color: "var(--color-primary)"
  },
  {
    icon: Activity,
    title: "ACTIVITIES",
    subTitle: "Execution Phase",
    desc: "Running computer literacy runs, classroom upgrades, and medical clinics.",
    color: "var(--color-secondary)"
  },
  {
    icon: BarChart,
    title: "OUTPUTS",
    subTitle: "Immediate Deliverables",
    desc: "Direct number of students taught, clinics set up, and kits distributed.",
    color: "var(--color-accent)"
  },
  {
    icon: TrendingUp,
    title: "OUTCOMES",
    subTitle: "Mid-Term Benefits",
    desc: "Improved youth employabilities, better household incomes, and healthy families.",
    color: "var(--color-orange)"
  },
  {
    icon: Globe,
    title: "IMPACT",
    subTitle: "Sustainable Growth",
    desc: "Empowered self-reliant villages and long-term socio-economic progress.",
    color: "#8e44ad"
  }
];

const CSR = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="csr" className={styles.csr} ref={ref}>
      <div className={styles.container}>
        
        {/* Header */}
        <motion.div 
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2 variants={itemVariants} className={styles.title}>
            Partner With JPRD to Create <span className={styles.highlight}>Measurable Impact.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className={styles.subtitle}>
            Together, we can transform resources into meaningful opportunities for communities.
          </motion.p>
        </motion.div>

        {/* 3D Visual Flow */}
        <motion.div 
          className={styles.visualFlow}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className={styles.flowCard}><Building2 size={32} /><span>Company</span></div>
          <ArrowRight className={styles.flowArrow} />
          <div className={styles.flowCard}><HeartHandshake size={32} /><span>JPRD</span></div>
          <ArrowRight className={styles.flowArrow} />
          <div className={styles.flowCard}><Users size={32} /><span>Community</span></div>
          <ArrowRight className={styles.flowArrow} />
          <div className={styles.flowCard}><TrendingUp size={32} /><span>Impact</span></div>
        </motion.div>

        {/* CSR Focus Areas */}
        <div className={styles.sectionDivider} />
        <motion.div className={styles.sectionHeader} variants={itemVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h3>CSR Focus Areas</h3>
        </motion.div>
        
        <motion.div className={styles.focusGrid} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {focusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className={styles.focusCard}>
                  <Icon size={24} className={styles.focusIcon} />
                  <span className={styles.focusTitle}>{area.title}</span>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CSR Partnership Model */}
        <div className={styles.sectionDivider} />
        <motion.div className={styles.sectionHeader} variants={itemVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h3>Partnership Model</h3>
        </motion.div>

        <motion.div className={styles.timeline} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {partnershipModel.map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className={styles.timelineStep}>
              <div className={styles.timelineNum}>{step.num}</div>
              <h4 className={styles.timelineTitle}>{step.title}</h4>
              <p className={styles.timelineDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Partner with JPRD */}
        <div className={styles.sectionDivider} />
        <motion.div className={styles.sectionHeader} variants={itemVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h3>Why Partner With JPRD</h3>
          <p>Our intended approach to creating sustainable change.</p>
        </motion.div>

        <motion.div className={styles.whyGrid} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {whyPartner.map((reason, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className={styles.whyCard}>
                <CheckCircle2 size={24} className={styles.whyIcon} />
                <span>{reason}</span>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CSR Impact Reporting */}
        <div className={styles.sectionDivider} />
        <motion.div className={styles.sectionHeader} variants={itemVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h3>From Investment to Impact</h3>
          <p>Our interactive 3D visual reporting framework.</p>
        </motion.div>

        <motion.div className={styles.frameworkGrid} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {frameworkCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div key={idx} variants={itemVariants} className={styles.frameworkCardWrapper}>
                <div className={styles.frameworkCard} style={{ borderTopColor: card.color }}>
                  <div className={styles.frameworkHeader}>
                    <div className={styles.frameworkIconBg} style={{ color: card.color, backgroundColor: `${card.color}15` }}>
                      <Icon size={24} />
                    </div>
                    <span className={styles.frameworkStepNum}>STEP 0{idx + 1}</span>
                  </div>
                  <h4 className={styles.frameworkTitle}>{card.title}</h4>
                  <span className={styles.frameworkSubTitle}>{card.subTitle}</span>
                  <p className={styles.frameworkDesc}>{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CSR CTA */}
        <motion.div 
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.ctaBox}>
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>Let's Build Impact That Lasts.</h3>
              <p className={styles.ctaDesc}>Tell us about your CSR priorities and explore how we can work together.</p>
            </div>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="lg" className={styles.partnerBtn}>
                Partner With JPRD
              </Button>
              <Button variant="glass" size="lg" onClick={() => alert('PDF profile will be available shortly.')}>
                <FileText size={18} style={{ marginRight: '8px' }} /> Download CSR Profile
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CSR;
