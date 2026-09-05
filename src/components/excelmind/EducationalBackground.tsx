import React from 'react';

/**
 * EducationalBackground
 * A warm, engaging, and student-friendly background that transforms the application
 * into a vibrant, modern digital school environment.
 * 
 * Features:
 * - Soft ambient learning gradients (sky blue, warm amber, growth mint, creativity violet)
 * - Subtle notebook graph/grid watermark
 * - Educational vector illustrations (students reading, collaborating, using laptops)
 * - Floating academic icons (books, pencils, graduation caps, light bulbs, science & math symbols)
 * - Non-intrusive, accessible, responsive across all screen sizes (fixed, -z-10, pointer-events-none)
 */
export const EducationalBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. SOFT AMBIENT GRADIENT MESH */}
      <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-[#0B1229] transition-colors duration-500" />

      {/* Top-Left: Warm Morning Sunlight / Inspiration Amber */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 sm:w-[540px] sm:h-[540px] rounded-full blur-3xl opacity-40 dark:opacity-20 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.7) 0%, rgba(253, 230, 138, 0.4) 45%, transparent 70%)'
        }}
      />

      {/* Top-Right: Focus & Knowledge Sky Blue */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full blur-3xl opacity-45 dark:opacity-25 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(186, 230, 253, 0.7) 0%, rgba(199, 210, 254, 0.4) 50%, transparent 70%)'
        }}
      />

      {/* Mid-Left: Creativity & Exploration Violet */}
      <div 
        className="absolute top-1/3 -left-40 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full blur-3xl opacity-30 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(233, 213, 255, 0.6) 0%, rgba(245, 208, 254, 0.3) 50%, transparent 70%)'
        }}
      />

      {/* Mid-Right & Bottom: Growth & Success Mint/Emerald */}
      <div 
        className="absolute bottom-10 -right-32 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full blur-3xl opacity-35 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.6) 0%, rgba(204, 251, 241, 0.4) 50%, transparent 70%)'
        }}
      />

      {/* Center Ambient Subtle Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(224, 231, 255, 0.5) 0%, transparent 70%)'
        }}
      />

      {/* 2. CLASSROOM NOTEBOOK / GRAPH PAPER TEXTURE */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.045] text-slate-800 dark:text-cyan-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="edu-grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.6" />
          </pattern>
          <pattern id="edu-dots-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.75" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#edu-grid-pattern)" />
      </svg>

      {/* 3. LIGHT EDUCATIONAL VECTOR ILLUSTRATIONS */}
      {/* Left Margin Illustration: Student Reading / Learning Tree */}
      <div className="hidden lg:block absolute left-4 top-1/4 opacity-[0.14] dark:opacity-[0.09] text-indigo-700 dark:text-indigo-300 transform -rotate-3 transition-opacity">
        <svg width="220" height="240" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk & Chair */}
          <path d="M40 180H160M50 180V210M150 180V210M70 140H130V180H70V140Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Student Sitting & Reading */}
          <circle cx="100" cy="85" r="18" stroke="currentColor" strokeWidth="2.5" />
          <path d="M80 140C80 115 88 108 100 108C112 108 120 115 120 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Open Book in Hands */}
          <path d="M100 135L82 125L66 132V155L82 148L100 155L118 148L134 155V132L118 125L100 135Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08"/>
          {/* Knowledge Sparks floating up */}
          <path d="M100 50L103 58L111 61L103 64L100 72L97 64L89 61L97 58L100 50Z" fill="currentColor"/>
          <circle cx="65" cy="70" r="3" fill="currentColor" />
          <circle cx="138" cy="65" r="2.5" fill="currentColor" />
          <path d="M130 95C135 90 145 92 148 98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Right Margin Illustration: Student with Laptop & Idea Lightbulb */}
      <div className="hidden lg:block absolute right-4 top-1/3 opacity-[0.14] dark:opacity-[0.09] text-sky-700 dark:text-cyan-300 transform rotate-3 transition-opacity">
        <svg width="220" height="240" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Study Workspace */}
          <path d="M30 185H170M45 185V215M155 185V215" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Student Head & Body */}
          <circle cx="100" cy="80" r="18" stroke="currentColor" strokeWidth="2.5" />
          <path d="M78 135C78 112 87 105 100 105C113 105 122 112 122 135" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Laptop on Desk */}
          <path d="M75 160L82 142H118L125 160H75Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08"/>
          <path d="M68 160H132" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Lightbulb overhead */}
          <path d="M100 30C93 30 88 35 88 42C88 47 91 50 93 53V57H107V53C109 50 112 47 112 42C112 35 107 30 100 30Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M95 61H105M97 64H103" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="100" y1="22" x2="100" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="82" y1="32" x2="85" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="118" y1="32" x2="115" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* 4. FLOATING EDUCATIONAL ICONS & MOTIFS */}
      
      {/* Icon 1: Graduation Cap (Top Left) */}
      <div 
        className="absolute top-20 left-[8%] opacity-25 dark:opacity-20 text-indigo-600 dark:text-indigo-400 edu-float-slow"
        style={{ animationDelay: '0s' }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      {/* Icon 2: Open Book (Top Right) */}
      <div 
        className="absolute top-24 right-[12%] opacity-25 dark:opacity-20 text-sky-600 dark:text-cyan-400 edu-float-reverse"
        style={{ animationDelay: '1.2s' }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </div>

      {/* Icon 3: Science Molecule / Atom (Upper Right) */}
      <div 
        className="absolute top-44 right-[6%] opacity-20 dark:opacity-15 text-emerald-600 dark:text-emerald-400 edu-float-slow"
        style={{ animationDelay: '2.5s' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
        </svg>
      </div>

      {/* Icon 4: Idea Lightbulb (Upper Mid Left) */}
      <div 
        className="absolute top-64 left-[5%] opacity-25 dark:opacity-20 text-amber-500 dark:text-amber-300 edu-pulse-soft"
        style={{ animationDelay: '0.8s' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2v1M4.22 4.22l.71.71M1 12h1M4.22 19.78l.71-.71M23 12h-1M19.78 4.22l-.71.71M19.78 19.78l-.71-.71"/>
          <path d="M15 14a5 5 0 1 0-6 0c.5 1 1.5 2 1.5 4h3c0-2 1-3 1.5-4z"/>
        </svg>
      </div>

      {/* Icon 5: Classic Pencil & Ruler (Mid Left) */}
      <div 
        className="absolute top-1/2 left-[3%] opacity-20 dark:opacity-15 text-violet-600 dark:text-violet-400 edu-float-slow"
        style={{ animationDelay: '3.4s' }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
      </div>

      {/* Icon 6: Growth & Achievement Chart (Mid Right) */}
      <div 
        className="absolute top-1/2 right-[4%] opacity-25 dark:opacity-20 text-teal-600 dark:text-teal-400 edu-float-reverse"
        style={{ animationDelay: '2.1s' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
          <path d="M3 20h18"/>
          <path d="M6 14l6-10 6 6 4-4" strokeDasharray="1 1"/>
        </svg>
      </div>

      {/* Icon 7: Rocket / Aspiration (Lower Mid Left) */}
      <div 
        className="absolute top-[68%] left-[7%] opacity-20 dark:opacity-15 text-orange-500 dark:text-orange-400 edu-float-slow"
        style={{ animationDelay: '1.7s' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
      </div>

      {/* Icon 8: Math & Geometry Compass (Lower Mid Right) */}
      <div 
        className="absolute top-[72%] right-[8%] opacity-20 dark:opacity-15 text-indigo-500 dark:text-indigo-400 edu-float-reverse"
        style={{ animationDelay: '4s' }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2"/>
          <path d="M12 7L6 21"/>
          <path d="M12 7L18 21"/>
          <path d="M8 15h8"/>
        </svg>
      </div>

      {/* Icon 9: Global Learning / Globe (Bottom Left) */}
      <div 
        className="absolute bottom-16 left-[10%] opacity-20 dark:opacity-15 text-blue-600 dark:text-cyan-400 edu-float-slow"
        style={{ animationDelay: '3.1s' }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>

      {/* Icon 10: Academic Excellence Trophy / Star (Bottom Right) */}
      <div 
        className="absolute bottom-20 right-[12%] opacity-25 dark:opacity-20 text-amber-500 dark:text-amber-300 edu-pulse-soft"
        style={{ animationDelay: '1.9s' }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
          <path d="M6 4h12v5a6 6 0 0 1-12 0V4z"/>
        </svg>
      </div>

      {/* 5. GENTLE ACADEMIC AMBIENT MOTIFS (Pencil tip, math notations, puzzle) */}
      <div className="absolute top-1/4 left-1/3 opacity-15 dark:opacity-10 font-mono text-sm tracking-widest text-slate-700 dark:text-slate-300">
        ∑ (Knowledge + Practice) = Success
      </div>

      <div className="absolute bottom-1/3 right-1/4 opacity-15 dark:opacity-10 font-mono text-sm tracking-widest text-slate-700 dark:text-slate-300">
        E = mc² • Curiosity • Innovation
      </div>

      {/* 6. SUBTLE FOOTER BRAND WATERMARK (Non-intrusive) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-20 dark:opacity-15 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
        <span>Inspire</span>
        <span>•</span>
        <span>Learn</span>
        <span>•</span>
        <span>Excel</span>
      </div>
    </div>
  );
};
