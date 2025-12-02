import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Trash2, ChevronDown, 
  Printer, ZoomIn, ZoomOut, 
  Briefcase, GraduationCap, Code, User, 
  FolderGit2, Mail, Phone, Linkedin, Github, 
  Award, Heart, Palette, RefreshCw, Eye, Edit3 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

/* --- 1. ANIMATION VARIANTS --- */
const listVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
};

/* --- 2. HELPER COMPONENTS --- */
const AnimatedSection = ({ children, isOpen }) => (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
            <div className="pt-2">
                {children}
            </div>
        </motion.div>
      )}
    </AnimatePresence>
);

const SectionHeader = ({ title, icon: Icon, id, activeSection, setActiveSection }) => (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl transition-all shadow-sm group ${activeSection === id ? 'ring-2 ring-[#00B291]/20' : ''}`}
    >
      <div className="flex items-center gap-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-[#00B291] transition-colors">
        <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-[#00B291] text-white' : 'bg-gray-100 dark:bg-gray-800'}`}><Icon className="h-4 w-4" /></div>
        {title}
      </div>
      <motion.div
        animate={{ rotate: activeSection === id ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className={`h-4 w-4 text-gray-400`} />
      </motion.div>
    </motion.button>
);

/* --- 3. TEMPLATES --- */

// 1. MODERN TEMPLATE
const TemplateModern = ({ data, color }) => (
  <div className="h-auto min-h-[297mm] w-full bg-white grid grid-cols-12 text-gray-800 font-sans">
    <div className="col-span-4 text-white p-4 md:p-8 pt-12 flex flex-col" style={{ backgroundColor: '#1f2937' }}>
      <div className="mb-8 text-center">
         {data.personalInfo.photo ? (
           <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full object-cover border-4 border-white/20 mb-4" />
         ) : (
           <div className="w-24 h-24 mx-auto rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4">
              {data.personalInfo.fullName.charAt(0)}
           </div>
         )}
         <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-tight break-words">{data.personalInfo.fullName}</h1>
         <p className="text-xs md:text-sm opacity-80 mt-2 font-light">{data.personalInfo.location}</p>
      </div>

      <div className="space-y-6 md:space-y-8 flex-1">
        <div>
           <h3 className="font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-2 mb-4" style={{ color: color }}>Contact</h3>
           <ul className="text-xs md:text-sm space-y-3 opacity-90 break-all font-light">
              <li className="flex gap-2 items-center"><Mail size={14} className="shrink-0"/> {data.personalInfo.email}</li>
              <li className="flex gap-2 items-center"><Phone size={14} className="shrink-0"/> {data.personalInfo.phone}</li>
              {data.personalInfo.linkedin && <li className="flex gap-2 items-center"><Linkedin size={14} className="shrink-0"/> {data.personalInfo.linkedin}</li>}
              {data.personalInfo.github && <li className="flex gap-2 items-center"><Github size={14} className="shrink-0"/> {data.personalInfo.github}</li>}
           </ul>
        </div>
        
        <div>
           <h3 className="font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-2 mb-4" style={{ color: color }}>Skills</h3>
           <div className="flex flex-wrap gap-2">
              {data.skills.split(',').map((skill, i) => (
                <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs backdrop-blur-sm">{skill.trim()}</span>
              ))}
           </div>
        </div>
      </div>
    </div>

    <div className="col-span-8 p-6 md:p-10 pt-12 bg-white">
       <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold uppercase mb-4 flex items-center gap-3" style={{ color: '#1f2937' }}>
            <span className="w-2 h-6 md:h-8 rounded-sm" style={{ backgroundColor: color }}></span> Profile
          </h2>
          <p className="text-xs md:text-sm leading-5 md:leading-6 text-gray-600 text-justify">{data.personalInfo.summary}</p>
       </div>

       <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold uppercase mb-6 flex items-center gap-3" style={{ color: '#1f2937' }}>
            <span className="w-2 h-6 md:h-8 rounded-sm" style={{ backgroundColor: color }}></span> Experience
          </h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-6 relative pl-4 md:pl-6 border-l-2 border-gray-100">
               <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 bg-white border-2" style={{ borderColor: color }}></div>
               <h3 className="font-bold text-base md:text-lg text-gray-800">{exp.role}</h3>
               <div className="flex justify-between text-xs md:text-sm mb-2 mt-1">
                  <span className="font-semibold" style={{ color: color }}>{exp.company}</span>
                  <span className="text-gray-400 font-medium">{exp.duration}</span>
               </div>
               <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
       </div>

       <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold uppercase mb-6 flex items-center gap-3" style={{ color: '#1f2937' }}>
            <span className="w-2 h-6 md:h-8 rounded-sm" style={{ backgroundColor: color }}></span> Projects
          </h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-4 md:mb-5 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-2 gap-1 md:gap-0">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{proj.name}</h3>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 font-medium tracking-wide uppercase">{proj.tech}</span>
               </div>
               <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
       </div>

       <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold uppercase mb-6 flex items-center gap-3" style={{ color: '#1f2937' }}>
            <span className="w-2 h-6 md:h-8 rounded-sm" style={{ backgroundColor: color }}></span> Education
          </h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-4 flex justify-between items-center border-b border-gray-100 pb-4">
               <div>
                 <h3 className="font-bold text-sm md:text-base text-gray-800">{edu.school}</h3>
                 <p className="text-xs md:text-sm text-gray-600">{edu.degree}</p>
               </div>
               <span className="text-xs md:text-sm font-bold text-gray-400 bg-gray-50 px-2 md:px-3 py-1 rounded-full">{edu.year}</span>
            </div>
          ))}
       </div>
    </div>
  </div>
);

