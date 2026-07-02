export const profile = {
  name: "Anant Kumar Iyer",
  title: "Senior Software Engineer",
  tagline:
    "Full-stack engineer building scalable web platforms, enterprise transfer systems, and AI-enhanced user interfaces with React, TypeScript, and Node.js.",
  footerBio:
    "Senior software engineer crafting scalable full-stack products and enterprise user experiences.",
  email: "anant.k.iyer@outlook.com",
  phone: "+91 8960646747",
  location: "Bangalore, KA",
  resumeUrl: "/resume.pdf",
  links: {
    github: "https://github.com/AnantKIyer",
    linkedin: "https://linkedin.com/in/anant-iyer",
  },
  stats: {
    experience: "5+ Years",
    companies: "4",
    technologies: "25+",
  },
} as const;

export const education = {
  school: "Kalinga Institute of Industrial Technology",
  degree: "B.Tech in Information Technology",
  location: "Bhubaneswar, OD",
  period: "Jul 2017 – Jun 2021",
} as const;

export const skillCategories = [
  {
    title: "Core",
    skills: [
      "HTML & CSS",
      "JavaScript (ES6)",
      "TypeScript",
      "Java",
      "Node.js",
      "SQL & NoSQL",
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      "React & Next.js",
      "React Native",
      "Express.js",
      "GraphQL",
      "Oracle JET",
      "Tailwind CSS",
      "Redux",
      "Kafka",
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Git & GitHub",
      "Figma",
      "Postman",
      "PostgreSQL & MySQL",
      "MongoDB",
      "Docker & Kubernetes",
      "GenAI & GitHub Copilot",
    ],
  },
] as const;

export const experiences = [
  {
    period: "Jan 2026 – Present",
    role: "Senior Software Engineer",
    company: "Brahma AI",
    location: "Bangalore, KA",
    description:
      "Leading full-stack development of enterprise-scale media download infrastructure with React, TypeScript, Node.js, and distributed transfer services.",
    achievements: [
      "Re-architected enterprise download infrastructure, improving overall download reliability by 62%.",
      "Built an intelligent multi-transport transfer framework with adaptive execution tiers, improving throughput by 22%.",
      "Delivered end-to-end CLEAR Transfer Agent integrations for agent discovery, chunked transfers, and secure multi-terabyte asset delivery.",
      "Architected real-time monitoring, ACL-aware validation, and event-driven notification systems for production workflows.",
    ],
  },
  {
    period: "Nov 2022 – Nov 2025",
    role: "Full Stack Developer",
    company: "Oracle",
    location: "Bangalore, KA",
    description:
      "Built high-performance UI components and AI-enhanced banking experiences for large-scale financial platforms using React, TypeScript, and Oracle JET.",
    achievements: [
      "Developed reusable React/TypeScript components extended with AI-driven smart inputs and context-aware UI behaviors.",
      "Engineered payments, standing orders, and international transfer modules integrated with GenAI assistants for form automation.",
      "Built real-time transaction UIs with WebSockets, REST, and GraphQL, including AI-based anomaly indicators.",
      "Integrated Oracle backend services (OBDX & FLEXCUBE) with cloud AI layers for insights and automated query resolution.",
    ],
  },
  {
    period: "Jun 2021 – Nov 2022",
    role: "Associate UI/UX Engineer",
    company: "Highradius Technologies",
    location: "Bhubaneswar, OD",
    description:
      "Co-developed cloud-based HRIS and enterprise collaboration features using React, Node.js, GraphQL, and MongoDB.",
    achievements: [
      "Optimized HR workflows with Redux state management and real-time multi-user collaboration features.",
      "Mentored junior developers on scalable UI patterns, accessibility, testing, and GraphQL best practices.",
      "Architected end-to-end GraphQL integrations across React frontends and Node.js backends.",
      "Improved API performance with Axios-based async communication and efficient data fetching patterns.",
    ],
  },
  {
    period: "Mar 2021 – Jun 2021",
    role: "Engineering Intern",
    company: "Highradius Technologies",
    location: "Bhubaneswar, OD",
    description:
      "Contributed to microservices, CI/CD automation, and API development for enterprise applications.",
    achievements: [
      "Automated deployments with Jenkins, Docker, and Kubernetes for reliable production environments.",
      "Built Java microservices with Spring Boot focused on modularity and fault tolerance.",
      "Developed and consumed REST and GraphQL APIs for complex UI components.",
    ],
  },
] as const;
