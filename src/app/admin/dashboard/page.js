"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Heart, Image as ImageIcon, LogOut,
  Trash2, Plus, Sparkles, Filter, CheckCircle,
  BarChart3, Calendar, TrendingUp, ArrowUpRight,
  Target, Activity, UserPlus, Eye, Wallet, Download, Cloud, CloudOff, ShieldCheck, FileText, Printer,
  Menu, X as CloseIcon, GraduationCap, Award, BookOpen, Search
} from 'lucide-react';
import styles from '../admin.module.css';
import DonorProfile from '../../../components/admin/DonorProfile';
import { dbService } from '../../../lib/dbService';

/* ─── seed data ─── */
const initialDonations = [];
const initialStudents = [];
const initialTestimonials = [
  { id: 1, name: "Rohan Verma",      role: "Education Drive Beneficiary",  quote: "Thanks to JPRD Foundation, I received a learning scholarship.", avatar: "RV" },
  { id: 2, name: "Dr. Shalini Mehta",role: "Voluntary General Physician",  quote: "Volunteering at JPRD's health camps has been incredibly fulfilling.", avatar: "SM" },
  { id: 3, name: "Vikram Malhotra",  role: "CSR Partner Representative",  quote: "Their clear documentation makes them a highly dependable partner.", avatar: "VM" },
];
const initialCarousel = [
  { id: 1, url: "/images/carousel-1.jpg", caption: "Empowering Rural Lives" },
  { id: 2, url: "/images/carousel-2.jpg", caption: "Education for All" },
  { id: 3, url: "/images/carousel-3.jpg", caption: "Skills and Opportunities" },
  { id: 4, url: "/images/carousel-4.jpg", caption: "Community Togetherness" },
];
const initialVolunteers = [];
const initialEvents = [
  { id: 1, date: "24 Oct 2026", title: "Annual Education Drive",    location: "Bhaisakharag, Mau", desc: "Distribution of study materials to 500+ students." },
  { id: 2, date: "10 Nov 2026", title: "Women Empowerment Seminar", location: "Community Hall",    desc: "Workshop on digital literacy and financial independence." },
  { id: 3, date: "05 Dec 2026", title: "Rural Health Camp",         location: "Village Panchayat",desc: "Free health checkups for underprivileged families." },
];
const initialGallery = [
  { id: 1, url: "/images/gallery-1.jpg", caption: "Education Camp 2026" },
  { id: 2, url: "/images/gallery-2.jpg", caption: "Women Workshop" },
  { id: 3, url: "/images/gallery-3.jpg", caption: "Health Drive" },
];
const initialEmployees = [];
const initialExpenses = [];

const DONATION_GOAL = 500000;
const MONTHS = ["All Months","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026","Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026","Dec 2026"];
const SKILL_LEVELS = [
  "Level 1 (Foundation)",
  "Level 2 (Explorer)",
  "Level 3 (Skill Building)",
  "Level 4 (Future Ready)"
];

/* ─── Helpers ─── */
function load(key) {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : null;
}
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