// 2. CLASSIC TEMPLATE
const TemplateClassic = ({ data, color }) => (
    <div className="h-auto min-h-[297mm] w-full bg-white p-8 md:p-14 text-gray-800 font-serif relative">
      <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: color }}></div>
      <div className="text-center border-b border-gray-300 pb-8 mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">{data.personalInfo.fullName}</h1>
        <div className="text-xs md:text-sm flex flex-wrap justify-center gap-3 text-gray-500 font-sans uppercase tracking-wide">
          <span>{data.personalInfo.email}</span>
          <span style={{ color: color }}>•</span>
          <span>{data.personalInfo.phone}</span>
          <span style={{ color: color }}>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
      <div className="mb-8">
         <h3 className="uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-gray-100 pb-2 font-sans flex items-center gap-2">
           <span style={{ color: color }}><User size={16}/></span> Professional Summary
         </h3>
         <p className="text-sm md:text-base leading-relaxed text-gray-700">{data.personalInfo.summary}</p>
      </div>
      <div className="mb-8">
         <h3 className="uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-gray-100 pb-2 font-sans flex items-center gap-2">
           <span style={{ color: color }}><Briefcase size={16}/></span> Experience
         </h3>
         {data.experience.map(exp => (
           <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-baseline mb-1 font-sans">
                 <span className="font-bold text-base md:text-lg text-gray-900">{exp.company}</span>
                 <span className="text-xs md:text-sm font-medium text-gray-500">{exp.duration}</span>
              </div>
              <div className="text-sm md:text-md font-semibold italic text-gray-600 mb-2" style={{ color: color }}>{exp.role}</div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{exp.description}</p>
           </div>
         ))}
      </div>
      <div className="mb-8">
         <h3 className="uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-gray-100 pb-2 font-sans flex items-center gap-2">
            <span style={{ color: color }}><GraduationCap size={16}/></span> Education
         </h3>
         {data.education.map(edu => (
           <div key={edu.id} className="mb-3 flex justify-between items-end">
              <div>
                 <div className="font-bold text-base md:text-lg text-gray-900">{edu.school}</div>
                 <div className="text-xs md:text-sm italic text-gray-600">{edu.degree}</div>
              </div>
              <div className="text-xs md:text-sm font-sans font-medium text-gray-500">{edu.year}</div>
           </div>
         ))}
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
             <h3 className="uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-gray-100 pb-2 font-sans flex items-center gap-2">
                <span style={{ color: color }}><Code size={16}/></span> Skills
             </h3>
             <p className="text-xs md:text-sm leading-7 font-sans">
               {data.skills.split(',').map((skill, i) => (
                 <span key={i} className="inline-block mr-2 mb-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
                   {skill.trim()}
                 </span>
               ))}
             </p>
          </div>
          <div>
             <h3 className="uppercase tracking-widest font-bold text-sm mb-4 border-b-2 border-gray-100 pb-2 font-sans flex items-center gap-2">
                <span style={{ color: color }}><Heart size={16}/></span> Interests
             </h3>
             <p className="text-xs md:text-sm leading-6 font-sans text-gray-600">
               {data.interests}
             </p>
          </div>
      </div>
    </div>
);
  
