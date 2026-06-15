import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, User, Briefcase, GraduationCap, Code, ExternalLink, Calendar } from 'lucide-react';

function App() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-darker selection:bg-primary selection:text-white pb-20">
      
      {/* HEADER / NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-darker/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Bui Huu Thinh.
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
            <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
            <a href="#education" className="hover:text-primary transition-colors">Education</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col-reverse md:flex-row items-center gap-12">
        <motion.div 
          className="flex-1 space-y-6 text-center md:text-left"
          initial="hidden" animate="visible" variants={fadeIn}
        >
          <h2 className="text-primary font-medium tracking-wider text-sm uppercase">Software Engineer (Junior)</h2>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100">
            Hi, I'm <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Bùi Hữu Thịnh</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed mx-auto md:mx-0">
            Currently, I specialize in React, Angular and related ecosystems. I love building responsive, performant, and aesthetic web applications.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <a href="#contact" className="px-6 py-3 bg-primary hover:bg-sky-400 text-white rounded-full font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Mail size={18} /> Contact Me
            </a>
            <a href="#experience" className="px-6 py-3 bg-card hover:bg-slate-700 text-slate-200 rounded-full font-medium transition-all border border-slate-700 flex items-center gap-2">
              <Briefcase size={18} /> View Work
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-primary to-purple-500">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden border-4 border-darker relative group">
              <img 
                src="/avatar.png" 
                alt="Bùi Hữu Thịnh" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  // Fallback in case image is missing
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-card">
                <User size={80} className="text-slate-600" />
              </div>
            </div>
            <div className="absolute -z-10 w-full h-full bg-primary/20 blur-3xl rounded-full top-0 left-0"></div>
          </div>
        </motion.div>
      </section>

      {/* ABOUT & CONTACT INFO */}
      <section id="about" className="max-w-5xl mx-auto px-6 py-16">
        <motion.div 
          className="bg-card/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 md:p-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-2xl font-bold text-slate-100 mb-6">
                <User className="text-primary" /> About Me
              </div>
              <p className="text-slate-400 leading-relaxed">
                I'm a passionate Frontend Developer with a strong foundation in modern web technologies. My journey in software engineering has been driven by a desire to create seamless user experiences and robust web applications.
              </p>
              <p className="text-slate-400 leading-relaxed">
                With a background in Computer Engineering, I approach problems with both an engineering mindset and a focus on design and usability.
              </p>
            </div>
            
            <div id="contact" className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2">Personal Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary"><Calendar size={18} /></div>
                  <div><p className="text-xs text-slate-500 uppercase">Birth Date</p><p className="font-medium text-slate-300">25/08/2000 (Male)</p></div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary"><Phone size={18} /></div>
                  <div><p className="text-xs text-slate-500 uppercase">Phone</p><p className="font-medium text-slate-300">0768 801 289</p></div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary"><Mail size={18} /></div>
                  <div><p className="text-xs text-slate-500 uppercase">Email</p><p className="font-medium text-slate-300">buihuuthinh2018@gmail.com</p></div>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary"><MapPin size={18} /></div>
                  <div><p className="text-xs text-slate-500 uppercase">Location</p><p className="font-medium text-slate-300">Ho Chi Minh City</p></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex items-center gap-3 text-3xl font-bold text-slate-100 mb-10">
          <Code className="text-primary" /> Skills & Expertise
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {/* Skill Cards */}
          <motion.div variants={fadeIn} className="bg-card border border-slate-800 rounded-xl p-6 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform"><Code size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Frontend Development</h3>
            <p className="text-slate-400 text-sm">Good HTML, CSS, JS. Strong expertise in React, NextJS, and Angular for building responsive web applications.</p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-card border border-slate-800 rounded-xl p-6 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Tools & Methodology</h3>
            <p className="text-slate-400 text-sm">Proficient with Version Control (Github), Jira, and Agile Scrum methodology.</p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-card border border-slate-800 rounded-xl p-6 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform"><User size={24} /></div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Soft Skills</h3>
            <p className="text-slate-400 text-sm">Excellent teamwork, ability to work with AI Agents, and good English comprehension (Read & Write).</p>
          </motion.div>
        </motion.div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex items-center gap-3 text-3xl font-bold text-slate-100 mb-10">
          <Briefcase className="text-primary" /> Professional Experience
        </motion.div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          
          {/* PKTEAM */}
          <motion.div 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-card text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Briefcase size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-slate-800 shadow-xl hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2 flex-col sm:flex-row sm:items-center">
                <h3 className="font-bold text-slate-200 text-xl">PKTEAM</h3>
                <span className="text-primary font-medium text-sm bg-primary/10 px-3 py-1 rounded-full mt-2 sm:mt-0">11/2025 - TODAY</span>
              </div>
              <h4 className="text-slate-400 font-medium mb-4">Frontend Developer</h4>
              <ul className="space-y-2 text-sm text-slate-400 list-disc list-outside ml-4">
                <li>Develop UI for Website (React, NextJS)</li>
                <li>Use AI to increase performance working</li>
                <li>Work with Real-time system (gameplay, event system...)</li>
                <li>Support for build function at Backend, Database... for some task (Backend Python, NodeJS)</li>
                <li>Support testing software (manual testing)</li>
                <li>Manage time-line for team, personal to ensure timely release</li>
                <li>Design system for base a new project to end user</li>
              </ul>
            </div>
          </motion.div>

          {/* DXC FRONTEND */}
          <motion.div 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-card text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Briefcase size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-slate-800 shadow-xl hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2 flex-col sm:flex-row sm:items-center">
                <h3 className="font-bold text-slate-200 text-xl">DXC TECHNOLOGY VIETNAM</h3>
                <span className="text-primary font-medium text-sm bg-primary/10 px-3 py-1 rounded-full mt-2 sm:mt-0">6/2023 - 6/2025</span>
              </div>
              <h4 className="text-slate-400 font-medium mb-4">Frontend Developer</h4>
              <ul className="space-y-2 text-sm text-slate-400 list-disc list-outside ml-4">
                <li>Develop UI base on Design</li>
                <li>Use HTML, SCSS, Angular framework</li>
                <li>Sometime work with Elasticsearch</li>
                <li>Work with Backend team to integrate API service, data</li>
                <li>Work on Jira platform, Github</li>
                <li>Hybrid working</li>
                <li>Jasper TIBCO for create PDF</li>
              </ul>
            </div>
          </motion.div>

          {/* FREELANCER */}
          <motion.div 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-card text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Code size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-slate-800 shadow-xl hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2 flex-col sm:flex-row sm:items-center">
                <h3 className="font-bold text-slate-200 text-xl">FREELANCER JOB</h3>
                <span className="text-primary font-medium text-sm bg-primary/10 px-3 py-1 rounded-full mt-2 sm:mt-0">12/2022 - 3/2024</span>
              </div>
              <h4 className="text-slate-400 font-medium mb-4">React App</h4>
              <ul className="space-y-2 text-sm text-slate-400 list-disc list-outside ml-4">
                <li>Use React, NextJS to build UI base on Figma Design</li>
                <li>Work with API of Backend Team</li>
                <li>This project is AI Audio Project</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </motion.div>

          {/* DXC JAVA */}
          <motion.div 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-card text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Briefcase size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-card border border-slate-800 shadow-xl hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2 flex-col sm:flex-row sm:items-center">
                <h3 className="font-bold text-slate-200 text-xl">DXC TECHNOLOGY VIETNAM</h3>
                <span className="text-primary font-medium text-sm bg-primary/10 px-3 py-1 rounded-full mt-2 sm:mt-0">9/2022 - 5/2023</span>
              </div>
              <h4 className="text-slate-400 font-medium mb-4">Java/Manual Testing</h4>
              <ul className="space-y-2 text-sm text-slate-400 list-disc list-outside ml-4">
                <li>Support Manual Testing</li>
                <li>Integrate Embedded Service</li>
                <li>Create adaptor service</li>
                <li>JOLTtransform</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex items-center gap-3 text-3xl font-bold text-slate-100 mb-10">
          <GraduationCap className="text-primary" /> Education
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-card to-slate-800/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-200 leading-tight">Ho Chi Minh City University of<br className="hidden md:block"/> Technology and Education</h3>
              <span className="text-primary font-medium mt-2 md:mt-0 inline-block bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">8/2018 - 8/2022</span>
            </div>
            <h4 className="text-lg text-slate-300 font-medium mb-6">Major: Computer Engineering</h4>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              I have learned about basic programming, networking, electronic circuits, microchips, IoT, and AI. Beside that, I also learned about how to work in teams, analyze problems, and develop solutions.
            </p>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto px-6 pt-20 pb-8 text-center border-t border-slate-800/50 mt-10">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Bùi Hữu Thịnh. Designed with React & Tailwind CSS.
        </p>
      </footer>

    </div>
  );
}

export default App;
