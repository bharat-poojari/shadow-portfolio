// All content here is grounded in Bharat's resume / master plan document.
// Do not add invented metrics, links, or credentials — see section 1 of the
// master plan ("Source-Fidelity Rule"). Unresolved gaps are marked TODO.

export const profile = {
  name: 'Bharat Poojari',
  title: 'Full Stack Developer',
  subtitle: 'Node.js & React.js · AI Integration',
  location: 'Sirsi, Karnataka, India – 581358',
  email: 'bharatp0316@gmail.com',
  phone: '8073750997',
  heroLine: "I don't build interfaces. I build systems that move.",
  aboutLine: 'Every system begins with a question. Mine began with curiosity.',
  summary:
    'Detail-oriented BCA graduate with a strong foundation in full-stack web development, skilled in building and deploying responsive applications with Node.js, Express.js, React.js, MongoDB, and MySQL. Completed a Prompt Engineering internship at ProEdge Learning, gaining hands-on experience integrating LLMs and AI capabilities into Node.js applications.',
};

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  { id: 'languages', label: 'Languages', items: ['JavaScript (ES6+)', 'PHP', 'Python', 'C'] },
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Responsive Web Design'],
  },
  { id: 'backend', label: 'Backend', items: ['Node.js', 'Express.js', 'RESTful APIs'] },
  { id: 'databases', label: 'Databases', items: ['MongoDB', 'MySQL'] },
  {
    id: 'ai',
    label: 'AI & Prompt Engineering',
    items: ['Prompt Engineering', 'Large Language Models (LLMs)', 'AI Integration'],
  },
  {
    id: 'tools',
    label: 'Tools & Version Control',
    items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma', 'Docker (Basic)', 'Firebase (Basic)'],
  },
  {
    id: 'soft',
    label: 'Professional Strengths',
    items: [
      'Problem Solving',
      'Critical Thinking',
      'Teamwork',
      'Communication',
      'Time Management',
      'Adaptability',
      'Leadership',
    ],
  },
];