// 3. MINIMALIST TEMPLATE
const TemplateMinimalist = ({ data, color }) => (
    <div className="h-auto min-h-[297mm] w-full bg-white p-6 md:p-8 text-gray-900 font-sans">
       <header className="flex flex-col md:flex-row justify-between items-start border-b-4 pb-6 mb-8 gap-4 md:gap-0" style={{ borderColor: color }}>
          <div className="flex gap-6 items-center">
             <div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2" style={{ color: '#000' }}>
                 {data.personalInfo.fullName.split(' ')[0]}<span style={{ color: color }}>.</span>
               </h1>
               <h2 className="text-base md:text-lg font-medium text-gray-500 uppercase tracking-widest">Developer</h2>
             </div>
          </div>
          <div className="text-left md:text-right text-xs font-medium text-gray-500 space-y-2 w-full md:w-auto">
             <p className="flex items-center md:justify-end gap-2">{data.personalInfo.email} <div className="w-2 h-2 rounded-full bg-green-400 hidden md:block"></div></p>
             <p>{data.personalInfo.phone}</p>
             <p>{data.personalInfo.location}</p>
          </div>
       </header>
  
       <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"> 
          <div className="md:col-span-4 space-y-8 md:border-r border-gray-100 md:pr-6">
             <section>
                <h3 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                  <span className="text-lg" style={{ color: color }}>//</span> Education
                </h3>
                {data.education.map(edu => (
                  <div key={edu.id} className="mb-4">
                     <div className="font-bold text-base">{edu.school}</div>
                     <div className="text-gray-600 mb-1 leading-tight">{edu.degree}</div>
                     <div className="text-xs text-gray-400 bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">{edu.year}</div>
                  </div>
                ))}
             </section>
             <section>
                <h3 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                  <span className="text-lg" style={{ color: color }}>//</span> Skills
                </h3>
                <div className="flex flex-col gap-2">
                   {data.skills.split(',').map((skill, i) => (
                     <div key={i} className="flex items-start gap-2 text-sm font-medium">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                       <span className="break-words">{skill.trim()}</span>
                     </div>
                   ))}
                </div>
             </section>
          </div>
  
          <div className="md:col-span-8 space-y-8">
             <section>
                <h3 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                  <span className="text-lg" style={{ color: color }}>//</span> About
                </h3>
                <p className="leading-7 text-gray-600 border-l-2 pl-4 border-gray-100 text-sm">{data.personalInfo.summary}</p>
             </section>
             <section>
                <h3 className="font-black text-base uppercase mb-4 flex items-center gap-2">
                  <span className="text-lg" style={{ color: color }}>//</span> Experience
                </h3>
                {data.experience.map(exp => (
                  <div key={exp.id} className="mb-8 group">
                     <h4 className="font-bold text-lg mb-1">{exp.role}</h4>
                     <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                       <span style={{ color: color }}>@</span> {exp.company} — {exp.duration}
                     </div>
                     <p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
                  </div>
                ))}
             </section>
          </div>
       </div>
    </div>
);
  
// 4. EXECUTIVE TEMPLATE
const TemplateExecutive = ({ data, color }) => (
    <div className="h-auto min-h-[297mm] w-full bg-white text-gray-800 font-sans">
      <div className="p-6 md:p-10 text-white" style={{ backgroundColor: color }}>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">{data.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-xs md:text-sm opacity-90">
          <span>{data.personalInfo.email}</span> | 
          <span>{data.personalInfo.phone}</span> | 
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
  
      <div className="p-6 md:p-10">
        <section className="mb-8">
          <h3 className="text-base md:text-lg font-bold uppercase border-b-2 mb-3 pb-1" style={{ borderColor: color, color: color }}>Professional Profile</h3>
          <p className="text-xs md:text-sm leading-6 text-gray-700">{data.personalInfo.summary}</p>
        </section>
        <section className="mb-8">
          <h3 className="text-base md:text-lg font-bold uppercase border-b-2 mb-4 pb-1" style={{ borderColor: color, color: color }}>Experience</h3>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="font-bold text-base md:text-lg text-gray-900">{exp.role}</h4>
                <span className="text-xs md:text-sm font-semibold text-gray-500">{exp.duration}</span>
              </div>
              <div className="text-xs md:text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">{exp.company}</div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <section>
            <h3 className="text-base md:text-lg font-bold uppercase border-b-2 mb-4 pb-1" style={{ borderColor: color, color: color }}>Education</h3>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="font-bold text-gray-900 text-sm md:text-base">{edu.school}</div>
                <div className="text-xs md:text-sm text-gray-600">{edu.degree}</div>
                <div className="text-xs text-gray-500 mt-1">{edu.year}</div>
              </div>
            ))}
          </section>
          <section>
            <h3 className="text-base md:text-lg font-bold uppercase border-b-2 mb-4 pb-1" style={{ borderColor: color, color: color }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.split(',').map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
);
  
