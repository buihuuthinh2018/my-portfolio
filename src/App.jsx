import { motion } from 'framer-motion';
import {
  ArrowDown,
  Briefcase,
  Calendar,
  Code,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';

const skills = [
  {
    title: 'Frontend Development',
    description: 'Good HTML, CSS, JS. Strong expertise in React, NextJS, and Angular for building responsive web applications.',
    icon: Code,
    accent: 'text-cyan-300',
  },
  {
    title: 'Tools & Methodology',
    description: 'Proficient with Version Control (Github, Gitlab), Jira, Jenkins, Argo, and Agile Scrum methodology.',
    icon: Briefcase,
    accent: 'text-blue-300',
  },
  {
    title: 'Soft Skills',
    description: 'Excellent teamwork, ability to work with AI Agents, and good English comprehension (Read & Write).',
    icon: User,
    accent: 'text-violet-300',
  },
  {
    title: 'Other Relative Skills',
    description: 'Python (Crawler, Vision, Data), NodeJS, MongoDB, Firebase Realtime/Store, Google Cloud, Mobile Android App Publish, MySQL, PostgreSQL, OAuth platform, Facebook Graph, and Responsive/PWA App.',
    icon: Code,
    accent: 'text-emerald-300',
  },
];

const experiences = [
  {
    company: 'GALAXY TECHNOLOGY SERVICES',
    period: '07/2026 - PRESENT',
    role: 'Full-stack Developer',
    teamSize: 3,
    details: [
      'Develop product interfaces with ReactJS',
      'Use AI tools to improve product development efficiency',
      'Build a data crawling system to aggregate and manage partner product data',
      'Integrate AI vision tools and models such as GPT, Gemini, and Gemma 4 to analyze and evaluate data',
      'Manage large-scale, complex workflows and datasets',
    ],
  },
  {
    company: 'PKTEAM',
    period: '09/2025 - 06/2026',
    role: 'Frontend Developer',
    teamSize: 4,
    details: [
      'Develop UI for Website (React, NextJS)',
      'Use AI to increase performance working',
      'Work with Real-time system (gameplay, event system...)',
      'Support for build function at Backend, Database... for some task (Backend Python, NodeJS)',
      'Support testing software (manual testing)',
      'Manage time-line for team, personal to ensure timely release',
      'Design system for base a new project to end user',
    ],
  },
  {
    company: 'DXC TECHNOLOGY VIETNAM',
    period: '6/2023 - 6/2025',
    role: 'Frontend Developer',
    teamSize: 5,
    details: [
      'Develop UI base on Design',
      'Use HTML, SCSS, Angular framework',
      'Sometime work with Elasticsearch',
      'Work with Backend team to integrate API service, data',
      'Work on Jira platform, Github',
      'Hybrid working',
      'Jasper TIBCO for create PDF',
    ],
  },
  {
    company: 'FREELANCER JOB',
    period: '12/2022 - 3/2024',
    role: 'React App',
    teamSize: 1,
    details: [
      'Use React, NextJS to build UI base on Figma Design',
      'Work with API of Backend Team',
      'This project is AI Audio Project',
      'Tailwind CSS',
    ],
    code: true,
  },
  {
    company: 'DXC TECHNOLOGY VIETNAM',
    period: '9/2022 - 5/2023',
    role: 'Java/Manual Testing',
    teamSize: 3,
    details: [
      'Support Manual Testing',
      'Integrate Embedded Service',
      'Create adaptor service',
      'JOLTtransform',
    ],
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function SectionHeading({ icon: Icon, children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={reveal}
      className="mb-10 flex items-center gap-4"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
        <Icon size={21} />
      </span>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{children}</h2>
      <span className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-white/15 to-transparent sm:block" />
    </motion.div>
  );
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06080f] text-slate-200 selection:bg-cyan-300 selection:text-slate-950">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-14rem] top-[28rem] h-[36rem] w-[36rem] rounded-full bg-violet-500/10 blur-[140px]" />
        <div className="site-grid absolute inset-0 opacity-40" />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#0a0d16]/80 px-5 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl md:px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">BT</span>
            <span className="font-semibold tracking-tight text-white">Bui Huu Thinh.</span>
          </a>
          <div className="hidden items-center gap-1 text-sm text-slate-400 lg:flex">
            {[
              ['About', '#about'],
              ['Skills', '#skills'],
              ['Experience', '#experience'],
              ['Personal Develop', '#personal-develop'],
              ['Education', '#education'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-xl px-4 py-2 transition hover:bg-white/5 hover:text-white">
                {label}
              </a>
            ))}
          </div>
          <a href="#contact" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10">
            Contact Me
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-16 px-6 pb-20 pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28 lg:pt-32">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={reveal} className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              Software Engineer (Middle)
            </motion.div>
            <motion.h1 variants={reveal} className="max-w-3xl text-6xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-7xl lg:text-[6.4rem]">
              Hi, I&apos;m <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text pb-3 text-transparent">Bùi Hữu Thịnh</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
              Currently, I specialize in React, Angular and related ecosystems. I love building responsive, performant, and aesthetic web applications.
            </motion.p>
            <motion.div variants={reveal} className="mt-9 flex flex-wrap gap-3">
              <a href="#contact" className="group flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_16px_50px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-200">
                <Mail size={18} /> Contact Me
              </a>
              <a href="#experience" className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]">
                <Briefcase size={18} /> View Work <ArrowDown size={16} className="transition group-hover:translate-y-0.5" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-sm lg:max-w-md"
          >
            <div className="relative">
              <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 to-violet-500/15" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 p-2 shadow-2xl shadow-cyan-950/40">
                <img
                  src={`${import.meta.env.BASE_URL}avatar.png`}
                  alt="Bùi Hữu Thịnh"
                  className="h-full w-full rounded-[1.55rem] object-cover transition duration-700 hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-x-2 bottom-2 h-1/3 rounded-b-[1.55rem] bg-gradient-to-t from-[#070a12]/65 to-transparent" />
              </div>
            </div>
          </motion.div>
        </section>

        <section id="about" className="scroll-mt-28 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading icon={User}>About Me</SectionHeading>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={reveal}
              className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="p-8 md:p-12 lg:p-14">
                <p className="text-xl leading-9 text-slate-300">
                  I&apos;m a passionate Frontend Developer with a strong foundation in modern web technologies. My journey in software engineering has been driven by a desire to create seamless user experiences and robust web applications.
                </p>
                <p className="mt-6 leading-8 text-slate-400">
                  With a background in Computer Engineering, I approach problems with both an engineering mindset and a focus on design and usability.
                </p>
              </div>

              <div id="contact" className="border-t border-white/10 bg-white/[0.025] p-8 md:p-12 lg:border-l lg:border-t-0 lg:p-14">
                <h3 className="mb-7 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Personal Details</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    [Calendar, 'Birth Date', '25/08/2000 (Male)'],
                    [Phone, 'Phone', '+84328338985'],
                    [Mail, 'Email', 'buihuuthinh2018@gmail.com'],
                    [MapPin, 'Location', 'Ho Chi Minh City'],
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300"><Icon size={18} /></span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                        <p className="mt-1 break-words font-medium text-slate-200">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-28 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading icon={Code}>Skills & Expertise</SectionHeading>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid gap-5 md:grid-cols-2">
              {skills.map(({ title, description, icon: Icon, accent }, index) => (
                <motion.article key={title} variants={reveal} className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.055]">
                  <span className="absolute right-7 top-5 text-6xl font-black tracking-tighter text-white/[0.025]">0{index + 1}</span>
                  <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${accent}`}><Icon size={23} /></div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-400">{description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-28 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading icon={Briefcase}>Professional Experience</SectionHeading>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="relative space-y-5 before:absolute before:bottom-8 before:left-[1.2rem] before:top-8 before:w-px before:bg-gradient-to-b before:from-cyan-300/50 before:via-white/10 before:to-transparent md:before:left-[12.95rem]">
              {experiences.map(({ company, period, role, teamSize, details, code }, index) => {
                const TimelineIcon = code ? Code : Briefcase;
                return (
                  <motion.article key={`${company}-${period}`} variants={reveal} className="relative grid gap-5 pl-14 md:grid-cols-[11rem_1fr] md:gap-10 md:pl-0">
                    <div className="pt-7 md:text-right">
                      <span className="inline-flex rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-semibold tracking-wide text-cyan-300">{period}</span>
                    </div>
                    <div className="absolute left-0 top-7 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#101521] text-cyan-300 shadow-xl md:left-[11.75rem]">
                      <TimelineIcon size={17} />
                    </div>
                    <div className={`rounded-[1.75rem] border p-7 transition duration-300 md:p-9 ${index === 0 ? 'border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.08] to-white/[0.025]' : 'border-white/10 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.05]'}`}>
                      <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{company}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h4 className="font-medium text-cyan-200/80">{role}</h4>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">Team size: {teamSize}</span>
                      </div>
                      <ul className="mt-6 grid gap-3 text-[15px] leading-6 text-slate-400 lg:grid-cols-2 lg:gap-x-10">
                        {details.map((detail) => (
                          <li key={detail} className="relative pl-5 before:absolute before:left-0 before:top-[0.65rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-300/70">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section id="personal-develop" className="scroll-mt-28 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading icon={Sparkles}>Personal Develop</SectionHeading>
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={reveal}
              className="relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.04] to-amber-300/[0.06] p-8 shadow-2xl shadow-violet-950/20 md:p-12"
            >
              <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-violet-500/15 blur-[100px]" />
              <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_17rem] lg:gap-16">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">Final Testing — Coming Soon on Google Play</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Full-stack · Team size: 1</span>
                  </div>
                  <h3 className="text-4xl font-semibold tracking-[-0.045em] text-white md:text-5xl">Tarot Together</h3>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                    A full-stack Flutter Android experience for daily Tarot reflection, combining a complete 78-card library with personalized AI readings, journaling, discovery progress, and a mindful social community.
                  </p>
                  <ul className="mt-8 grid gap-4 text-[15px] leading-7 text-slate-400 md:grid-cols-2 md:gap-x-10">
                    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-300">Daily card draws, animated 3D flips, and upright or reversed meanings for all 78 Tarot cards</li>
                    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-300">Gemini-powered interpretations, reading history, personal journal, and achievement tracking</li>
                    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-300">Firebase authentication, Firestore synchronization, push notifications, and realtime social features</li>
                    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-300">Cloud Run and Node.js API, rewarded ads, in-app purchases, and Vietnamese/English localization</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {['Flutter', 'Firebase', 'Cloud Run', 'Node.js', 'Gemini'].map((technology) => (
                      <span key={technology} className="rounded-lg border border-white/10 bg-black/15 px-3 py-1.5 text-xs font-medium text-slate-300">{technology}</span>
                    ))}
                  </div>
                </div>

                <div className="mx-auto w-full max-w-[17rem]">
                  <div className="relative">
                    <div className="absolute -inset-4 rotate-6 rounded-[2.4rem] border border-amber-300/20 bg-amber-300/[0.06]" />
                    <img
                      src={`${import.meta.env.BASE_URL}tarot-together-icon.png`}
                      alt="Tarot Together"
                      className="relative aspect-square w-full rounded-[2rem] border border-white/15 object-cover shadow-2xl shadow-violet-950/50"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        <section id="education" className="scroll-mt-28 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={reveal} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-cyan-300/[0.035] p-8 md:p-12">
              <GraduationCap className="absolute -bottom-10 -right-8 text-white/[0.025]" size={220} />
              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-start">
                <div>
                  <h3 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">Ho Chi Minh City University of Technology and Education</h3>
                  <h4 className="mt-4 text-lg font-medium text-cyan-200/80">Major: Computer Engineering</h4>
                </div>
                <span className="w-fit shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-sm font-semibold text-cyan-300">8/2018 - 8/2022</span>
              </div>
              <p className="relative z-10 mt-8 max-w-4xl leading-8 text-slate-400">
                I have learned about basic programming, networking, electronic circuits, microchips, IoT, and AI. Beside that, I also learned about how to work in teams, analyze problems, and develop solutions.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto mt-12 max-w-6xl border-t border-white/10 px-6 py-10 text-center">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Bùi Hữu Thịnh. Designed with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
