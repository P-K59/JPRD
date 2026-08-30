"use client";
import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Users, Layers, Heart } from 'lucide-react';
import styles from './WhereWeWork.module.css';

const districts = [
  {
    id: 'mau',
    name: 'Mau',
    state: 'Uttar Pradesh',
    x: 72.5,
    y: 41.5,
    programs: ['Girls Education Drive', 'Rural Health Camp', 'Skill Training'],
    beneficiaries: 4800,
    volunteers: 180,
    active: true,
    primary: true,
  },
  {
    id: 'azamgarh',
    name: 'Azamgarh',
    state: 'Uttar Pradesh',
    x: 67.5,
    y: 39.5,
    programs: ['Women Empowerment', 'Livelihood Support'],
    beneficiaries: 2100,
    volunteers: 90,
    active: true,
    primary: false,
  },
  {
    id: 'ballia',
    name: 'Ballia',
    state: 'Uttar Pradesh',
    x: 77,
    y: 38,
    programs: ['Digital Literacy', 'Youth Program'],
    beneficiaries: 1600,
    volunteers: 60,
    active: true,
    primary: false,
  },
  {
    id: 'ghazipur',
    name: 'Ghazipur',
    state: 'Uttar Pradesh',
    x: 69,
    y: 35,
    programs: ['Health Awareness', 'Education Drive'],
    beneficiaries: 1200,
    volunteers: 45,
    active: true,
    primary: false,
  },
  {
    id: 'jaunpur',
    name: 'Jaunpur',
    state: 'Uttar Pradesh',
    x: 59,
    y: 38,
    programs: ['Livelihood Support'],
    beneficiaries: 900,
    volunteers: 35,
    active: true,
    primary: false,
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    x: 63,
    y: 43,
    programs: ['CSR Collaboration', 'Awareness Drive'],
    beneficiaries: 750,
    volunteers: 28,
    active: true,
    primary: false,
  },
];

const totalBeneficiaries = districts.reduce((a, d) => a + d.beneficiaries, 0);
const totalVolunteers = districts.reduce((a, d) => a + d.volunteers, 0);

export default function WhereWeWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState(districts[0]);

  return (
    <section id="reach" className={styles.section} ref={ref}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.tag}>Our Geographic Reach</span>
          <h2 className={styles.title}>Where We Work</h2>
          <p className={styles.subtitle}>
            Active across 6 districts of eastern Uttar Pradesh — connecting grassroots communities with opportunity.
          </p>
        </motion.div>

        <motion.div
          className={styles.mainGrid}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Map panel */}
          <div className={styles.mapPanel}>
            {/* Stylized UP district map using relative SVG */}
            <div className={styles.mapWrapper}>
              <svg
                viewBox="0 0 100 80"
                className={styles.mapSvg}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background region blob */}
                <ellipse cx="65" cy="42" rx="38" ry="26" fill="rgba(31,91,53,0.07)" stroke="rgba(31,91,53,0.15)" strokeWidth="0.5" />

                {/* Connecting lines between districts */}
                {districts.map((d, i) =>
                  districts.slice(i + 1).map((d2, j) => {
                    const dist = Math.sqrt((d.x - d2.x) ** 2 + (d.y - d2.y) ** 2);
                    if (dist > 18) return null;
                    return (
                      <line
                        key={`${d.id}-${d2.id}`}
                        x1={d.x} y1={d.y} x2={d2.x} y2={d2.y}
                        stroke="rgba(31,91,53,0.18)"
                        strokeWidth="0.4"
                        strokeDasharray="1,1"
                      />
                    );
                  })
                )}

                {/* District pins */}
                {districts.map((district) => (
                  <g
                    key={district.id}
                    onClick={() => setSelected(district)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulse ring for selected */}
                    {selected.id === district.id && (
                      <circle
                        cx={district.x} cy={district.y} r="5"
                        fill="none"
                        stroke={district.primary ? '#D96B27' : '#1F5B35'}
                        strokeWidth="0.8"
                        opacity="0.4"
                      >
                        <animate attributeName="r" from="4" to="8" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Pin circle */}
                    <circle
                      cx={district.x} cy={district.y}
                      r={district.primary ? 3.5 : 2.5}
                      fill={selected.id === district.id
                        ? (district.primary ? '#D96B27' : '#1F5B35')
                        : (district.primary ? 'rgba(217,107,39,0.7)' : 'rgba(31,91,53,0.6)')}
                      stroke="white"
                      strokeWidth="0.8"
                    />
                    {/* Label */}
                    <text
                      x={district.x}
                      y={district.y - 4.5}
                      textAnchor="middle"
                      fontSize="3.2"
                      fontWeight={district.primary ? '700' : '500'}
                      fill={selected.id === district.id ? '#0B2545' : '#555'}
                      fontFamily="Inter, sans-serif"
                    >
                      {district.name}
                    </text>
                  </g>
                ))}
              </svg>

              <div className={styles.mapLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDotOrange} /> HQ District
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDotGreen} /> Active Reach
                </span>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className={styles.infoPanel}>
            {/* District list */}
            <div className={styles.districtList}>
              {districts.map((d) => (
                <button
                  key={d.id}
                  className={`${styles.districtBtn} ${selected.id === d.id ? styles.districtBtnActive : ''}`}
                  onClick={() => setSelected(d)}
                >
                  <MapPin size={14} />
                  <span>{d.name}</span>
                  {d.primary && <span className={styles.hqBadge}>HQ</span>}
                </button>
              ))}
            </div>

            {/* Selected district detail */}
            <motion.div
              key={selected.id}
              className={styles.districtDetail}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.detailHeader}>
                <div>
                  <h3>{selected.name}</h3>
                  <span className={styles.stateName}>{selected.state}</span>
                </div>
                {selected.primary && <span className={styles.hqLarge}>Headquarters</span>}
              </div>

              <div className={styles.districtStats}>
                <div className={styles.dStat}>
                  <Users size={18} className={styles.dStatIcon} />
                  <div>
                    <span className={styles.dStatVal}>{selected.beneficiaries.toLocaleString()}+</span>
                    <span className={styles.dStatLabel}>Beneficiaries</span>
                  </div>
                </div>
                <div className={styles.dStat}>
                  <Heart size={18} className={styles.dStatIcon} />
                  <div>
                    <span className={styles.dStatVal}>{selected.volunteers}+</span>
                    <span className={styles.dStatLabel}>Volunteers</span>
                  </div>
                </div>
              </div>

              <div className={styles.programsList}>
                <span className={styles.programsLabel}><Layers size={14} /> Active Programs</span>
                <div className={styles.programTags}>
                  {selected.programs.map((p) => (
                    <span key={p} className={styles.programTag}>{p}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Totals bar */}
            <div className={styles.totalsBar}>
              <div className={styles.totalItem}>
                <span className={styles.totalVal}>{totalBeneficiaries.toLocaleString()}+</span>
                <span className={styles.totalLabel}>Total Beneficiaries</span>
              </div>
              <div className={styles.totalDivider} />
              <div className={styles.totalItem}>
                <span className={styles.totalVal}>6</span>
                <span className={styles.totalLabel}>Districts</span>
              </div>
              <div className={styles.totalDivider} />
              <div className={styles.totalItem}>
                <span className={styles.totalVal}>{totalVolunteers}+</span>
                <span className={styles.totalLabel}>Volunteers</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