// 5. IVY LEAGUE TEMPLATE
const TemplateIvy = ({ data, color }) => (
    <div className="h-auto min-h-[297mm] w-full bg-white p-8 md:p-12 text-black font-serif">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">{data.personalInfo.fullName}</h1>
        <div className="text-xs md:text-sm flex flex-wrap justify-center gap-3 text-gray-700">
          <span>{data.personalInfo.email}</span> • 
          <span>{data.personalInfo.phone}</span> • 
          <span>{data.personalInfo.location}</span>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm border-b border-black mb-2">Professional Summary</h3>
        <p className="text-xs md:text-sm leading-snug">{data.personalInfo.summary}</p>
      </div>
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm border-b border-black mb-3">Education</h3>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-2 flex justify-between">
            <div>
              <div className="font-bold text-sm md:text-base">{edu.school}</div>
              <div className="text-xs md:text-sm italic">{edu.degree}</div>
            </div>
            <div className="text-xs md:text-sm font-bold">{edu.year}</div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm border-b border-black mb-3">Experience</h3>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <div className="font-bold text-sm md:text-base">{exp.company}</div>
              <div className="text-xs md:text-sm font-bold">{exp.duration}</div>
            </div>
            <div className="text-xs md:text-sm italic mb-1">{exp.role}</div>
            <p className="text-xs md:text-sm leading-snug">{exp.description}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="font-bold uppercase text-sm border-b border-black mb-2">Skills</h3>
        <p className="text-xs md:text-sm">{data.skills}</p>
      </div>
    </div>
);

/* --- 4. MAIN COMPONENT --- */

