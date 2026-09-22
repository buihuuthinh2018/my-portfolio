import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import ThreeBookScene from './ThreeBookScene';

const pageLabels = ['Welcome', 'About', 'Skills', 'Experience', 'Personal Develop', 'Education'];


function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
      <Icon size={16} className="shrink-0 text-cyan-300" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-200/45">{label}</p>
        <p className="mt-0.5 break-words text-sm text-cyan-50/85">{value}</p>
      </div>
    </div>
  );
}

function ExperienceReader({ experiences }) {
  const [selected, setSelected] = useState(0);
  const { company, period, role, teamSize, details } = experiences[selected];
  return (
    <div>
      <h2 className="hologram-title"><Briefcase size={22} /> Professional Experience</h2>
      <div className="experience-reader">
        <nav className="experience-selector" aria-label="Select experience">
          {experiences.map((experience, index) => (
            <button type="button" key={`${experience.company}-${experience.period}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
              <strong>{experience.company}</strong>
              <span>{experience.role}</span>
              <span>{experience.period}</span>
            </button>
          ))}
        </nav>
        <article className="experience-detail" aria-live="polite">
          <h3>{company}</h3>
          <div className="experience-meta"><strong>{role}</strong><span>Team size: {teamSize}</span><span>{period}</span></div>
          <ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul>
        </article>
      </div>
    </div>
  );
}

function HologramPage({ page, skills, experiences }) {
  if (page === 0) {
    return (
      <div className="flex min-h-full flex-col justify-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Software Engineer (Middle)</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Hi, I&apos;m <span className="block text-cyan-300">Bùi Hữu Thịnh</span></h1>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-cyan-50/65">Currently, I specialize in React, Angular and related ecosystems. I love building responsive, performant, and aesthetic web applications.</p>
      </div>
    );
  }

  if (page === 1) {
    return (
      <div>
        <h2 className="hologram-title"><User size={22} /> About Me</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 leading-7 text-cyan-50/70">
            <p>I&apos;m a passionate Frontend Developer with a strong foundation in modern web technologies. My journey in software engineering has been driven by a desire to create seamless user experiences and robust web applications.</p>
            <p>With a background in Computer Engineering, I approach problems with both an engineering mindset and a focus on design and usability.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <DetailItem icon={Calendar} label="Birth Date" value="25/08/2000 (Male)" />
            <DetailItem icon={Phone} label="Phone" value="+84328338985" />
            <DetailItem icon={Mail} label="Email" value="buihuuthinh2018@gmail.com" />
            <DetailItem icon={MapPin} label="Location" value="Ho Chi Minh City" />
          </div>
        </div>
      </div>
    );
  }

  if (page === 2) {
    return (
      <div>
        <h2 className="hologram-title"><Code size={22} /> Skills & Expertise</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {skills.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-xl border border-cyan-300/10 bg-cyan-300/[0.035] p-4">
              <div className="flex items-center gap-3 text-cyan-200"><Icon size={17} /><h3 className="font-semibold">{title}</h3></div>
              <p className="mt-2 text-sm leading-6 text-cyan-50/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === 3) {
    return <ExperienceReader experiences={experiences} />;
  }

  if (page === 4) {
    return (
      <div>
        <h2 className="hologram-title"><Sparkles size={22} /> Personal Develop</h2>
        <div className="project-reader">
          <div className="project-copy">
            <div className="project-badges flex flex-wrap gap-2 font-semibold">
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-amber-200">Final Testing — Coming Soon on Google Play</span>
              <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 text-cyan-100/70">Full-stack · Team size: 1</span>
            </div>
            <h3 className="project-name font-semibold tracking-tight text-white">Tarot Together</h3>
            <p className="project-summary">A full-stack Flutter Android experience for daily Tarot reflection, combining a complete 78-card library with personalized AI readings, journaling, discovery progress, and a mindful social community.</p>
            <ul className="project-highlights">
              <li>Daily card draws, animated 3D flips, and upright or reversed meanings for all 78 Tarot cards</li>
              <li>Gemini-powered interpretations, reading history, personal journal, and achievement tracking</li>
              <li>Firebase authentication, Firestore synchronization, push notifications, and realtime social features</li>
              <li>Cloud Run and Node.js API, rewarded ads, in-app purchases, and Vietnamese/English localization</li>
            </ul>
          </div>
          <img src={`${import.meta.env.BASE_URL}tarot-together-icon.png`} alt="Tarot Together" className="mx-auto aspect-square w-32 rounded-2xl border border-amber-300/25 shadow-lg shadow-violet-950/60" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="hologram-title"><GraduationCap size={22} /> Education</h2>
      <div className="mt-7 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="max-w-2xl text-2xl font-semibold text-white">Ho Chi Minh City University of Technology and Education</h3>
          <span className="rounded-full border border-cyan-300/15 px-3 py-1.5 text-xs text-cyan-300">8/2018 - 8/2022</span>
        </div>
        <h4 className="mt-3 font-medium text-cyan-200/80">Major: Computer Engineering</h4>
        <p className="mt-5 leading-7 text-cyan-50/60">I have learned about basic programming, networking, electronic circuits, microchips, IoT, and AI. Beside that, I also learned about how to work in teams, analyze problems, and develop solutions.</p>
      </div>
    </div>
  );
}

function Book3DView({ onExit, skills, experiences }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalPages = pageLabels.length;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const goTo = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === page) return;
    setDirection(nextPage > page ? 1 : -1);
    setPage(nextPage);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onExit();
      if (event.key === 'ArrowRight') setPage((current) => {
        const next = Math.min(totalPages - 1, current + 1);
        if (next !== current) setDirection(1);
        return next;
      });
      if (event.key === 'ArrowLeft') setPage((current) => {
        const next = Math.max(0, current - 1);
        if (next !== current) setDirection(-1);
        return next;
      });
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit, totalPages]);

  const pageNumber = useMemo(() => String(page + 1).padStart(2, '0'), [page]);

  return (
    <div className={`book-3d-view reader-layout ${page === 0 ? 'reader-welcome' : 'reader-chapter'} fixed inset-0 z-[100] overflow-hidden bg-[#040711] text-white`}>
      <ThreeBookScene page={page} direction={direction} />
      <div className="book-3d-vignette pointer-events-none absolute inset-0" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-[#06101d]/70 px-4 py-3 backdrop-blur-xl">
          <BookOpen size={20} className="text-cyan-300" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/55">Virtual portfolio</p>
            <p className="text-sm font-semibold text-cyan-50">The Book of Thinh</p>
          </div>
        </div>
        <button type="button" aria-label="Back to 2D" onClick={onExit} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#06101d]/70 px-4 py-3 text-sm text-white/75 backdrop-blur-xl transition hover:border-cyan-300/30 hover:text-cyan-200">
          <X size={17} /> <span className="hidden sm:inline">Back to 2D</span>
        </button>
      </header>

      <aside className="concept-intro">
        <p className="concept-eyebrow">Software Engineer (Middle)</p>
        <h1>Hi, I&apos;m<br /><span>Bùi Hữu<br />Thịnh</span></h1>
        <p className="concept-description">Currently, I specialize in React, Angular and related ecosystems. I love building responsive, performant, and aesthetic web applications.</p>
        <button type="button" className="concept-start" onClick={() => goTo(Math.min(page + 1, totalPages - 1))} disabled={page === totalPages - 1}>Turn the page <ChevronRight size={18} /></button>
        <p className="concept-chapter">{pageNumber} <span>/ 06 — {pageLabels[page]}</span></p>
      </aside>
      <div className="concept-reading">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={page}
            custom={direction}
            initial={{ opacity: 0, y: 24, scale: 0.97, rotateX: direction * 5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98, rotateX: direction * -5 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="book-hologram-panel h-full overflow-y-auto rounded-[1.6rem] border border-cyan-300/20 bg-[#061523]/72 p-5 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8"
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
            <div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/45">
              <span>Holographic record</span>
              <span>{pageNumber} / {String(totalPages).padStart(2, '0')}</span>
            </div>
            <HologramPage page={page} skills={skills} experiences={experiences} />
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20 px-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-cyan-300/15 bg-[#06101d]/80 p-3 shadow-2xl backdrop-blur-xl">
          <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} className="book-control-button" aria-label="Previous page"><ChevronLeft size={20} /></button>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            {pageLabels.map((label, index) => (
              <button key={label} type="button" onClick={() => goTo(index)} className={`group flex items-center gap-2 rounded-xl px-2 py-2 text-xs transition sm:px-3 ${index === page ? 'bg-cyan-300/12 text-cyan-200' : 'text-white/35 hover:text-white/70'}`} aria-label={`Open ${label} page`}>
                <span className={`h-1.5 rounded-full transition-all ${index === page ? 'w-6 bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]' : 'w-1.5 bg-white/25 group-hover:bg-white/50'}`} />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => goTo(page + 1)} disabled={page === totalPages - 1} className="book-control-button" aria-label="Next page"><ChevronRight size={20} /></button>
        </div>
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-cyan-100/25">Use arrow keys to turn pages</p>
      </div>
    </div>
  );
}

export default Book3DView;