export type Project = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  category: 'flagship' | 'ai' | 'frontend' | 'tooling' | 'evolution';
  stack: string[];
  points: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'furniqo',
    order: 1,
    title: 'Furniqo',
    subtitle: 'Premium Furniture E-commerce Platform',
    category: 'flagship',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Three.js', 'Tailwind CSS', 'Vite', 'Zustand', 'REST APIs'],
    points: [
      'Responsive full-stack e-commerce application on the MERN stack with interactive 3D product visualization using Three.js.',
      'Shopping cart, wishlist, product search, and order management with RESTful APIs and optimized state management.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/Furniqo',
    liveUrl: 'https://the-furniqo.vercel.app',
  },
  {
    id: 'offyai',
    order: 2,
    title: 'OffyAI',
    subtitle: 'Offline AI Programming Assistant',
    category: 'ai',
    stack: ['Python', 'LLM (Qwen2.5)', 'Machine Learning', 'HTML', 'CSS', 'JavaScript'],
    points: [
      'Offline AI-powered programming assistant using a fine-tuned LLM for privacy-focused coding guidance without internet access.',
      'Intuitive interface for programming queries and code explanations, optimized for lightweight execution on standard hardware.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/offyai',
  },
  {
    id: 'primenews',
    order: 3,
    title: 'PrimeNews',
    subtitle: 'Real-Time News Portal',
    category: 'frontend',
    stack: ['React.js', 'Vite', 'Tailwind CSS', 'REST APIs', 'Zustand'],
    points: [
      'Responsive React application aggregating real-time news from multiple APIs with fallback mechanisms, category filtering, and search.',
      'Bookmarks and infinite scrolling; performance optimized through caching, lazy loading, code splitting, and light/dark theme support.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/PrimeNews',
    liveUrl: 'https://the-prime-news.vercel.app',
  },
  {
    id: 'codepolish',
    order: 4,
    title: 'CodePolish',
    subtitle: 'VS Code Extension',
    category: 'tooling',
    stack: ['TypeScript', 'Node.js', 'VS Code Extension API', 'JavaScript'],
    points: [
      'Published VS Code extension that beautifies and minifies source code across multiple languages, with automatic language detection.',
      'Keyboard shortcuts and command palette integration to streamline developer workflow while preserving syntax and functionality.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/codepolish',
  },
  {
    id: 'bharat-portfolio',
    order: 5,
    title: 'Personal Portfolio (Previous)',
    subtitle: 'Developer Portfolio',
    category: 'evolution',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
    points: [
      'Responsive developer portfolio with interactive project showcase, dark/light theme, and smooth animations; optimized for SEO and performance.',
      'This site — The Living Chronicle — is the next evolution of that work.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/Bharat-Portfolio',
    liveUrl: 'https://bharat-poojari-portfolio.vercel.app',
  },
  // NOTE: resume achievements state "six" independently built applications,
  // but only five are named in the source resume. Do not fabricate a sixth —
  // add it here once Bharat supplies the name/details.
];

export type EducationItem = {
  id: string;
  qualification: string;
  period: string;
  institution: string;
  result: string;
};

export const education: EducationItem[] = [
  {
    id: 'bca',
    qualification: 'Bachelor of Computer Applications (BCA)',
    period: '2023 – 2026',
    institution: 'JMJ BCA College, Chipgi, Sirsi | Karnataka University, Dharwad',
    result: 'CGPA: 9.02/10',
  },
  {
    id: 'puc',
    qualification: 'Pre-University Course (PUC)',
    period: '2021 – 2023',
    institution: 'Shree Marikamba Government PU College, Sirsi | Karnataka State Board',
    result: '87.3%',
  },
  {
    id: 'sslc',
    qualification: 'Secondary School Leaving Certificate (SSLC)',
    period: '2018 – 2021',
    institution: 'Surya Narayana High School, Bisalakoppa, Sirsi | Karnataka State Board',
    result: '93%',
  },
];

export const coursework: string[] = [
  'Data Structures and Algorithms',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'OOP',
  'Web Technologies',
  'Computer Organization and Architecture',
];

export const languages = [
  { name: 'Kannada', level: 'Native' },
  { name: 'English', level: 'Professional Working Proficiency' },
  { name: 'Hindi', level: 'Intermediate' },
];

export const internship = {
  role: 'Prompt Engineering Intern',
  company: 'ProEdge Learning, A VisionPro Ventures Pvt. Ltd.',
  period: 'March 2026 – May 2026',
  points: [
    'Applied AI and prompt engineering techniques to support development of Node.js-based web applications and websites.',
    'Designed and refined prompts for Large Language Models (LLMs) to improve the quality and reliability of AI-generated outputs.',
    'Assisted in integrating AI features into web applications to automate tasks and enhance user experience.',
    'Collaborated with the development team to test, evaluate, and optimize AI-assisted workflows.',
  ],
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
};

export const certifications: Certification[] = [
  { id: 'prompt-eng', title: 'Prompt Engineering – Web Development', issuer: 'ProEdge Learning', date: 'June 2026' },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer Certification',
    issuer: 'SIDH & Reliance Foundation Skilling Academy',
    date: 'July 2025',
  },
  {
    id: 'iot-network',
    title: 'IoT Network Specialist',
    issuer: 'SIDH & Reliance Foundation Skilling Academy',
    date: 'July 2025',
  },
];

export const achievements: string[] = [
  'Maintained a CGPA of 9.02/10 throughout the BCA program.',
  'Independently developed and deployed six full-stack and AI-powered applications, including an offline AI assistant, a 3D e-commerce platform, and a published VS Code extension.',
  'Completed a Prompt Engineering – Web Development internship at ProEdge Learning, A VisionPro Ventures Pvt. Ltd.',
];

export const siteSections = [
  {
    id: 'hero',
    num: '01',
    label: 'Hero',
    arc: 'The Awakening',
  },

  {
    id: 'about',
    num: '02',
    label: 'About',
    arc: 'The Origin',
  },

  {
    id: 'skills',
    num: '03',
    label: 'Skills',
    arc: 'The Codex',
  },

  {
    id: 'projects',
    num: '04',
    label: 'Projects',
    arc: 'The Campaigns',
  },

  {
    id: 'fun-zone',
    num: '05',
    label: 'Fun Zone',
    shortLabel: 'FUN',
    arc: 'The System Instances',
  },

  {
    id: 'education',
    num: '06',
    label: 'Education',
    arc: 'The Training Arc',
  },

  {
    id: 'certifications',
    num: '07',
    label: 'Certifications',
    arc: 'The Artifact Vault',
  },

  {
    id: 'contact',
    num: '08',
    label: 'Contact',
    arc: 'The Next Arc',
  },
] as const;
