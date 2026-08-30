"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   Translation map — English (default) + Hindi
   Key sections: Navbar, Hero, About, Impact, footer snippets
   ───────────────────────────────────────────────────────────── */
const translations = {
  en: {
    // Navbar
    nav_about:    'About',
    nav_programs: 'Programs',
    nav_projects: 'Projects',
    nav_team:     'Team',
    nav_csr:      'CSR',
    nav_volunteer:'Volunteer',
    nav_donate:   'Donate',

    // Hero
    hero_tag:     'Registered NGO · 80G Tax Exempt · Est. July 2026',
    hero_title1:  'Creating',
    hero_title2:  'Opportunities.',
    hero_title3:  'Building Stronger Communities.',
    hero_subtitle:'JPRD Foundation works at the grassroots level in eastern Uttar Pradesh — empowering youth, women, and rural families through education, health, and livelihood programs.',
    hero_cta1:    'See Our Impact',
    hero_cta2:    'Partner With Us',

    // About
    about_tag:    'Our Story',
    about_title:  'A Foundation Built on Purpose',
    about_desc:   'JPRD Foundation was established in July 2026 with a singular mission — to bridge the development gap in eastern Uttar Pradesh by creating sustainable pathways in education, health, and livelihood.',

    // Impact
    impact_tag:   'Our Reach',
    impact_title: 'Changing Lives, Measurably.',
    impact_1_num: '11,350+',
    impact_1_lbl: 'Beneficiaries Reached',
    impact_2_num: '6',
    impact_2_lbl: 'Districts Covered',
    impact_3_num: '438+',
    impact_3_lbl: 'Active Volunteers',
    impact_4_num: '80G',
    impact_4_lbl: 'Tax Exempt Donations',

    // Where We Work
    wwwork_tag:   'Our Geographic Reach',
    wwwork_title: 'Where We Work',
    wwwork_sub:   'Active across 6 districts of eastern Uttar Pradesh — connecting grassroots communities with opportunity.',

    // Events
    events_title: 'Together, In Action.',
    events_sub:   'Join us in our upcoming initiatives, workshops, awareness drives, and community activities.',

    // Footer / CTA
    footer_rights:'All rights reserved.',
    cta_donate:   'Donate Now',
    cta_volunteer:'Become a Volunteer',
  },

  hi: {
    // Navbar
    nav_about:    'हमारे बारे में',
    nav_programs: 'कार्यक्रम',
    nav_projects: 'परियोजनाएँ',
    nav_team:     'टीम',
    nav_csr:      'CSR',
    nav_volunteer:'स्वयंसेवक',
    nav_donate:   'दान करें',

    // Hero
    hero_tag:     'पंजीकृत NGO · 80G कर छूट · स्थापना जुलाई 2026',
    hero_title1:  'अवसर',
    hero_title2:  'निर्माण।',
    hero_title3:  'सशक्त समुदाय।',
    hero_subtitle:'जेपीआरडी फाउंडेशन पूर्वी उत्तर प्रदेश में जमीनी स्तर पर काम करता है — शिक्षा, स्वास्थ्य और आजीविका कार्यक्रमों के माध्यम से युवाओं, महिलाओं और ग्रामीण परिवारों को सशक्त बनाता है।',
    hero_cta1:    'हमारा प्रभाव देखें',
    hero_cta2:    'हमारे साथ जुड़ें',

    // About
    about_tag:    'हमारी कहानी',
    about_title:  'उद्देश्य पर बनी नींव',
    about_desc:   'जेपीआरडी फाउंडेशन की स्थापना जुलाई 2026 में एकल मिशन के साथ हुई — पूर्वी उत्तर प्रदेश में शिक्षा, स्वास्थ्य और आजीविका में टिकाऊ मार्ग बनाकर विकास की खाई को पाटना।',

    // Impact
    impact_tag:   'हमारी पहुँच',
    impact_title: 'जीवन बदलते हैं, मापनीय रूप से।',
    impact_1_num: '11,350+',
    impact_1_lbl: 'लाभार्थी',
    impact_2_num: '6',
    impact_2_lbl: 'जिले',
    impact_3_num: '438+',
    impact_3_lbl: 'सक्रिय स्वयंसेवक',
    impact_4_num: '80G',
    impact_4_lbl: 'कर-छूट दान',

    // Where We Work
    wwwork_tag:   'हमारी भौगोलिक पहुँच',
    wwwork_title: 'हम कहाँ काम करते हैं',
    wwwork_sub:   'पूर्वी उत्तर प्रदेश के 6 जिलों में सक्रिय — ग्रामीण समुदायों को अवसरों से जोड़ते हैं।',

    // Events
    events_title: 'मिलकर, सक्रिय।',
    events_sub:   'हमारी आगामी पहलों, कार्यशालाओं और सामुदायिक गतिविधियों में हमारे साथ जुड़ें।',

    // Footer / CTA
    footer_rights:'सर्वाधिकार सुरक्षित।',
    cta_donate:   'अभी दान करें',
    cta_volunteer:'स्वयंसेवक बनें',
  },
};

const LanguageContext = createContext({
  lang: 'en',
  t: (key) => key,
  toggleLang: () => {},
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const stored = localStorage.getItem('jprd_lang') || 'en';
    setLang(stored);
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('jprd_lang', next);
  };

  const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