const ResumeBuilder = ({ onClose }) => {
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' or 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [accentColor, setAccentColor] = useState('#00B291'); 
  const [zoom, setZoom] = useState(0.8); 
  const [activeSection, setActiveSection] = useState('personal');
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);

  // Detect Mobile Check for Transforms
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultData = {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      location: 'San Francisco, CA',
      summary: 'Results-oriented Senior Full Stack Developer with 6+ years of experience designing and deploying scalable web applications. Skilled in React, Node.js, and cloud infrastructure.',
      photo: null 
    },
    education: [
      { id: 1, school: 'University of Technology', degree: 'B.S. Computer Science', year: '2014 - 2018' },
    ],
    experience: [
      { id: 1, company: 'Innovate Tech Solutions', role: 'Senior Software Engineer', duration: 'Jan 2021 - Present', description: 'Spearheaded the migration of a legacy monolith to a microservices architecture.' },
    ],
    projects: [
      { id: 1, name: 'E-Commerce Dashboard', tech: 'React, TypeScript', description: 'Built a comprehensive analytics dashboard for online retailers.' },
    ],
    skills: 'JavaScript, TypeScript, React, Next.js, Node.js, AWS, Docker',
    certificates: [],
    interests: 'AI, Hiking, Photography'
  };

  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('resumeData');
      if (saved) return { ...defaultData, ...JSON.parse(saved) };
      return defaultData;
    } catch { return defaultData; }
  });

  useEffect(() => { localStorage.setItem('resumeData', JSON.stringify(resumeData)); }, [resumeData]);

  // Handlers
  const handleInfoChange = (e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value } });
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, photo: reader.result } });
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (type, id, field, value) => {
    const newArray = resumeData[type].map(item => item.id === id ? { ...item, [field]: value } : item);
    setResumeData({ ...resumeData, [type]: newArray });
  };

  const addItem = (type) => {
    const newItem = type === 'education' ? { id: Date.now(), school: '', degree: '', year: '' }
      : type === 'experience' ? { id: Date.now(), company: '', role: '', duration: '', description: '' }
      : type === 'projects' ? { id: Date.now(), name: '', tech: '', description: '' }
      : { id: Date.now(), name: '', issuer: '', date: '' }; 
    setResumeData({ ...resumeData, [type]: [...resumeData[type], newItem] });
  };

  const removeItem = (type, id) => {
    setResumeData({ ...resumeData, [type]: resumeData[type].filter(item => item.id !== id) });
    toast.success('Item removed');
  };

  const handlePrint = () => {
    document.title = `${resumeData.personalInfo.fullName}_Resume`;
    window.print();
  };

  const confirmReset = () => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-800">Reset all data?</span>
        <div className="flex gap-2 justify-end">
            <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded">Cancel</button>
            <button onClick={() => { setResumeData(defaultData); toast.dismiss(t.id); toast.success("Reset!"); }} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Reset</button>
        </div>
      </div>
    ), { duration: 4000, icon: '⚠️' });
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 z-[100] bg-white md:bg-black/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6"
    >
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#f8f9fa] dark:bg-[#0f0f0f] w-full max-w-[1600px] h-full md:h-[95vh] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 md:border border-white/20"
      >
        
        {/* HEADER - OPTIMIZED FOR MOBILE */}
        <div className="h-auto md:h-20 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between p-3 md:px-6 bg-white dark:bg-[#121212] shrink-0 z-20 print:hidden gap-3 md:gap-0">
          
          {/* Top Row: Templates & Close */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
             <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto flex-1 md:flex-none hide-scrollbar">
               {[1,2,3,4,5].map(num => (
                 <button key={num} onClick={() => setSelectedTemplate(num)} className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${selectedTemplate === num ? 'bg-white dark:bg-[#2d2d2d] text-[#00B291] shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}>
                   {num === 1 ? 'Modern' : num === 2 ? 'Classic' : num === 3 ? 'Tech' : num === 4 ? 'Exec' : 'Ivy'}
                 </button>
               ))}
             </div>
             <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors md:hidden"><X className="h-5 w-5" /></button>
          </div>

          {/* Bottom Row (Mobile): Tabs & Actions */}
          <div className="flex flex-row items-center gap-2 w-full md:w-auto justify-between">
             {/* Tabs */}
             <div className="flex md:hidden bg-gray-100 p-1 rounded-lg flex-1">
                <button onClick={() => setMobileTab('editor')} className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 ${mobileTab === 'editor' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                    <Edit3 size={12} /> Editor
                </button>
                <button onClick={() => setMobileTab('preview')} className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 ${mobileTab === 'preview' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                    <Eye size={12} /> Preview
                </button>
             </div>
             
             {/* Action Icons Group */}
             <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] px-2 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="relative overflow-hidden w-6 h-6 rounded-full ring-1 ring-gray-200">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer" />
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <button onClick={confirmReset} className="text-gray-500 hover:text-red-500"><RefreshCw className="h-4 w-4" /></button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button onClick={handlePrint} className="text-[#00B291]"><Printer className="h-4 w-4" /></button>
             </div>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors hidden md:block"><X className="h-6 w-6" /></button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex overflow-hidden relative bg-gray-50 dark:bg-[#121212]">
          
          {/* LEFT EDITOR */}
          <div className={`w-full md:w-[450px] border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#121212] backdrop-blur-xl flex flex-col transition-all duration-300 z-10 print:hidden 
            ${mobileTab === 'editor' ? 'absolute inset-0 md:relative' : 'hidden md:flex'}`}>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
              
              {/* Personal Info */}
              <div className="space-y-0">
                <SectionHeader title="Personal Details" icon={User} id="personal" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'personal'}>
                  <div className="p-5 space-y-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                        {resumeData.personalInfo.photo ? <img src={resumeData.personalInfo.photo} className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-gray-400" />}
                      </div>
                      <button onClick={() => fileInputRef.current.click()} className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">Choose Image</button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                    <div className="grid gap-4">
                        <input type="text" name="fullName" placeholder="Full Name" value={resumeData.personalInfo.fullName} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                        <input type="email" name="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" name="phone" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                          <input type="text" name="location" placeholder="Location" value={resumeData.personalInfo.location} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                        </div>
                        <input type="text" name="linkedin" placeholder="LinkedIn" value={resumeData.personalInfo.linkedin} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                        <input type="text" name="github" placeholder="GitHub" value={resumeData.personalInfo.github} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm" />
                        <textarea name="summary" placeholder="Summary" rows="4" value={resumeData.personalInfo.summary} onChange={handleInfoChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm resize-none"></textarea>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Experience */}
              <div className="space-y-0">
                <SectionHeader title="Experience" icon={Briefcase} id="experience" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'experience'}>
                  <div className="p-4 space-y-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AnimatePresence>
                        {resumeData.experience.map((exp) => (
                        <motion.div 
                            key={exp.id} 
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative overflow-hidden"
                        >
                            <button onClick={() => removeItem('experience', exp.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                            <div className="space-y-3">
                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange('experience', exp.id, 'company', e.target.value)} className="w-full bg-transparent border-b border-gray-300 text-sm font-bold pb-1" />
                                <div className="flex gap-2">
                                <input type="text" placeholder="Role" value={exp.role} onChange={(e) => handleArrayChange('experience', exp.id, 'role', e.target.value)} className="w-1/2 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                <input type="text" placeholder="Duration" value={exp.duration} onChange={(e) => handleArrayChange('experience', exp.id, 'duration', e.target.value)} className="w-1/2 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                </div>
                                <textarea placeholder="Description" rows="3" value={exp.description} onChange={(e) => handleArrayChange('experience', exp.id, 'description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs resize-none" />
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addItem('experience')} className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#00B291] hover:text-[#00B291] text-sm font-bold"><Plus className="h-4 w-4" /> Add Experience</motion.button>
                  </div>
                </AnimatedSection>
              </div>

              {/* Projects, Education, Skills, Certificates, Interests - SAME PATTERN (Keeping brevity for response limit, functionality is identical to Experience) */}
              <div className="space-y-0">
                <SectionHeader title="Projects" icon={FolderGit2} id="projects" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'projects'}>
                  <div className="p-4 space-y-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AnimatePresence>
                        {resumeData.projects.map((proj) => (
                        <motion.div key={proj.id} variants={listVariants} initial="hidden" animate="visible" exit="exit" className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative overflow-hidden">
                            <button onClick={() => removeItem('projects', proj.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                            <div className="space-y-3">
                                <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleArrayChange('projects', proj.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-gray-300 text-sm font-bold pb-1" />
                                <input type="text" placeholder="Tech Stack" value={proj.tech} onChange={(e) => handleArrayChange('projects', proj.id, 'tech', e.target.value)} className="w-full bg-transparent border-b border-gray-300 text-xs pb-1" />
                                <textarea placeholder="Description" rows="2" value={proj.description} onChange={(e) => handleArrayChange('projects', proj.id, 'description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs resize-none" />
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addItem('projects')} className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#00B291] hover:text-[#00B291] text-sm font-bold"><Plus className="h-4 w-4" /> Add Project</motion.button>
                  </div>
                </AnimatedSection>
              </div>

              <div className="space-y-0">
                <SectionHeader title="Education" icon={GraduationCap} id="education" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'education'}>
                  <div className="p-4 space-y-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AnimatePresence>
                        {resumeData.education.map((edu) => (
                        <motion.div key={edu.id} variants={listVariants} initial="hidden" animate="visible" exit="exit" className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative overflow-hidden">
                            <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                            <div className="space-y-3">
                                <input type="text" placeholder="School" value={edu.school} onChange={(e) => handleArrayChange('education', edu.id, 'school', e.target.value)} className="w-full bg-transparent border-b border-gray-300 text-sm font-bold pb-1" />
                                <div className="flex gap-2">
                                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} className="w-2/3 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                <input type="text" placeholder="Year" value={edu.year} onChange={(e) => handleArrayChange('education', edu.id, 'year', e.target.value)} className="w-1/3 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addItem('education')} className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#00B291] hover:text-[#00B291] text-sm font-bold"><Plus className="h-4 w-4" /> Add Education</motion.button>
                  </div>
                </AnimatedSection>
              </div>

              <div className="space-y-0">
                <SectionHeader title="Skills" icon={Code} id="skills" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'skills'}>
                   <div className="p-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 shadow-sm">
                     <textarea name="skills" placeholder="Skills..." rows="4" value={resumeData.skills} onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm resize-none"></textarea>
                   </div>
                </AnimatedSection>
              </div>

              <div className="space-y-0">
                <SectionHeader title="Certificates" icon={Award} id="certificates" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'certificates'}>
                  <div className="p-4 space-y-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AnimatePresence>
                        {(resumeData.certificates || []).map((cert) => (
                        <motion.div key={cert.id} variants={listVariants} initial="hidden" animate="visible" exit="exit" className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative overflow-hidden">
                            <button onClick={() => removeItem('certificates', cert.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                            <div className="space-y-3">
                                <input type="text" placeholder="Certificate Name" value={cert.name} onChange={(e) => handleArrayChange('certificates', cert.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-gray-300 text-sm font-bold pb-1" />
                                <div className="flex gap-2">
                                <input type="text" placeholder="Issuer" value={cert.issuer} onChange={(e) => handleArrayChange('certificates', cert.id, 'issuer', e.target.value)} className="w-2/3 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                <input type="text" placeholder="Year" value={cert.date} onChange={(e) => handleArrayChange('certificates', cert.id, 'date', e.target.value)} className="w-1/3 bg-transparent border-b border-gray-300 text-xs pb-1" />
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addItem('certificates')} className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#00B291] hover:text-[#00B291] text-sm font-bold"><Plus className="h-4 w-4" /> Add Certificate</motion.button>
                  </div>
                </AnimatedSection>
              </div>

              <div className="space-y-0">
                <SectionHeader title="Interests/Hobbies" icon={Heart} id="interests" activeSection={activeSection} setActiveSection={setActiveSection} />
                <AnimatedSection isOpen={activeSection === 'interests'}>
                  <div className="p-5 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 shadow-sm">
                    <textarea name="interests" placeholder="Interests..." rows="4" value={resumeData.interests} onChange={(e) => setResumeData({...resumeData, interests: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm resize-none"></textarea>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div className={`flex-1 bg-white md:bg-[#e5e5e5] dark:md:bg-[#1a1a1a] overflow-hidden flex-col relative print:bg-white print:block print:overflow-visible
             ${mobileTab === 'preview' ? 'flex absolute inset-0 z-20' : 'hidden md:flex'}`}>
            
            {/* Toolbar (Zoom) - Hidden on Mobile */}
            <div className="h-14 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm border-b border-gray-200 hidden md:flex items-center justify-between px-6 print:hidden">
               <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1 mx-auto md:mx-0">
                  <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="p-1 hover:text-[#00B291]"><ZoomOut className="h-4 w-4" /></button>
                  <span className="text-xs font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1 hover:text-[#00B291]"><ZoomIn className="h-4 w-4" /></button>
               </div>
            </div>

            {/* Resume Canvas - FULL WIDTH MOBILE, NO PADDING, NO SHADOW, NO TRANSFORM ON MOBILE */}
            <div className="flex-1 overflow-auto flex justify-center p-0 md:p-8 print:p-0 print:overflow-visible custom-scrollbar">
               <div 
                 id="resume-preview"
                 className="bg-white shadow-none md:shadow-2xl transition-transform origin-top print:shadow-none print:transform-none"
                 style={{ 
                   width: '210mm', 
                   minHeight: '297mm', 
                   // KEY CHANGE: No scale transform on mobile, let natural scrolling happen
                   transform: isMobile ? 'none' : `scale(${zoom})`, 
                   transformOrigin: 'top center',
                   marginBottom: isMobile ? '0' : `${(zoom * 297)}mm`
                 }}
               >
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTemplate}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                    >
                        {selectedTemplate === 1 && <TemplateModern data={resumeData} color={accentColor} />}
                        {selectedTemplate === 2 && <TemplateClassic data={resumeData} color={accentColor} />}
                        {selectedTemplate === 3 && <TemplateMinimalist data={resumeData} color={accentColor} />}
                        {selectedTemplate === 4 && <TemplateExecutive data={resumeData} color={accentColor} />}
                        {selectedTemplate === 5 && <TemplateIvy data={resumeData} color={accentColor} />}
                    </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
      <style>
        {`
          @media print {
            @page { margin: 0; size: auto; }
            body * { visibility: hidden; }
            #resume-preview, #resume-preview * { visibility: visible; }
            #resume-preview { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0 !important; box-shadow: none !important; transform: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        `}
      </style>
    </motion.div>
  );
};

export default ResumeBuilder;