function downloadCSV(data, filename, columns) {
  if (!data || !data.length) {
    alert("No data available to download.");
    return;
  }
  const keys = columns || Object.keys(data[0]);
  const headerLabels = keys.map(k => k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1'));
  
  const csvContent = [
    headerLabels.join(','), // Formatted Header row
    ...data.map(row => 
      keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k].toString();
        // Escape quotes and wrap in quotes if contains comma or newline
        cell = cell.replace(/"/g, '""');
        if (cell.search(/("|,|\n|\r)/g) >= 0) cell = `"${cell}"`;
        return cell;
      }).join(',')
    )
  ].join('\r\n');

  const finalName = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
  const bomCsv = "\uFEFF" + csvContent;

  try {
    const blob = new Blob([bomCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (err) {
    // Fallback data URI
    const encodedUri = encodeURI("data:text/csv;charset=utf-8,\uFEFF" + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", finalName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
  }
}

/**
 * Generate a high-resolution printable / PDF downloadable report with official JPRD Foundation letterhead.
 */
function generatePrintableReport(title, subtitle, columns, data, summaryMetrics = []) {
  if (!data || !data.length) {
    alert("No data available to generate report.");
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Please allow popups to view and print the report.");
    return;
  }

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — JPRD Foundation Official Report</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            color: #1e293b;
            background: #fff;
            padding: 40px;
            font-size: 13px;
            line-height: 1.5;
          }
          .report-container {
            max-width: 960px;
            margin: 0 auto;
          }
          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1F5B35;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo-area img {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #1F5B35;
          }
          .org-title {
            font-size: 22px;
            font-weight: 800;
            color: #1F5B35;
            letter-spacing: -0.5px;
          }
          .org-sub {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .report-meta {
            text-align: right;
            font-size: 12px;
            color: #64748b;
          }
          .report-meta strong {
            color: #0f172a;
          }
          .doc-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .doc-sub {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 20px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
          }
          .metric-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 14px 18px;
            border-radius: 10px;
          }
          .metric-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .metric-val {
            font-size: 20px;
            font-weight: 800;
            color: #1F5B35;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 30px;
          }
          th {
            background: #1F5B35;
            color: #ffffff;
            font-weight: 700;
            text-align: left;
            padding: 10px 14px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12.5px;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          .amount-cell {
            font-weight: 700;
            color: #1F5B35;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            background: #e2fbe8;
            color: #15803d;
          }
          .report-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #94a3b8;
          }
          .actions-bar {
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: flex;
            gap: 12px;
            background: #0f172a;
            padding: 12px 20px;
            border-radius: 40px;
            box-shadow: 0 12px 35px rgba(0,0,0,0.35);
            z-index: 9999;
          }
          .action-btn-pdf {
            background: #10b981;
            color: #ffffff;
            border: none;
            padding: 10px 22px;
            border-radius: 25px;
            font-weight: 800;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }
          .action-btn-pdf:hover {
            background: #059669;
            transform: translateY(-2px);
          }
          .action-btn-close {
            background: #334155;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 25px;
            font-weight: 700;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
          }
          .action-btn-close:hover {
            background: #475569;
          }
          @media print {
            body { padding: 0; }
            .actions-bar { display: none; }
            .top-banner-actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="logo-area">
              <img src="/logo.png" alt="JPRD" onerror="this.style.display='none'" />
              <div>
                <div class="org-title">JPRD Foundation</div>
                <div class="org-sub">Creating Opportunities. Building Stronger Communities.</div>
              </div>
            </div>
            <div class="report-meta">
              <div>Generated on: <strong>${dateFormatted}, ${timeFormatted}</strong></div>
              <div>System: <strong>JPRD Admin Audit & Compliance</strong></div>
            </div>
          </div>

          <div class="doc-title">${title}</div>
          <div class="doc-sub">${subtitle}</div>

          ${summaryMetrics && summaryMetrics.length > 0 ? `
            <div class="metrics-grid">
              ${summaryMetrics.map(m => `
                <div class="metric-box">
                  <div class="metric-label">${m.label}</div>
                  <div class="metric-val">${m.value}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.label || col.key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => {
                    let val = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '';
                    if (col.isAmount) val = `₹${Number(val).toLocaleString()}`;
                    return `<td>${val}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="report-footer">
            <div>Confidential & Official Document of JPRD Foundation</div>
            <div>Total Records: ${data.length}</div>
          </div>
        </div>

        <div class="actions-bar">
          <button class="action-btn-pdf" onclick="window.print()">🖨️ Print / Save as PDF</button>
          <button class="action-btn-close" onclick="window.close()">✕ Close</button>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Robustly derive "Mon YYYY" from a record.
 * Prefers explicit `month` field; falls back to parsing `date` like "24 Aug 2026".
 */
function getMonth(record) {
  if (record.month && record.month.trim()) return record.month.trim();
  if (record.date) {
    const parts = record.date.trim().split(/\s+/);
    if (parts.length >= 3) return `${parts[1]} ${parts[2]}`;
  }
  return '';
}

/** Backfill missing month fields on records loaded from localStorage. */
function normalizeDates(records) {
  return records.map(r => ({ ...r, month: getMonth(r) }));
}

/* ════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab,        setActiveTab]        = useState('analytics');
  const [authorized,       setAuthorized]       = useState(false);
  const [adminRole,        setAdminRole]        = useState('superadmin');
  const [selectedDonor,    setSelectedDonor]    = useState(null);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);

  const [donations,    setDonations]    = useState([]);
  const [students,     setStudents]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [carousel,     setCarousel]     = useState([]);
  const [volunteers,   setVolunteers]   = useState([]);
  const [events,       setEvents]       = useState([]);
  const [gallery,      setGallery]      = useState([]);
  const [employees,    setEmployees]    = useState([]);
  const [expenses,     setExpenses]     = useState([]);
  const [auditLogs,    setAuditLogs]    = useState([]);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('All');

  /* ── Filter state ── */
  const [analyticsMonth,     setAnalyticsMonth]     = useState('All Months');
  const [donationMonth,      setDonationMonth]      = useState('All Months');
  const [donationTypeFilter, setDonationTypeFilter] = useState('All');
  const [volunteerMonth,     setVolunteerMonth]     = useState('All Months');
  const [financeMonth,       setFinanceMonth]       = useState('All Months');
  const [studentMonth,       setStudentMonth]       = useState('All Months');
  const [studentLevelFilter, setStudentLevelFilter] = useState('All');
  const [studentFeeFilter,   setStudentFeeFilter]   = useState('All');
  const [studentSearch,      setStudentSearch]      = useState('');

  /* ── Form: donations ── */
  const [newDonorName,   setNewDonorName]   = useState('');
  const [newDonorEmail,  setNewDonorEmail]  = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('');
  const [newDonorType,   setNewDonorType]   = useState('Monthly');
  const [newDonorDate,   setNewDonorDate]   = useState(''); // Custom transaction date

  /* ── Form: students ── */
  const [newStuName,     setNewStuName]     = useState('');
  const [newStuParent,   setNewStuParent]   = useState('');
  const [newStuPhone,    setNewStuPhone]    = useState('');
  const [newStuAadhaar,  setNewStuAadhaar]  = useState('');
  const [newStuAddress,  setNewStuAddress]  = useState('');
  const [newStuLevel,    setNewStuLevel]    = useState('Level 1 (Foundation)');
  const [newStuFee,      setNewStuFee]      = useState('500');
  const [newStuFeeStatus,setNewStuFeeStatus]= useState('Paid'); // Paid, Pending, Scholarship
  const [newStuDate,     setNewStuDate]     = useState('');

  /* ── Form: testimonials ── */
  const [newTestName,  setNewTestName]  = useState('');
  const [newTestRole,  setNewTestRole]  = useState('');
  const [newTestQuote, setNewTestQuote] = useState('');

  /* ── Form: carousel ── */
  const [newCarouselUrl,     setNewCarouselUrl]     = useState('');
  const [newCarouselCaption, setNewCarouselCaption] = useState('');

  /* ── Form: events ── */
  const [newEventTitle,    setNewEventTitle]    = useState('');
  const [newEventDate,     setNewEventDate]     = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc,     setNewEventDesc]     = useState('');

  /* ── Form: gallery ── */
  const [newGalleryUrl,     setNewGalleryUrl]     = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  /* ── Form: volunteers ── */
  const [newVolName,     setNewVolName]     = useState('');
  const [newVolEmail,    setNewVolEmail]    = useState('');
  const [newVolPhone,    setNewVolPhone]    = useState('');
  const [newVolInterest, setNewVolInterest] = useState('Education & Teaching');

  /* ── Form: finance ── */
  const [newEmpName,     setNewEmpName]     = useState('');
  const [newEmpRole,     setNewEmpRole]     = useState('');
  const [newEmpSalary,   setNewEmpSalary]   = useState('');
  const [newExpCat,      setNewExpCat]      = useState('Operations');
  const [newExpDesc,     setNewExpDesc]     = useState('');
  const [newExpAmt,      setNewExpAmt]      = useState('');
  const [newExpDate,     setNewExpDate]     = useState(''); // Custom expense date
  const [salaryMonth,    setSalaryMonth]    = useState('Aug 2026'); // Month to disburse salary for

  /* ══ ALL useMemo BEFORE any early return ══ */
  const filteredDonations = useMemo(() =>
    donations.filter(d =>
      (donationMonth === 'All Months' || getMonth(d) === donationMonth) &&
      (donationTypeFilter === 'All'   || d.type === donationTypeFilter)
    ), [donations, donationMonth, donationTypeFilter]);

  const filteredVolunteers = useMemo(() =>
    volunteers.filter(v =>
      volunteerMonth === 'All Months' || getMonth(v) === volunteerMonth
    ), [volunteers, volunteerMonth]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchMonth = studentMonth === 'All Months' || getMonth(s) === studentMonth;
      const matchLevel = studentLevelFilter === 'All' || s.level === studentLevelFilter;
      const matchFee   = studentFeeFilter === 'All' || s.feeStatus === studentFeeFilter;
      const q = studentSearch.trim().toLowerCase();
      const matchSearch = !q || 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.parentName && s.parentName.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q)) ||
        (s.aadhaar && s.aadhaar.includes(q)) ||
        (s.address && s.address.toLowerCase().includes(q));
      return matchMonth && matchLevel && matchFee && matchSearch;
    });
  }, [students, studentMonth, studentLevelFilter, studentFeeFilter, studentSearch]);

  const studentPaidCount = useMemo(() => students.filter(s => s.feeStatus === 'Paid').length, [students]);
  const studentPendingCount = useMemo(() => students.filter(s => s.feeStatus === 'Pending').length, [students]);
  const studentTotalFeesCollected = useMemo(() => students.filter(s => s.feeStatus === 'Paid').reduce((sum, s) => sum + (Number(s.fee) || 0), 0), [students]);

  const analyticsDonations = useMemo(() =>
    analyticsMonth === 'All Months'
      ? donations
      : donations.filter(d => getMonth(d) === analyticsMonth),
    [donations, analyticsMonth]);

  const analyticsVols = useMemo(() =>
    analyticsMonth === 'All Months'
      ? volunteers
      : volunteers.filter(v => getMonth(v) === analyticsMonth),
    [volunteers, analyticsMonth]);

  const analyticsFunds   = analyticsDonations.reduce((a, d) => a + d.amount, 0);
  const analyticsMonthly = analyticsDonations.filter(d => d.type === 'Monthly').length;
  const analyticsOneTime = analyticsDonations.filter(d => d.type === 'One-time').length;
  const totalFunds       = donations.reduce((a, d) => a + d.amount, 0);
  const goalPct          = Math.min(100, Math.round((totalFunds / DONATION_GOAL) * 100));

  const filteredExpenses = useMemo(() =>
    expenses.filter(ex =>
      financeMonth === 'All Months' || getMonth(ex) === financeMonth
    ), [expenses, financeMonth]);

  const totalExpenses = expenses.reduce((a, ex) => a + (Number(ex.amount) || 0), 0);
  const totalSalaries = expenses.filter(ex => ex.category === 'Salary').reduce((a, ex) => a + (Number(ex.amount) || 0), 0);
  const totalOtherExpenses = totalExpenses - totalSalaries;
  const remainingFunds = totalFunds - totalExpenses;

  /* ── Load data via dbService (Cloud Firestore + LocalStorage fallback) ── */
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session !== 'true') { router.push('/admin'); return; }
    
    const role = localStorage.getItem('adminRole') || 'superadmin';
    setAdminRole(role);
    setAuthorized(true);

    if (role === 'finance') setActiveTab('finance');
    else if (role === 'staff') setActiveTab('volunteers');
    else setActiveTab('analytics');

    // Subscribe to real-time collections
    const unSubDonations = dbService.subscribe('donations', initialDonations, (data) => {
      setDonations(normalizeDates(data));
    });

    const unSubTestimonials = dbService.subscribe('testimonials', initialTestimonials, (data) => {
      setTestimonials(data);
    });

    const unSubCarousel = dbService.subscribe('carousel', initialCarousel, (data) => {
      setCarousel(data);
    });

    const unSubVolunteers = dbService.subscribe('volunteers', initialVolunteers, (data) => {
      setVolunteers(normalizeDates(data));
    });

    const unSubEvents = dbService.subscribe('events', initialEvents, (data) => {
      setEvents(data);
    });

    const unSubGallery = dbService.subscribe('gallery', initialGallery, (data) => {
      setGallery(data);
    });

    const unSubEmployees = dbService.subscribe('employees', initialEmployees, (data) => {
      setEmployees(data);
    });

    const unSubExpenses = dbService.subscribe('expenses', initialExpenses, (data) => {
      setExpenses(normalizeDates(data));
    });

    const unSubStudents = dbService.subscribe('students', initialStudents, (data) => {
      setStudents(normalizeDates(data));
    });

    const unSubAuditLogs = dbService.subscribe('audit_logs', [], (data) => {
      // Sort newest first
      const sorted = [...data].sort((a, b) => new Date(b.timestamp || b.id) - new Date(a.timestamp || a.id));
      setAuditLogs(sorted);
    });

    return () => {
      unSubDonations();
      unSubTestimonials();
      unSubCarousel();
      unSubVolunteers();
      unSubEvents();
      unSubGallery();
      unSubEmployees();
      unSubExpenses();
      unSubStudents();
      unSubAuditLogs();
    };
  }, [router]);

  /* ── Handlers ── */
  const handleLogout = () => { localStorage.removeItem('adminSession'); router.push('/'); };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    const chosenDate = newDonorDate ? new Date(newDonorDate) : new Date();
    const dateStr = chosenDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${chosenDate.toLocaleString('en-GB', { month: 'short' })} ${chosenDate.getFullYear()}`;
    const n = { id: Date.now(), name: newDonorName, email: newDonorEmail, amount: parseFloat(newDonorAmount), type: newDonorType, date: dateStr, month: mon, status: newDonorType === 'Monthly' ? 'Active' : 'Completed' };
    await dbService.saveItem('donations', n);
    await dbService.logActivity('CREATE', 'Donations', `Registered donation of ₹${n.amount.toLocaleString()} from ${n.name} (${n.type}) for ${dateStr}`, adminRole);
    setNewDonorName(''); setNewDonorEmail(''); setNewDonorAmount(''); setNewDonorDate('');
  };
  const deleteDonor = async (id) => { 
    const donor = donations.find(d => String(d.id) === String(id));
    await dbService.deleteItem('donations', id);
    await dbService.logActivity('DELETE', 'Donations', `Deleted donor record: ${donor?.name || id}`, adminRole);
  };

  /* ── Student Handlers ── */
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const chosenDate = newStuDate ? new Date(newStuDate) : new Date();
    const dateStr = chosenDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${chosenDate.toLocaleString('en-GB', { month: 'short' })} ${chosenDate.getFullYear()}`;
    const n = {
      id: Date.now(),
      name: newStuName,
      parentName: newStuParent,
      phone: newStuPhone,
      aadhaar: newStuAadhaar,
      address: newStuAddress,
      level: newStuLevel,
      fee: parseFloat(newStuFee || 0),
      feeStatus: newStuFeeStatus,
      date: dateStr,
      month: mon,
      status: 'In Training'
    };
    await dbService.saveItem('students', n);
    await dbService.logActivity('CREATE', 'Students', `Enrolled student ${n.name} in ${n.level} with fee ₹${n.fee} (${n.feeStatus})`, adminRole);
    setNewStuName(''); setNewStuParent(''); setNewStuPhone(''); setNewStuAadhaar(''); setNewStuAddress(''); setNewStuDate('');
  };

  const deleteStudent = async (id) => {
    const student = students.find(s => String(s.id) === String(id));
    await dbService.deleteItem('students', id);
    await dbService.logActivity('DELETE', 'Students', `Removed student record: ${student?.name || id}`, adminRole);
  };

  const handlePromoteLevel = async (student) => {
    const levelMap = {
      "Level 1 (Foundation)": "Level 2 (Explorer)",
      "Level 2 (Explorer)": "Level 3 (Skill Building)",
      "Level 3 (Skill Building)": "Level 4 (Future Ready)",
      "Level 4 (Future Ready)": "Certified / Completed"
    };
    const nextLevel = levelMap[student.level];
    if (!nextLevel) return;
    const updated = {
      ...student,
      level: nextLevel,
      status: nextLevel === "Certified / Completed" ? "Certified" : "In Training"
    };
    await dbService.saveItem('students', updated);
    await dbService.logActivity('UPDATE', 'Students', `Promoted student ${student.name} to ${nextLevel}`, adminRole);
  };

  const handleToggleFeeStatus = async (student) => {
    const nextStatus = student.feeStatus === 'Paid' ? 'Pending' : 'Paid';
    const updated = { ...student, feeStatus: nextStatus };
    await dbService.saveItem('students', updated);
    await dbService.logActivity('UPDATE', 'Students', `Updated fee payment status for ${student.name} to ${nextStatus}`, adminRole);
  };

  const handleAddTest = async (e) => {
    e.preventDefault();
    const initials = newTestName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
    const n = { id: Date.now(), name: newTestName, role: newTestRole, quote: newTestQuote, avatar: initials };
    await dbService.saveItem('testimonials', n);
    await dbService.logActivity('CREATE', 'Testimonials', `Added testimonial for ${n.name} (${n.role})`, adminRole);
    setNewTestName(''); setNewTestRole(''); setNewTestQuote('');
  };
  const deleteTest = async (id) => { 
    await dbService.deleteItem('testimonials', id);
    await dbService.logActivity('DELETE', 'Testimonials', `Removed testimonial ID #${id}`, adminRole);
  };

  const handleAddCarousel = async (e) => {
    e.preventDefault();
    const n = { id: Date.now(), url: newCarouselUrl, caption: newCarouselCaption };
    await dbService.saveItem('carousel', n);
    await dbService.logActivity('CREATE', 'Carousel', `Added slide: "${n.caption}"`, adminRole);
    setNewCarouselUrl(''); setNewCarouselCaption('');
  };
  const deleteCarousel = async (id) => { 
    await dbService.deleteItem('carousel', id);
    await dbService.logActivity('DELETE', 'Carousel', `Deleted carousel slide ID #${id}`, adminRole);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const n = { id: Date.now(), title: newEventTitle, date: newEventDate, location: newEventLocation, desc: newEventDesc };
    await dbService.saveItem('events', n);
    await dbService.logActivity('CREATE', 'Events', `Scheduled community event: "${n.title}" (${n.date})`, adminRole);
    setNewEventTitle(''); setNewEventDate(''); setNewEventLocation(''); setNewEventDesc('');
  };
  const deleteEvent = async (id) => { 
    await dbService.deleteItem('events', id);
    await dbService.logActivity('DELETE', 'Events', `Cancelled event ID #${id}`, adminRole);
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    const n = { id: Date.now(), url: newGalleryUrl, caption: newGalleryCaption };
    await dbService.saveItem('gallery', n);
    await dbService.logActivity('CREATE', 'Gallery', `Uploaded gallery photo: "${n.caption}"`, adminRole);
    setNewGalleryUrl(''); setNewGalleryCaption('');
  };
  const deleteGallery = async (id) => { 
    await dbService.deleteItem('gallery', id);
    await dbService.logActivity('DELETE', 'Gallery', `Removed gallery photo ID #${id}`, adminRole);
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${today.toLocaleString('en-GB', { month: 'short' })} ${today.getFullYear()}`;
    const n = { id: Date.now(), name: newVolName, email: newVolEmail, phone: newVolPhone, interest: newVolInterest, date: dateStr, month: mon };
    await dbService.saveItem('volunteers', n);
    await dbService.logActivity('CREATE', 'Volunteers', `Registered volunteer: ${n.name} (${n.interest})`, adminRole);
    setNewVolName(''); setNewVolEmail(''); setNewVolPhone('');
  };
  const deleteVolunteer = async (id) => { 
    await dbService.deleteItem('volunteers', id);
    await dbService.logActivity('DELETE', 'Volunteers', `Removed volunteer record ID #${id}`, adminRole);
  };

  /* ── FINANCE ── */
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${today.toLocaleString('en-GB', { month: 'short' })} ${today.getFullYear()}`;
    const n = { id: Date.now(), name: newEmpName, role: newEmpRole, baseSalary: parseFloat(newEmpSalary), date: dateStr, month: mon };
    await dbService.saveItem('employees', n);
    await dbService.logActivity('CREATE', 'Finance', `Onboarded employee ${n.name} (${n.role}) with base salary ₹${n.baseSalary.toLocaleString()}`, adminRole);
    setNewEmpName(''); setNewEmpRole(''); setNewEmpSalary('');
  };
  const deleteEmployee = async (id) => { 
    const emp = employees.find(e => String(e.id) === String(id));
    await dbService.deleteItem('employees', id);
    await dbService.logActivity('DELETE', 'Finance', `Removed staff member: ${emp?.name || id}`, adminRole);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const chosenDate = newExpDate ? new Date(newExpDate) : new Date();
    const dateStr = chosenDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mon = `${chosenDate.toLocaleString('en-GB', { month: 'short' })} ${chosenDate.getFullYear()}`;
    const n = { id: Date.now(), date: dateStr, month: mon, category: newExpCat, desc: newExpDesc, amount: parseFloat(newExpAmt) };
    await dbService.saveItem('expenses', n);
    await dbService.logActivity('CREATE', 'Finance', `Logged ${n.category} expense: ₹${n.amount.toLocaleString()} for "${n.desc}" (${dateStr})`, adminRole);
    setNewExpCat('Operations'); setNewExpDesc(''); setNewExpAmt(''); setNewExpDate('');
  };
  const deleteExpense = async (id) => { 
    await dbService.deleteItem('expenses', id);
    await dbService.logActivity('DELETE', 'Finance', `Removed expense entry ID #${id}`, adminRole);
  };

  const handlePaySalary = async (emp) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const targetMonth = salaryMonth || `${today.toLocaleString('en-GB', { month: 'short' })} ${today.getFullYear()}`;
    const n = { id: Date.now(), date: dateStr, month: targetMonth, category: 'Salary', desc: `Salary for ${emp.name} (${targetMonth})`, amount: emp.baseSalary };
    await dbService.saveItem('expenses', n);
    await dbService.logActivity('PAYROLL', 'Finance', `Disbursed salary of ₹${emp.baseSalary.toLocaleString()} to ${emp.name} for ${targetMonth}`, adminRole);
    alert(`Salary for ${targetMonth} processed for ${emp.name}`);
  };

  /* ── Guard — after all hooks ── */
  if (!authorized) return null;

  const allNavItems = [
    { id: 'analytics',    icon: BarChart3,     label: 'Analytics' },
    { id: 'students',     icon: GraduationCap, label: 'Students & Skills' },
    { id: 'donations',    icon: Heart,         label: 'Donations' },
    { id: 'finance',      icon: Wallet,        label: 'Finance' },
    { id: 'volunteers',   icon: Users,         label: 'Volunteers' },
    { id: 'testimonials', icon: Sparkles,      label: 'Testimonials' },
    { id: 'carousel',     icon: ImageIcon,     label: 'Carousel' },
    { id: 'events',       icon: Calendar,      label: 'Events' },
    { id: 'gallery',      icon: ImageIcon,     label: 'Gallery' },
    { id: 'audit_logs',   icon: ShieldCheck,   label: 'Audit Logs' },
  ];

  const navItems = allNavItems.filter(item => {
    if (adminRole === 'superadmin') return true;
    if (adminRole === 'finance') return ['analytics', 'students', 'donations', 'finance'].includes(item.id);
    if (adminRole === 'staff') return ['students', 'volunteers', 'events', 'gallery', 'carousel'].includes(item.id);
    return false;
  });

  const getRoleLabel = () => {
    if (adminRole === 'finance') return 'Finance Manager';
    if (adminRole === 'staff') return 'Field Coordinator';
    return 'Super Administrator';
  };
  
  const getRoleInitials = () => {
    if (adminRole === 'finance') return 'FM';
    if (adminRole === 'staff') return 'FC';
    return 'SA';
  };

  const MonthFilter = ({ value, onChange }) => (
    <div className={styles.filterGroup}>
      <Calendar size={16} className={styles.filterIcon} />
      <select value={value} onChange={e => onChange(e.target.value)} className={styles.tableSelect}>
        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <div className={styles.dashboardContainer}>
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div 
            className={styles.mobileBackdrop} 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarMobileOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1 }}>
              <img src="/logo.png" alt="JPRD" className={styles.sidebarLogo} />
              <div><h3>JPRD Panel</h3><span>Admin v2.0</span></div>
            </div>
            <button 
              className={styles.mobileCloseBtn} 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <CloseIcon size={22} />
            </button>
          </div>
          <nav className={styles.sidebarNav}>
            {navItems.map(item => (
              <button key={item.id}
                className={`${styles.navItem} ${activeTab === item.id ? styles.activeNavItem : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}>
                <item.icon size={20} /><span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} /><span>Exit Panel</span>
          </button>
        </aside>

        {/* Main */}
        <main className={styles.mainContent}>
          <header className={styles.topbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button 
                className={styles.mobileMenuToggle} 
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation"
              >
                <Menu size={24} />
              </button>
              <h2>{navItems.find(n => n.id === activeTab)?.label} Management</h2>
            </div>
            <div className={styles.topbarRight}>
              <div 
                className={styles.cloudBadge}
                title={dbService.isCloudConnected() ? "Cloud Database Connected (Multi-browser sync active)" : "Running in Local Storage Mode."}
              >
                {dbService.isCloudConnected() ? <Cloud size={14} /> : <CloudOff size={14} />}
                <span>{dbService.isCloudConnected() ? "Cloud Active" : "Local Mode"}</span>
              </div>

              <div className={styles.userInfo}>
                <div className={styles.userBadge}>{getRoleInitials()}</div>
                <span>{getRoleLabel()}</span>
              </div>
            </div>
          </header>

          {/* ══ ANALYTICS ══ */}
          {activeTab === 'analytics' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionFilterBar}>
                <span className={styles.filterBarLabel}>Filter by month:</span>
                <MonthFilter value={analyticsMonth} onChange={setAnalyticsMonth} />
                {analyticsMonth !== 'All Months' && (
                  <button className={styles.clearFilter} onClick={() => setAnalyticsMonth('All Months')}>× Clear</button>
                )}
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}><span className={styles.statLabel}>Funds Raised</span><span className={styles.statValue}>&#8377;{analyticsFunds.toLocaleString()}</span><span className={styles.statMeta}><TrendingUp size={14} /> {analyticsMonth}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Monthly Donors</span><span className={styles.statValue}>{analyticsMonthly}</span><span className={styles.statMeta}><Activity size={14} /> Recurring</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>One-time Donations</span><span className={styles.statValue}>{analyticsOneTime}</span><span className={styles.statMeta}><ArrowUpRight size={14} /> Completed</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Volunteers</span><span className={styles.statValue}>{analyticsVols.length}</span><span className={styles.statMeta}><Users size={14} /> {analyticsMonth}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Upcoming Events</span><span className={styles.statValue}>{events.length}</span><span className={styles.statMeta}><Calendar size={14} /> Scheduled</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Testimonials Live</span><span className={styles.statValue}>{testimonials.length}</span><span className={styles.statMeta}><Sparkles size={14} /> On homepage</span></div>
              </div>

              <div className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <div><h3>Annual Fundraising Goal — FY 2026–27</h3><p>&#8377;{totalFunds.toLocaleString()} raised of &#8377;{DONATION_GOAL.toLocaleString()} target</p></div>
                  <div className={styles.goalPct}>{goalPct}%</div>
                </div>
                <div className={styles.goalBar}><div className={styles.goalFill} style={{ width: `${goalPct}%` }} /></div>
                <div className={styles.goalFooter}><span>&#8377;{(DONATION_GOAL - totalFunds).toLocaleString()} remaining</span><span className={styles.goalTag}><Target size={14} /> Goal: &#8377;5,00,000</span></div>
              </div>

              <div className={styles.utilizationCard}>
                <h3>Fund Utilization Breakdown</h3>
                <div className={styles.utilGrid}>
                  {[{label:'Education',pct:38,color:'#1F5B35'},{label:'Health',pct:24,color:'#0B2545'},{label:'Skills Training',pct:20,color:'#D96B27'},{label:'Operations',pct:18,color:'#C5A059'}].map(item => (
                    <div key={item.label} className={styles.utilRow}>
                      <div className={styles.utilLabel}><span className={styles.utilDot} style={{background:item.color}}/>{item.label}</div>
                      <div className={styles.utilBar}><div className={styles.utilFill} style={{width:`${item.pct}%`,background:item.color}}/></div>
                      <span className={styles.utilPct}>{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.tableHeader}><h3>Donations {analyticsMonth !== 'All Months' ? `— ${analyticsMonth}` : '(All)'}</h3></div>
                <table className={styles.table}>
                  <thead><tr><th>Donor</th><th>Type</th><th>Amount</th><th>Month</th><th>Status</th></tr></thead>
                  <tbody>
                    {analyticsDonations.slice(0, 8).map(d => (
                      <tr key={d.id}>
                        <td><div className={styles.tableName}>{d.name}</div><div className={styles.tableEmail}>{d.email}</div></td>
                        <td><span className={`${styles.badge} ${d.type === 'Monthly' ? styles.badgeGreen : styles.badgeBlue}`}>{d.type}</span></td>
                        <td className={styles.tableAmt}>&#8377;{d.amount.toLocaleString()}</td>
                        <td>{getMonth(d)}</td>
                        <td><span className={styles.activeLabel}><CheckCircle size={12} style={{marginRight:4}}/>{d.status}</span></td>
                      </tr>
                    ))}
                    {analyticsDonations.length === 0 && <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No records for {analyticsMonth}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ DONATIONS ══ */}
          {activeTab === 'donations' && (
            <div className={styles.tabContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}><span className={styles.statLabel}>Total Raised</span><span className={styles.statValue}>&#8377;{totalFunds.toLocaleString()}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Monthly Active</span><span className={styles.statValue}>{donations.filter(d=>d.type==='Monthly').length}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>One-time Completed</span><span className={styles.statValue}>{donations.filter(d=>d.type==='One-time').length}</span></div>
              </div>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Register Donation</h3>
                  <form onSubmit={handleAddDonor} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Donor Name</label><input type="text" value={newDonorName} onChange={e=>setNewDonorName(e.target.value)} required placeholder="e.g. Suresh Kumar" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Email</label><input type="email" value={newDonorEmail} onChange={e=>setNewDonorEmail(e.target.value)} required placeholder="e.g. suresh@email.com" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Amount (INR)</label><input type="number" value={newDonorAmount} onChange={e=>setNewDonorAmount(e.target.value)} required placeholder="e.g. 5000" min="1" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Type</label><select value={newDonorType} onChange={e=>setNewDonorType(e.target.value)} className={styles.dashSelect}><option value="Monthly">Monthly Recurring</option><option value="One-time">One-time</option></select></div>
                    <div className={styles.formGroup}><label>Donation Date (Optional / Past Date)</label><input type="date" value={newDonorDate} onChange={e=>setNewDonorDate(e.target.value)} className={styles.dashInput}/></div>
                    <button type="submit" className={styles.addBtn}><Plus size={16}/> Add Donor</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <h3>Donation Records</h3>
                    <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                      <button 
                        className={styles.pdfReportBtn} 
                        title="Download & Print official PDF report"
                        onClick={() => generatePrintableReport(
                          'Donations Ledger & 80G Contribution Statement',
                          `Filtered Report for: ${donationMonth} | Type: ${donationTypeFilter}`,
                          [
                            { key: 'name', label: 'Donor Name' },
                            { key: 'email', label: 'Email' },
                            { key: 'type', label: 'Type' },
                            { key: 'amount', label: 'Amount', isAmount: true },
                            { key: 'date', label: 'Date' },
                            { key: 'month', label: 'Month' },
                            { key: 'status', label: 'Status' }
                          ],
                          filteredDonations,
                          [
                            { label: 'Total Raised in View', value: `₹${filteredDonations.reduce((a,d)=>a+d.amount,0).toLocaleString()}` },
                            { label: 'Total Donors', value: filteredDonations.length },
                            { label: 'Monthly Donors', value: filteredDonations.filter(d=>d.type==='Monthly').length }
                          ]
                        )}
                      >
                        <FileText size={15}/> Download PDF Report
                      </button>
                      <div className={styles.filterGroup}><Filter size={16} className={styles.filterIcon}/><select value={donationTypeFilter} onChange={e=>setDonationTypeFilter(e.target.value)} className={styles.tableSelect}><option value="All">All Types</option><option value="Monthly">Monthly</option><option value="One-time">One-time</option></select></div>
                      <MonthFilter value={donationMonth} onChange={setDonationMonth}/>
                      {donationMonth !== 'All Months' && <button className={styles.clearFilter} onClick={()=>setDonationMonth('All Months')}>× Clear</button>}
                    </div>
                  </div>
                  <table className={styles.table}>
                    <thead><tr><th>Name</th><th>Type</th><th>Amount</th><th>Month</th><th>Status</th><th>CRM</th><th>Del</th></tr></thead>
                    <tbody>
                      {filteredDonations.map(d => (
                        <tr key={d.id}>
                          <td><div className={styles.tableName}>{d.name}</div><div className={styles.tableEmail}>{d.email}</div></td>
                          <td><span className={`${styles.badge} ${d.type==='Monthly'?styles.badgeGreen:styles.badgeBlue}`}>{d.type}</span></td>
                          <td className={styles.tableAmt}>&#8377;{d.amount.toLocaleString()}</td>
                          <td>{getMonth(d)}</td>
                          <td><span className={styles.activeLabel}><CheckCircle size={12} style={{marginRight:4}}/>{d.status}</span></td>
                          <td><button className={styles.viewBtn} onClick={()=>setSelectedDonor(d)} title="View Profile"><Eye size={16}/></button></td>
                          <td><button className={styles.deleteBtn} onClick={()=>deleteDonor(d.id)}><Trash2 size={16}/></button></td>
                        </tr>
                      ))}
                      {filteredDonations.length===0 && <tr><td colSpan="7" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No records match this filter</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          )}

          {/* ══ FINANCE ══ */}
          {activeTab === 'finance' && (
            <div className={styles.tabContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}><span className={styles.statLabel}>Available Funds</span><span className={styles.statValue}>&#8377;{remainingFunds.toLocaleString()}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Total Operational Expenses</span><span className={styles.statValue}>&#8377;{totalOtherExpenses.toLocaleString()}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Total Salaries Paid</span><span className={styles.statValue}>&#8377;{totalSalaries.toLocaleString()}</span></div>
              </div>

              <div className={styles.splitGrid}>
                {/* Left Col: Forms */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className={styles.controlCard}>
                    <h3>Log Expense</h3>
                    <form onSubmit={handleAddExpense} className={styles.dashboardForm}>
                      <div className={styles.formGroup}><label>Amount (INR)</label><input type="number" value={newExpAmt} onChange={e=>setNewExpAmt(e.target.value)} required placeholder="e.g. 5000" min="1" className={styles.dashInput}/></div>
                      <div className={styles.formGroup}><label>Category</label><select value={newExpCat} onChange={e=>setNewExpCat(e.target.value)} className={styles.dashSelect}><option>Operations</option><option>Marketing</option><option>Health</option><option>Education</option><option>Travel</option><option>Other</option></select></div>
                      <div className={styles.formGroup}><label>Description</label><input type="text" value={newExpDesc} onChange={e=>setNewExpDesc(e.target.value)} required placeholder="e.g. Rent" className={styles.dashInput}/></div>
                      <div className={styles.formGroup}><label>Expense Date (Optional / Past Date)</label><input type="date" value={newExpDate} onChange={e=>setNewExpDate(e.target.value)} className={styles.dashInput}/></div>
                      <button type="submit" className={styles.addBtn}><Wallet size={16}/> Record Expense</button>
                    </form>
                  </div>

                  <div className={styles.controlCard}>
                    <h3>Onboard Employee</h3>
                    <form onSubmit={handleAddEmployee} className={styles.dashboardForm}>
                      <div className={styles.formGroup}><label>Name</label><input type="text" value={newEmpName} onChange={e=>setNewEmpName(e.target.value)} required placeholder="e.g. Ram Kumar" className={styles.dashInput}/></div>
                      <div className={styles.formGroup}><label>Role</label><input type="text" value={newEmpRole} onChange={e=>setNewEmpRole(e.target.value)} required placeholder="e.g. Field Agent" className={styles.dashInput}/></div>
                      <div className={styles.formGroup}><label>Base Salary (INR)</label><input type="number" value={newEmpSalary} onChange={e=>setNewEmpSalary(e.target.value)} required placeholder="e.g. 15000" min="1" className={styles.dashInput}/></div>
                      <button type="submit" className={styles.addBtn}><UserPlus size={16}/> Add Employee</button>
                    </form>
                  </div>
                </div>

                {/* Right Col: Tables */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                      <h3>Staff Payroll</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className={styles.filterGroup} title="Select which month's salary you are disbursing">
                          <Calendar size={16} className={styles.filterIcon} />
                          <select 
                            value={salaryMonth} 
                            onChange={e => setSalaryMonth(e.target.value)} 
                            className={styles.tableSelect}
                            style={{ fontWeight: 600 }}
                          >
                            {MONTHS.filter(m => m !== 'All Months').map(m => (
                              <option key={m} value={m}>Pay for {m}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          className={styles.pdfReportBtn} 
                          title="Generate official printable PDF Payroll report"
                          onClick={() => generatePrintableReport(
                            'Staff Payroll & Honorarium Statement',
                            'Official Employee Compensation Register',
                            [
                              { key: 'name', label: 'Employee Name' },
                              { key: 'role', label: 'Designation / Role' },
                              { key: 'baseSalary', label: 'Monthly Base Salary', isAmount: true },
                              { key: 'date', label: 'Onboarded Date' },
                              { key: 'month', label: 'Registered Month' }
                            ],
                            employees,
                            [
                              { label: 'Total Active Staff', value: employees.length },
                              { label: 'Monthly Payroll Liability', value: `₹${employees.reduce((a,e)=>a+(Number(e.baseSalary)||0),0).toLocaleString()}` }
                            ]
                          )}
                        >
                          <FileText size={15}/> Download PDF Report
                        </button>
                      </div>
                    </div>
                    <table className={styles.table}>
                      <thead><tr><th>Employee</th><th>Salary</th><th>Disburse Action</th><th>Del</th></tr></thead>
                      <tbody>
                        {employees.map(emp => (
                          <tr key={emp.id}>
                            <td><div className={styles.tableName}>{emp.name}</div><div className={styles.tableEmail}>{emp.role}</div></td>
                            <td className={styles.tableAmt}>&#8377;{emp.baseSalary.toLocaleString()}</td>
                            <td>
                              <button 
                                className={styles.viewBtn} 
                                onClick={() => handlePaySalary(emp)} 
                                style={{ background: 'var(--color-secondary)', color: '#fff' }} 
                                title={`Disburse salary for ${salaryMonth}`}
                              >
                                Pay {salaryMonth ? `(${salaryMonth.split(' ')[0]})` : ''}
                              </button>
                            </td>
                            <td><button className={styles.deleteBtn} onClick={()=>deleteEmployee(emp.id)}><Trash2 size={16}/></button></td>
                          </tr>
                        ))}
                        {employees.length===0 && <tr><td colSpan="4" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No employees registered</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                      <h3>Expense Ledger</h3>
                      <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                        <button 
                          className={styles.pdfReportBtn} 
                          title="Generate official printable PDF Expense report"
                          onClick={() => generatePrintableReport(
                            'Operational & Program Expense Statement',
                            `Filtered Statement for: ${financeMonth}`,
                            [
                              { key: 'date', label: 'Date' },
                              { key: 'category', label: 'Category' },
                              { key: 'desc', label: 'Description' },
                              { key: 'amount', label: 'Amount Disbursed', isAmount: true },
                              { key: 'month', label: 'Month' }
                            ],
                            filteredExpenses,
                            [
                              { label: 'Total Disbursed in View', value: `₹${filteredExpenses.reduce((a,e)=>a+(Number(e.amount)||0),0).toLocaleString()}` },
                              { label: 'Total Transactions', value: filteredExpenses.length }
                            ]
                          )}
                        >
                          <FileText size={15}/> Download PDF Report
                        </button>
                        <MonthFilter value={financeMonth} onChange={setFinanceMonth}/>
                        {financeMonth !== 'All Months' && <button className={styles.clearFilter} onClick={()=>setFinanceMonth('All Months')}>× Clear</button>}
                      </div>
                    </div>
                    <table className={styles.table}>
                      <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Del</th></tr></thead>
                      <tbody>
                        {filteredExpenses.map(ex => (
                          <tr key={ex.id}>
                            <td>{ex.date}</td>
                            <td><span className={`${styles.badge} ${ex.category === 'Salary' ? styles.badgeGreen : styles.badgeBlue}`}>{ex.category}</span></td>
                            <td>{ex.desc}</td>
                            <td className={styles.tableAmt} style={{color: 'var(--color-orange)'}}>-&#8377;{ex.amount.toLocaleString()}</td>
                            <td><button className={styles.deleteBtn} onClick={()=>deleteExpense(ex.id)}><Trash2 size={16}/></button></td>
                          </tr>
                        ))}
                        {filteredExpenses.length===0 && <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No expenses recorded</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ VOLUNTEERS ══ */}
          {activeTab === 'volunteers' && (
            <div className={styles.tabContent}>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Add Volunteer</h3>
                  <form onSubmit={handleAddVolunteer} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Full Name</label><input type="text" value={newVolName} onChange={e=>setNewVolName(e.target.value)} required placeholder="e.g. Ranjit Kumar" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Email</label><input type="email" value={newVolEmail} onChange={e=>setNewVolEmail(e.target.value)} required placeholder="e.g. ranjit@email.com" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Phone</label><input type="tel" value={newVolPhone} onChange={e=>setNewVolPhone(e.target.value)} required placeholder="+91 9876543210" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Area of Interest</label>
                      <select value={newVolInterest} onChange={e=>setNewVolInterest(e.target.value)} className={styles.dashSelect}>
                        <option>Education & Teaching</option><option>Health Campaigns</option><option>Event Organizing</option>
                        <option>Skill Training</option><option>Women Welfare</option><option>Youth Programs</option><option>General Interest</option>
                      </select>
                    </div>
                    <button type="submit" className={styles.addBtn}><UserPlus size={16}/> Add Volunteer</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <h3>Volunteers ({filteredVolunteers.length})</h3>
                    <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                      <button 
                        className={styles.pdfReportBtn} 
                        title="Generate official printable PDF Volunteers Directory report"
                        onClick={() => generatePrintableReport(
                          'Volunteers Roster & Community Engagement Directory',
                          `Filtered Registry for: ${volunteerMonth}`,
                          [
                            { key: 'name', label: 'Volunteer Name' },
                            { key: 'email', label: 'Email' },
                            { key: 'phone', label: 'Contact Phone' },
                            { key: 'interest', label: 'Primary Interest Area' },
                            { key: 'date', label: 'Registration Date' },
                            { key: 'month', label: 'Registered Month' }
                          ],
                          filteredVolunteers,
                          [
                            { label: 'Registered Volunteers', value: filteredVolunteers.length },
                            { label: 'Active Filter Month', value: volunteerMonth }
                          ]
                        )}
                      >
                        <FileText size={15}/> Download PDF Report
                      </button>
                      <MonthFilter value={volunteerMonth} onChange={setVolunteerMonth}/>
                      {volunteerMonth !== 'All Months' && <button className={styles.clearFilter} onClick={()=>setVolunteerMonth('All Months')}>× Clear</button>}
                    </div>
                  </div>
                  <table className={styles.table}>
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Interest</th><th>Month</th><th>Del</th></tr></thead>
                    <tbody>
                      {filteredVolunteers.map(v => (
                        <tr key={v.id}>
                          <td><span className={styles.tableName}>{v.name}</span></td>
                          <td>{v.email}</td>
                          <td>{v.phone}</td>
                          <td><span className={`${styles.badge} ${styles.badgeGreen}`}>{v.interest}</span></td>
                          <td>{getMonth(v)}</td>
                          <td><button className={styles.deleteBtn} onClick={()=>deleteVolunteer(v.id)}><Trash2 size={16}/></button></td>
                        </tr>
                      ))}
                      {filteredVolunteers.length===0 && <tr><td colSpan="6" style={{textAlign:'center',padding:'2rem',color:'#999'}}>No volunteers for {volunteerMonth}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ STUDENTS & SKILLS TRAINING ══ */}
          {activeTab === 'students' && (
            <div className={styles.tabContent}>
              {/* Summary KPIs */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Enrolled Students</span>
                  <span className={styles.statValue}>{students.length}</span>
                  <div className={styles.statMeta}>
                    <GraduationCap size={13} style={{ color: '#1d4ed8' }} />
                    <span>Across 4 Skill Levels</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Fees Collected</span>
                  <span className={styles.statValue}>&#8377;{studentTotalFeesCollected.toLocaleString()}</span>
                  <div className={styles.statMeta}>
                    <CheckCircle size={13} style={{ color: '#16a34a' }} />
                    <span>{studentPaidCount} Paid Registrations</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Pending Fee Dues</span>
                  <span className={styles.statValue}>{studentPendingCount}</span>
                  <div className={styles.statMeta}>
                    <Wallet size={13} style={{ color: '#d97706' }} />
                    <span>Awaiting Payment</span>
                  </div>
                </div>
              </div>

              <div className={styles.splitGrid}>
                {/* Left Col: Registration Form */}
                <div className={styles.controlCard}>
                  <h3>Register New Student</h3>
                  <form onSubmit={handleAddStudent} className={styles.dashboardForm}>
                    <div className={styles.formGroup}>
                      <label>Student Full Name *</label>
                      <input 
                        type="text" 
                        value={newStuName} 
                        onChange={e=>setNewStuName(e.target.value)} 
                        required 
                        placeholder="e.g. Rahul Verma" 
                        className={styles.dashInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Parent / Guardian Name *</label>
                      <input 
                        type="text" 
                        value={newStuParent} 
                        onChange={e=>setNewStuParent(e.target.value)} 
                        required 
                        placeholder="e.g. Mahendra Verma" 
                        className={styles.dashInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Mobile Number (10 Digits) *</label>
                      <input 
                        type="tel" 
                        value={newStuPhone} 
                        onChange={e=>setNewStuPhone(e.target.value)} 
                        required 
                        placeholder="e.g. 9876543210" 
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        className={styles.dashInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Aadhaar Number (12 Digits) *</label>
                      <input 
                        type="text" 
                        value={newStuAadhaar} 
                        onChange={e=>setNewStuAadhaar(e.target.value.replace(/\s+/g, ''))} 
                        required 
                        placeholder="e.g. 123456789012" 
                        maxLength={12}
                        className={styles.dashInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Full Address / Village / District *</label>
                      <input 
                        type="text" 
                        value={newStuAddress} 
                        onChange={e=>setNewStuAddress(e.target.value)} 
                        required 
                        placeholder="e.g. Village Bhaisakharag, Mau, UP" 
                        className={styles.dashInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Skill Training Level *</label>
                      <select 
                        value={newStuLevel} 
                        onChange={e=>setNewStuLevel(e.target.value)} 
                        className={styles.dashSelect}
                      >
                        {SKILL_LEVELS.map(lvl => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className={styles.formGroup}>
                        <label>Reg. Fee (&#8377;)</label>
                        <input 
                          type="number" 
                          value={newStuFee} 
                          onChange={e=>setNewStuFee(e.target.value)} 
                          min="0"
                          placeholder="500" 
                          className={styles.dashInput}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Payment Status</label>
                        <select 
                          value={newStuFeeStatus} 
                          onChange={e=>setNewStuFeeStatus(e.target.value)} 
                          className={styles.dashSelect}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Scholarship">Scholarship / Free</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Enrollment Date (Optional / Custom)</label>
                      <input 
                        type="date" 
                        value={newStuDate} 
                        onChange={e=>setNewStuDate(e.target.value)} 
                        className={styles.dashInput}
                      />
                    </div>

                    <button type="submit" className={styles.addBtn}>
                      <GraduationCap size={17} /> Enroll Student
                    </button>
                  </form>
                </div>

                {/* Right Col: Student Directory Table */}
                <div className={styles.tableCard}>
                  <div className={styles.tableHeader}>
                    <div>
                      <h3>Student Directory ({filteredStudents.length})</h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                        Manage student profiles, skill progression levels, and fee statuses.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className={styles.pdfReportBtn} 
                        title="Generate official printable PDF Student Roster"
                        onClick={() => generatePrintableReport(
                          'Student Enrollment & Skill Training Roster',
                          `Filtered Registry for: ${studentMonth} | Level: ${studentLevelFilter} | Fee Status: ${studentFeeFilter}`,
                          [
                            { key: 'name', label: 'Student Name' },
                            { key: 'parentName', label: 'Parent/Guardian' },
                            { key: 'phone', label: 'Mobile No' },
                            { key: 'aadhaar', label: 'Aadhaar No' },
                            { key: 'address', label: 'Address / Location' },
                            { key: 'level', label: 'Skill Level' },
                            { key: 'fee', label: 'Reg Fee', isAmount: true },
                            { key: 'feeStatus', label: 'Payment Status' },
                            { key: 'date', label: 'Enrollment Date' }
                          ],
                          filteredStudents,
                          [
                            { label: 'Total Students in View', value: filteredStudents.length },
                            { label: 'Paid Fee Students', value: filteredStudents.filter(s=>s.feeStatus==='Paid').length },
                            { label: 'Pending Fee Students', value: filteredStudents.filter(s=>s.feeStatus==='Pending').length },
                            { label: 'Total Fees Collected', value: `₹${filteredStudents.filter(s=>s.feeStatus==='Paid').reduce((sum,s)=>sum+(Number(s.fee)||0),0).toLocaleString()}` }
                          ]
                        )}
                      >
                        <FileText size={15}/> Download PDF Report
                      </button>

                      {/* Live Search */}
                      <div className={styles.searchWrapper}>
                        <Search size={15} className={styles.searchIcon} />
                        <input 
                          type="text" 
                          placeholder="Search name, phone, aadhaar..." 
                          value={studentSearch} 
                          onChange={e=>setStudentSearch(e.target.value)} 
                          className={styles.searchInput}
                        />
                      </div>

                      {/* Level Filter */}
                      <div className={styles.filterGroup}>
                        <Filter size={15} className={styles.filterIcon} />
                        <select 
                          value={studentLevelFilter} 
                          onChange={e=>setStudentLevelFilter(e.target.value)} 
                          className={styles.tableSelect}
                        >
                          <option value="All">All Skill Levels</option>
                          {SKILL_LEVELS.map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                          <option value="Certified / Completed">Certified / Completed</option>
                        </select>
                      </div>

                      {/* Fee Status Filter */}
                      <div className={styles.filterGroup}>
                        <Wallet size={15} className={styles.filterIcon} />
                        <select 
                          value={studentFeeFilter} 
                          onChange={e=>setStudentFeeFilter(e.target.value)} 
                          className={styles.tableSelect}
                        >
                          <option value="All">All Fee Statuses</option>
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Scholarship">Scholarship</option>
                        </select>
                      </div>

                      <MonthFilter value={studentMonth} onChange={setStudentMonth}/>
                      {(studentMonth !== 'All Months' || studentLevelFilter !== 'All' || studentFeeFilter !== 'All' || studentSearch) && (
                        <button 
                          className={styles.clearFilter} 
                          onClick={() => {
                            setStudentMonth('All Months');
                            setStudentLevelFilter('All');
                            setStudentFeeFilter('All');
                            setStudentSearch('');
                          }}
                        >
                          × Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Student & Parents</th>
                        <th>Contact / Aadhaar</th>
                        <th>Address</th>
                        <th>Skill Level & Upgrade</th>
                        <th>Fee Status</th>
                        <th>Date</th>
                        <th>Del</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(s => {
                        const levelClass = 
                          s.level.includes('Level 1') ? styles.badgeLevel1 :
                          s.level.includes('Level 2') ? styles.badgeLevel2 :
                          s.level.includes('Level 3') ? styles.badgeLevel3 :
                          styles.badgeLevel4;

                        return (
                          <tr key={s.id}>
                            <td>
                              <div className={styles.tableName}>{s.name}</div>
                              <div className={styles.tableEmail}>Parent: <strong>{s.parentName || 'N/A'}</strong></div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{s.phone}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Aadhaar: {s.aadhaar ? `•••• •••• ${s.aadhaar.slice(-4)}` : 'N/A'}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.85rem', maxWidth: '180px', color: '#334155' }}>
                                {s.address}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                                <span className={`${styles.badge} ${levelClass}`}>
                                  {s.level}
                                </span>
                                {s.level !== 'Certified / Completed' && (
                                  <button 
                                    className={styles.upgradeBtn}
                                    title="Promote student to next skill level"
                                    onClick={() => handlePromoteLevel(s)}
                                  >
                                    <Award size={13} /> Promote Level ↑
                                  </button>
                                )}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                                <span 
                                  className={`${styles.badge} ${s.feeStatus === 'Paid' ? styles.badgePaid : s.feeStatus === 'Pending' ? styles.badgePending : styles.badgeScholarship}`}
                                  title="Click to toggle Paid / Pending status"
                                  onClick={() => handleToggleFeeStatus(s)}
                                >
                                  {s.feeStatus === 'Paid' ? '✓ Paid' : s.feeStatus === 'Pending' ? '⏳ Pending' : 'Scholarship'}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  Fee: &#8377;{(s.fee || 0).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                              {s.date || getMonth(s)}
                            </td>
                            <td>
                              <button 
                                className={styles.deleteBtn} 
                                onClick={()=>deleteStudent(s.id)}
                                title="Remove student record"
                              >
                                <Trash2 size={16}/>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                            <GraduationCap size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                            <div>No student records found matching this filter criteria.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'testimonials' && (
            <div className={styles.tabContent}>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Add Testimonial</h3>
                  <form onSubmit={handleAddTest} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Author Name</label><input type="text" value={newTestName} onChange={e=>setNewTestName(e.target.value)} required placeholder="e.g. Ramesh Singh" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Role</label><input type="text" value={newTestRole} onChange={e=>setNewTestRole(e.target.value)} required placeholder="e.g. Education Beneficiary" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Quote</label><textarea value={newTestQuote} onChange={e=>setNewTestQuote(e.target.value)} required placeholder="Enter quote..." className={styles.dashTextarea}/></div>
                    <button type="submit" className={styles.addBtn}><Plus size={16}/> Add Testimonial</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <h3>Active Testimonials ({testimonials.length})</h3>
                  <div className={styles.itemsGrid}>
                    {testimonials.map(item => (
                      <div key={item.id} className={styles.testimonialItemCard}>
                        <div className={styles.testimonialItemHeader}>
                          <div className={styles.itemAvatar}>{item.avatar}</div>
                          <div><h4>{item.name}</h4><span>{item.role}</span></div>
                          <button className={styles.itemDeleteBtn} onClick={()=>deleteTest(item.id)}><Trash2 size={16}/></button>
                        </div>
                        <p className={styles.itemQuote}>"{item.quote}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ CAROUSEL ══ */}
          {activeTab === 'carousel' && (
            <div className={styles.tabContent}>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Add Carousel Slide</h3>
                  <form onSubmit={handleAddCarousel} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Image URL</label><input type="text" value={newCarouselUrl} onChange={e=>setNewCarouselUrl(e.target.value)} required placeholder="/images/carousel-5.jpg" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Caption</label><input type="text" value={newCarouselCaption} onChange={e=>setNewCarouselCaption(e.target.value)} required placeholder="e.g. Educating the Nation" className={styles.dashInput}/></div>
                    <button type="submit" className={styles.addBtn}><Plus size={16}/> Save Slide</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <h3>Hero Slides ({carousel.length})</h3>
                  <div className={styles.carouselSlidesGrid}>
                    {carousel.map(item => (
                      <div key={item.id} className={styles.slideCard}>
                        <div className={styles.slidePreview}><span className={styles.slidePath}>{item.url}</span></div>
                        <div className={styles.slideInfo}><h4>{item.caption}</h4><button className={styles.itemDeleteBtn} onClick={()=>deleteCarousel(item.id)}><Trash2 size={16}/></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ EVENTS ══ */}
          {activeTab === 'events' && (
            <div className={styles.tabContent}>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Create New Event</h3>
                  <form onSubmit={handleAddEvent} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Event Title</label><input type="text" value={newEventTitle} onChange={e=>setNewEventTitle(e.target.value)} required placeholder="e.g. Village Awareness Camp" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Date</label><input type="text" value={newEventDate} onChange={e=>setNewEventDate(e.target.value)} required placeholder="e.g. 15 Sep 2026" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Location</label><input type="text" value={newEventLocation} onChange={e=>setNewEventLocation(e.target.value)} required placeholder="e.g. Panchayat Bhawan, Mau" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Description</label><textarea value={newEventDesc} onChange={e=>setNewEventDesc(e.target.value)} required placeholder="Brief description..." className={styles.dashTextarea}/></div>
                    <button type="submit" className={styles.addBtn}><Plus size={16}/> Publish Event</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <h3>Upcoming Events ({events.length})</h3>
                  <table className={styles.table}>
                    <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Del</th></tr></thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id}>
                          <td><div className={styles.tableName}>{ev.title}</div><div className={styles.tableEmail}>{ev.desc.slice(0,60)}…</div></td>
                          <td><span className={`${styles.badge} ${styles.badgeGreen}`}>{ev.date}</span></td>
                          <td>{ev.location}</td>
                          <td><button className={styles.deleteBtn} onClick={()=>deleteEvent(ev.id)}><Trash2 size={16}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ GALLERY ══ */}
          {activeTab === 'gallery' && (
            <div className={styles.tabContent}>
              <div className={styles.splitGrid}>
                <div className={styles.controlCard}>
                  <h3>Add Gallery Photo</h3>
                  <form onSubmit={handleAddGallery} className={styles.dashboardForm}>
                    <div className={styles.formGroup}><label>Image URL</label><input type="text" value={newGalleryUrl} onChange={e=>setNewGalleryUrl(e.target.value)} required placeholder="/images/gallery-new.jpg" className={styles.dashInput}/></div>
                    <div className={styles.formGroup}><label>Caption</label><input type="text" value={newGalleryCaption} onChange={e=>setNewGalleryCaption(e.target.value)} required placeholder="e.g. Health Camp 2026" className={styles.dashInput}/></div>
                    <button type="submit" className={styles.addBtn}><Plus size={16}/> Add to Gallery</button>
                  </form>
                </div>
                <div className={styles.tableCard}>
                  <h3>Gallery Photos ({gallery.length})</h3>
                  <div className={styles.carouselSlidesGrid}>
                    {gallery.map(item => (
                      <div key={item.id} className={styles.slideCard}>
                        <div className={styles.slidePreview}><span className={styles.slidePath}>{item.url}</span></div>
                        <div className={styles.slideInfo}><h4>{item.caption}</h4><button className={styles.itemDeleteBtn} onClick={()=>deleteGallery(item.id)}><Trash2 size={16}/></button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ AUDIT LOGS ══ */}
          {activeTab === 'audit_logs' && (
            <div className={styles.tabContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Activity Logs</span>
                  <span className={styles.statValue}>{auditLogs.length}</span>
                  <span className={styles.statMeta}><Activity size={14} /> Permanent History</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Financial Operations</span>
                  <span className={styles.statValue}>{auditLogs.filter(l => l.category === 'Finance').length}</span>
                  <span className={styles.statMeta}><Wallet size={14} /> Payroll & Expenses</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Donor Actions</span>
                  <span className={styles.statValue}>{auditLogs.filter(l => l.category === 'Donations').length}</span>
                  <span className={styles.statMeta}><Heart size={14} /> Contributions</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Current Admin Role</span>
                  <span className={styles.statValue}>{getRoleLabel()}</span>
                  <span className={styles.statMeta}><ShieldCheck size={14} /> {adminRole}</span>
                </div>
              </div>

              <div className={styles.tableCard} style={{ marginTop: '1.5rem' }}>
                <div className={styles.tableHeader}>
                  <h3>Enterprise Audit Trail & System Log</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div className={styles.filterGroup}>
                      <Filter size={16} className={styles.filterIcon} />
                      <select 
                        value={auditCategoryFilter} 
                        onChange={e => setAuditCategoryFilter(e.target.value)} 
                        className={styles.tableSelect}
                      >
                        <option value="All">All Categories</option>
                        <option value="Donations">Donations</option>
                        <option value="Finance">Finance & Payroll</option>
                        <option value="Volunteers">Volunteers</option>
                        <option value="Events">Events</option>
                        <option value="Carousel">Carousel</option>
                        <option value="Gallery">Gallery</option>
                        <option value="Testimonials">Testimonials</option>
                      </select>
                    </div>
                    {auditLogs.length > 0 && (
                      <button 
                        className={styles.pdfReportBtn} 
                        title="Generate official printable PDF Audit Trail report"
                        onClick={() => generatePrintableReport(
                          'Administrative & Financial Audit Trail',
                          `Official Compliance Log | Category Filter: ${auditCategoryFilter}`,
                          [
                            { key: 'timeStr', label: 'Time' },
                            { key: 'dateStr', label: 'Date' },
                            { key: 'action', label: 'Action' },
                            { key: 'category', label: 'Category' },
                            { key: 'details', label: 'Details' },
                            { key: 'role', label: 'Authorized Role' }
                          ],
                          auditLogs.filter(log => auditCategoryFilter === 'All' || log.category === auditCategoryFilter),
                          [
                            { label: 'Total Recorded Logs', value: auditLogs.length },
                            { label: 'Filtered Entries', value: auditLogs.filter(log => auditCategoryFilter === 'All' || log.category === auditCategoryFilter).length }
                          ]
                        )}
                      >
                        <FileText size={15} /> Download PDF Report
                      </button>
                    )}
                  </div>
                </div>

                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Time & Date</th>
                      <th>Action</th>
                      <th>Category</th>
                      <th>Details</th>
                      <th>Authorized Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .filter(log => auditCategoryFilter === 'All' || log.category === auditCategoryFilter)
                      .map((log) => {
                        let actionBadgeClass = styles.badgeBlue;
                        if (log.action === 'CREATE') actionBadgeClass = styles.badgeGreen;
                        if (log.action === 'DELETE') actionBadgeClass = styles.badgeRed || styles.badgeBlue;
                        if (log.action === 'PAYROLL') actionBadgeClass = styles.badgeGreen;

                        return (
                          <tr key={log.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>
                              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{log.timeStr}</div>
                              <div style={{ fontSize: '0.8rem', color: '#777' }}>{log.dateStr}</div>
                            </td>
                            <td>
                              <span className={`${styles.badge} ${actionBadgeClass}`}>
                                {log.action}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500 }}>{log.category}</td>
                            <td style={{ color: 'var(--color-text)' }}>{log.details}</td>
                            <td>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                {log.role}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    {auditLogs.filter(log => auditCategoryFilter === 'All' || log.category === auditCategoryFilter).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                          <ShieldCheck size={32} style={{ opacity: 0.3, marginBottom: '0.5rem', display: 'block', margin: '0 auto' }} />
                          No activity records found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>


      {selectedDonor && (
        <DonorProfile donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      )}
    </>
  );
}
