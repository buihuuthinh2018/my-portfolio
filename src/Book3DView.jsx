import { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, GraduationCap, Mail, MapPin, Phone, X } from 'lucide-react';
import ThreeBookScene from './ThreeBookScene';
import PhysicalBook from './PhysicalBook';
import './book-reader.css';
import './book-reader-details.css';
import './book-mobile.css';
import './physical-book.css';

const chapters = [
  { title: 'Welcome' },
  { title: 'About Me' },
  { title: 'Skills & Expertise' },
  { title: 'Experience · Galaxy' },
  { title: 'Experience · PKTEAM' },
  { title: 'Experience · DXC Angular' },
  { title: 'Experience · Freelancer' },
  { title: 'Experience · DXC Java' },
  { title: 'Personal Develop' },
  { title: 'Education' },
];
const number = (index) => String(index + 1).padStart(2, '0');

function Detail({ icon: Icon, label, value }) {
  return <div className="leaf-detail"><Icon size={19} /><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function SkillCard({ skill }) {
  const Icon = skill.icon;
  return <article className="leaf-skill"><Icon size={21} /><h3>{skill.title}</h3><p>{skill.description}</p></article>;
}

function experienceTabLabel({ company, role }) {
  if (company === 'GALAXY TECHNOLOGY SERVICES') return 'Galaxy Technology Services';
  if (company === 'DXC TECHNOLOGY VIETNAM') return role.includes('Java') ? 'DXC · Java' : 'DXC · Angular';
  return company;
}

function Overview({ side, experiences }) {
  if (side === 'left') return <div className="editorial-overview">
    <div className="editorial-profile">
      <img src={`${import.meta.env.BASE_URL}avatar.png`} alt="Bùi Hữu Thịnh" />
      <div><span className="editorial-kicker">Hello, I&apos;m</span><h1>Bùi Hữu Thịnh</h1><strong>Software Engineer (Middle)</strong><p>Building responsive, performant, and aesthetic web applications.</p></div>
    </div>
    <section className="editorial-section"><h2><span>01</span> About Me</h2><p>I&apos;m a passionate Frontend Developer with a strong foundation in modern web technologies. With a background in Computer Engineering, I approach problems with both an engineering mindset and a focus on design and usability.</p></section>
    <section className="editorial-section"><h2><span>02</span> Skills &amp; Expertise</h2>
      <div className="editorial-skill"><span>Frontend</span><b>React · NextJS · Angular</b></div>
      <div className="editorial-skill"><span>Development</span><b>HTML · CSS · JavaScript</b></div>
      <div className="editorial-skill"><span>Data &amp; AI</span><b>Python · Vision · Crawler</b></div>
      <div className="editorial-skill"><span>Mobile &amp; Cloud</span><b>Android · Firebase · Google Cloud</b></div>
      <div className="editorial-tags"><span>GitHub</span><span>GitLab</span><span>Jenkins</span><span>Argo</span><span>Jira</span><span>Scrum</span></div>
    </section>
    <p className="editorial-quote">“I love building responsive, performant, and aesthetic web applications.”</p>
  </div>;

  return <div className="editorial-overview editorial-overview-right">
    <section className="editorial-section"><h2><span>03</span> Work Experience</h2><div className="editorial-timeline">{experiences.map((job) => <div className="editorial-job" key={`${job.company}-${job.period}`}><time>{job.period}</time><strong>{job.role}</strong><span>{job.company} · Team size: {job.teamSize}</span><p>{job.details[0]}</p></div>)}</div></section>
    <section className="editorial-section"><h2><span>04</span> Education</h2><div className="editorial-education"><strong>Computer Engineering</strong><span>Ho Chi Minh City University of Technology and Education</span><time>08/2018 – 08/2022</time></div></section>
    <section className="editorial-section editorial-contact"><h2><span>05</span> Contact</h2><div><a href="mailto:buihuuthinh2018@gmail.com">buihuuthinh2018@gmail.com</a><a href="tel:+84328338985">+84328338985</a><span>Ho Chi Minh City</span></div></section>
  </div>;
}

function ChapterContent({ chapter, side, skills, experiences, onSelectExperience, interactive = true }) {
  const selectedExperience = chapter - 3;
  const job = experiences[selectedExperience];
  if (chapter === 0) return <Overview side={side} experiences={experiences} />;

  if (chapter === 1) return side === 'left' ? <>
    <h2>About Me</h2>
    <p>I&apos;m a passionate Frontend Developer with a strong foundation in modern web technologies. My journey in software engineering has been driven by a desire to create seamless user experiences and robust web applications.</p>
    <p>With a background in Computer Engineering, I approach problems with both an engineering mindset and a focus on design and usability.</p>
  </> : <>
    <h2>Personal Details</h2>
    <div className="leaf-details">
      <Detail icon={Calendar} label="Birth Date" value="25/08/2000 (Male)" />
      <Detail icon={Phone} label="Phone" value="+84328338985" />
      <Detail icon={Mail} label="Email" value="buihuuthinh2018@gmail.com" />
      <Detail icon={MapPin} label="Location" value="Ho Chi Minh City" />
    </div>
  </>;

  if (chapter === 2) return <>
    {side === 'left' && <h2>Skills &amp; Expertise</h2>}
    <div className="leaf-skills">{skills.slice(side === 'left' ? 0 : 2, side === 'left' ? 2 : 4).map(skill => <SkillCard key={skill.title} skill={skill} />)}</div>
  </>;

  if (chapter >= 3 && chapter <= 7) return side === 'left' ? <>
    <h2>Professional Experience</h2>
    <nav className="leaf-jobs" aria-label="Select experience">
      {experiences.map((experience, index) => <button
        key={`${experience.company}-${experience.period}`}
        type="button" disabled={!interactive}
        aria-pressed={selectedExperience === index}
        aria-label={`${experience.company}, ${experience.role}, ${experience.period}`}
        onClick={() => onSelectExperience(index)}
      ><strong>{experienceTabLabel(experience)}</strong><span>{experience.period}</span></button>)}
    </nav>
  </> : <article className="leaf-job-detail" aria-live="polite">
    <p className="leaf-eyebrow">{job.period}</p>
    <h2>{job.company}</h2>
    <div className="leaf-job-meta"><strong>{job.role}</strong><span>Team size: {job.teamSize}</span></div>
    <ul>{job.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
  </article>;

  if (chapter === 8) return side === 'left' ? <>
    <h2>Personal Develop</h2>
    <div className="leaf-project-heading"><img src={`${import.meta.env.BASE_URL}tarot-together-icon.png`} alt="Tarot Together" /><div><h3>Tarot Together</h3><p>Full-stack · Team size: 1</p></div></div>
    <p className="leaf-status">Final Testing — Coming Soon on Google Play</p>
    <p>A full-stack Flutter Android experience for daily Tarot reflection, combining a complete 78-card library with personalized AI readings, journaling, discovery progress, and a mindful social community.</p>
  </> : <>
    <h2>Tarot Together</h2>
    <ul className="leaf-feature-list">
      <li>Daily card draws, animated 3D flips, and upright or reversed meanings for all 78 Tarot cards</li>
      <li>Gemini-powered interpretations, reading history, personal journal, and achievement tracking</li>
      <li>Firebase authentication, Firestore synchronization, push notifications, and realtime social features</li>
      <li>Cloud Run and Node.js API, rewarded ads, in-app purchases, and Vietnamese/English localization</li>
    </ul>
  </>;

  return side === 'left' ? <>
    <h2>Education</h2>
    <div className="leaf-education"><GraduationCap size={28} /><h3>Ho Chi Minh City University of Technology and Education</h3><p>8/2018 - 8/2022</p><strong>Major: Computer Engineering</strong></div>
  </> : <>
    <h2>Computer Engineering</h2>
    <p>I have learned about basic programming, networking, electronic circuits, microchips, IoT, and AI. Beside that, I also learned about how to work in teams, analyze problems, and develop solutions.</p>
  </>;
}

function Leaf({ chapter, side, skills, experiences, onSelectExperience, interactive = true }) {
  return <div className={`leaf-content leaf-${side}`}>
    <ChapterContent chapter={chapter} side={side} skills={skills} experiences={experiences} onSelectExperience={onSelectExperience} interactive={interactive} />
  </div>;
}

function Book3DView({ onExit, skills, experiences }) {
  const [chapter, setChapter] = useState(0);
  const [flip, setFlip] = useState(null);
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 721px)').matches);
  const [physicalReady, setPhysicalReady] = useState(false);
  const flipLock = useRef(false);
  const timers = useRef([]);
  const pointerStart = useRef(null);
  const spreadRef = useRef(null);
  const sourcesRef = useRef(null);
  const bookApiRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const pendingTimers = timers.current;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      pendingTimers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 721px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    spreadRef.current?.querySelectorAll('.leaf-content, .book-mobile-page').forEach((element) => { element.scrollTop = 0; });
    const strip = spreadRef.current?.querySelector('.mobile-experience-strip');
    const active = strip?.querySelector('[aria-pressed="true"]');
    if (active) {
      const stripBounds = strip.getBoundingClientRect();
      const activeBounds = active.getBoundingClientRect();
      strip.scrollLeft += activeBounds.left - stripBounds.left - (strip.clientWidth - active.clientWidth) / 2;
    }
  }, [chapter]);

  const turnTo = useCallback(async (next) => {
    if (flipLock.current || next === chapter || next < 0 || next >= chapters.length) return;
    const direction = next > chapter ? 1 : -1;
    flipLock.current = true;
    if (desktop && bookApiRef.current) {
      try { await bookApiRef.current.prepare(next); }
      catch { /* Keep the CSS book available if a texture cannot be prepared. */ }
    }
    setFlip({ from: chapter, to: next, direction });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(window.setTimeout(() => {
      setChapter(next);
    }, reduced ? 30 : 340));
    timers.current.push(window.setTimeout(() => { setFlip(null); flipLock.current = false; }, reduced ? 70 : 700));
  }, [chapter, desktop]);
  const turn = useCallback((direction) => turnTo(chapter + direction), [chapter, turnTo]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onExit();
      if (event.key === 'ArrowRight') turn(1);
      if (event.key === 'ArrowLeft') turn(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit, turn]);

  const handlePointerDown = (event) => {
    if (event.target.closest('button')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerStart.current = { x: event.clientX, eligible: event.pointerType !== 'mouse' || event.clientX < bounds.left + 110 || event.clientX > bounds.right - 110 };
  };
  const handlePointerUp = (event) => {
    if (!pointerStart.current) return;
    const { x, eligible } = pointerStart.current;
    pointerStart.current = null;
    if (eligible && Math.abs(event.clientX - x) > 70) turn(event.clientX < x ? 1 : -1);
  };

  const leafProps = { skills, experiences, onSelectExperience: (index) => turnTo(3 + index) };
  return <div className="book-world">
    <ThreeBookScene page={chapter} />
    <div className="book-world-shade" aria-hidden="true" />
    <header className="book-world-header"><span className="book-monogram">BT.</span><div><span>Portfolio / CV</span><strong>Bùi Hữu Thịnh</strong></div></header>
    <main className="book-reader" aria-label="3D portfolio book">
      <div className={`book-shell${desktop && physicalReady ? ' is-physical' : ''}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }}>
        {desktop && <PhysicalBook page={chapter} flip={flip} sourcesRef={sourcesRef} apiRef={bookApiRef} onReady={() => setPhysicalReady(true)} onSelectExperience={(index) => turnTo(3 + index)} onTurn={turn} />}
        <div className="book-spread" ref={spreadRef}>
          <section className="book-page book-page-left"><Leaf chapter={chapter} side="left" {...leafProps} /></section>
          <section className="book-page book-page-right"><Leaf chapter={chapter} side="right" {...leafProps} /></section>
          <div className="book-spine" aria-hidden="true" />
          {flip && <div className={`turning-leaf ${flip.direction === 1 ? 'turning-next' : 'turning-previous'}`} aria-hidden="true">
            <div className="turning-face turning-front"><Leaf chapter={flip.from} side={flip.direction === 1 ? 'right' : 'left'} {...leafProps} interactive={false} /></div>
            <div className="turning-face turning-back"><Leaf chapter={flip.to} side={flip.direction === 1 ? 'left' : 'right'} {...leafProps} interactive={false} /></div>
          </div>}
          <div className={`book-mobile-page${chapter >= 3 && chapter <= 7 ? ' is-experience' : ''}`} aria-live="polite">
            <div className="mobile-chapter-header"><span>THE BOOK OF THINH · {number(chapter)} / {number(chapters.length - 1)}</span><strong>{chapter >= 3 && chapter <= 7 ? 'Professional Experience' : chapters[chapter].title}</strong></div>
            {chapter >= 3 && chapter <= 7 && <nav className="mobile-experience-strip" aria-label="Choose company">{experiences.map((experience, index) => <button key={`${experience.company}-${experience.period}`} type="button" aria-pressed={chapter === index + 3} disabled={Boolean(flip)} onClick={() => turnTo(index + 3)}>{chapters[index + 3].title.replace('Experience · ', '')}</button>)}</nav>}
            <Leaf chapter={chapter} side="left" {...leafProps} /><Leaf chapter={chapter} side="right" {...leafProps} />
          </div>
        </div>
      </div>
      <nav className="book-navigation" aria-label="Book pages">
        <button className="book-corner book-corner-left" type="button" onClick={() => turn(-1)} disabled={chapter === 0 || Boolean(flip)} aria-label="Previous page" title="Turn to previous chapter"><ChevronLeft size={20} /><span>Previous</span></button>
        <span aria-live="polite">{number(chapter)} / {number(chapters.length - 1)} <i>—</i> <span className="nav-chapter-label">{chapters[chapter].title}</span></span>
        <button className="book-corner book-corner-right" type="button" onClick={() => turn(1)} disabled={chapter === chapters.length - 1 || Boolean(flip)} aria-label="Next page" title="Turn to next chapter"><span>Next</span><ChevronRight size={20} /></button>
      </nav>
    </main>
    <button type="button" className="book-exit-button" onClick={onExit}><X size={18} /> Back to 2D</button>
    {desktop && physicalReady && <div className="book-accessible-content" aria-live="polite">
      <ChapterContent chapter={chapter} side="left" skills={skills} experiences={experiences} onSelectExperience={() => {}} interactive={false} />
      <ChapterContent chapter={chapter} side="right" skills={skills} experiences={experiences} onSelectExperience={() => {}} interactive={false} />
    </div>}
    {desktop && <div ref={sourcesRef} className="book-texture-sources" aria-hidden="true" inert>
      {chapters.map((entry, index) => ['left', 'right'].map((side) => <div className={`book-texture-page book-page book-page-${side}`} data-page={index} data-side={side} key={`${entry.title}-${side}`}><Leaf chapter={index} side={side} skills={skills} experiences={experiences} onSelectExperience={() => {}} interactive={false} /></div>))}
    </div>}
  </div>;
}

export default Book3DView;
