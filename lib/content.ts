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

export type OtherProject = {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
};

export const projects: Project[] = [
  {
    id: 'offyai',
    order: 1,
    title: 'OffyAI',
    subtitle: 'Local AI Desktop Application',
    category: 'ai',
    stack: ['JavaScript', 'Electron', 'React', 'Node.js', 'llama.cpp', 'GGUF', 'Hugging Face API'],
    points: [
      'Windows desktop application for running and interacting with local Large Language Models through a polished ChatGPT-like workspace.',
      'Model management, local sessions, configurable inference, document context, and live CPU, RAM, GPU, latency, and token-throughput monitoring.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/offyai',
    liveUrl: 'https://offyai.vercel.app',
  },
  {
    id: 'furniqo',
    order: 2,
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
    id: 'shadow-portfolio',
    order: 3,
    title: 'Portfolio',
    subtitle: 'Immersive Developer Portfolio',
    category: 'evolution',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
    points: [
      'Dark, immersive developer portfolio inspired by the Shadow Monarch, presenting skills, projects, and a coding journey as a living archive.',
      'Interactive motion, atmospheric 3D scene work, responsive layouts, and structured content built for a fast, accessible browsing experience.',
    ],
    githubUrl: 'https://github.com/bharat-poojari/shadow-portfolio',
    liveUrl: 'https://bharat-poojari.vercel.app',
  },
];

export const otherProjects: OtherProject[] = [
  {
    id: 'offyai-website',
    title: 'OffyAI Website',
    description: 'Product website for the local-first AI desktop application.',
    githubUrl: 'https://github.com/bharat-poojari/offyai-website',
  },
  {
    id: 'primenews',
    title: 'PrimeNews',
    description: 'Real-time news aggregator with category filtering, search, and persistent bookmarks.',
    githubUrl: 'https://github.com/bharat-poojari/PrimeNews',
  },
  {
    id: 'codepolish',
    title: 'CodePolish',
    description: 'VS Code extension for beautifying and minifying HTML, CSS, and JavaScript.',
    githubUrl: 'https://github.com/bharat-poojari/codepolish',
  },
  {
    id: 'student-management-system',
    title: 'Student Management System',
    description: 'Open-source platform for attendance, grades, and student progress.',
    githubUrl: 'https://github.com/bharat-poojari/student-management-system',
  },
  {
    id: 'volcanico',
    title: 'VOLCANICO',
    description: 'Immersive restaurant experience with cart interactions and scroll animation.',
    githubUrl: 'https://github.com/bharat-poojari/VOLCANICO',
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    description: 'Responsive React and Vite restaurant website deployed on Vercel.',
    githubUrl: 'https://github.com/bharat-poojari/restaurant',
  },
  {
    id: 'college-website',
    title: 'College Website',
    description: 'Full-stack college portal with role-based access, CRUD, and file uploads.',
    githubUrl: 'https://github.com/bharat-poojari/college-website',
  },
  {
    id: 'offy-ai',
    title: 'Offy AI',
    description: 'Offline-first programming model fine-tuned to support coding education.',
    githubUrl: 'https://github.com/bharat-poojari/offy_ai',
  },
  {
    id: 'bharat-portfolio',
    title: 'Bharat Portfolio',
    description: 'Earlier developer portfolio with a terminal interface and project gallery.',
    githubUrl: 'https://github.com/bharat-poojari/Bharat-Portfolio',
  },
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
  'Built and deployed OffyAI, a Windows desktop application for running local Large Language Models with model management, configurable inference, document context, and live performance monitoring.',
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
