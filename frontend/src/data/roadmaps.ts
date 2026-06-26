import type { RoadmapItem, RecommendedProject, LearningResource } from '../types';

export interface RoleRoadmap {
  roadmap: RoadmapItem[];
  projects: RecommendedProject[];
  resources: LearningResource[];
}

export const ROLE_ROADMAPS: Record<string, RoleRoadmap> = {
  backend: {
    roadmap: [
      {
        month: 'Month 1: Infrastructure & Containers',
        topics: ['Linux & Bash Scripting', 'Git Version Control', 'Docker Containers & Docker Compose']
      },
      {
        month: 'Month 2: Cloud Deployment & Delivery',
        topics: ['Amazon Web Services (AWS)', 'CI/CD Pipelines (GitHub Actions)', 'Relational Databases (PostgreSQL) Optimization']
      },
      {
        month: 'Month 3: Scaling & System Design',
        topics: ['Redis Caching Patterns', 'Architectural Styles (microservices, gRPC, REST)', 'System Design Principles (Load Balancing, Sharding)']
      }
    ],
    projects: [
      {
        name: 'URL Shortener Service',
        skillsLearned: ['Go/Node.js', 'Redis', 'PostgreSQL', 'Docker'],
        duration: '2 weeks'
      },
      {
        name: 'Distributed In-Memory Cache',
        skillsLearned: ['Go', 'TCP/UDP Networking', 'Concurrency', 'Mutexes'],
        duration: '3 weeks'
      },
      {
        name: 'AI Resume Analyzer API',
        skillsLearned: ['Python', 'LangChain', 'OpenAI API', 'Docker'],
        duration: '2 weeks'
      }
    ],
    resources: [
      {
        name: 'Docker & Kubernetes Complete Guide',
        difficulty: 'Intermediate',
        duration: '15 hours',
        link: 'https://docker.com'
      },
      {
        name: 'AWS Cloud Practitioner Essentials',
        difficulty: 'Beginner',
        duration: '6 hours',
        link: 'https://aws.amazon.com'
      },
      {
        name: 'System Design Primer (GitHub)',
        difficulty: 'Advanced',
        duration: '20 hours',
        link: 'https://github.com/donnemartin/system-design-primer'
      }
    ]
  },
  frontend: {
    roadmap: [
      {
        month: 'Month 1: Advanced Languages & Build Tools',
        topics: ['TypeScript Type System', 'Build Tools (Vite, Webpack)', 'Tailwind CSS Layouts & Custom Themes']
      },
      {
        month: 'Month 2: State Management & Testing',
        topics: ['State Management (Redux Toolkit, Zustand)', 'Testing with Jest & React Testing Library', 'API Integration & Querying (React Query)']
      },
      {
        month: 'Month 3: Next-Gen Frameworks & Animation',
        topics: ['Next.js App Router (SSR, SSG)', 'SEO Optimization & Web Vitals', 'Framer Motion Micro-Animations']
      }
    ],
    projects: [
      {
        name: 'SaaS Analytics Dashboard',
        skillsLearned: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
        duration: '1 week'
      },
      {
        name: 'Collaborative Docs Editor',
        skillsLearned: ['Next.js', 'WebSockets', 'Yjs CRDTs', 'Tailwind'],
        duration: '3 weeks'
      },
      {
        name: 'Interactive Component Library',
        skillsLearned: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
        duration: '2 weeks'
      }
    ],
    resources: [
      {
        name: 'TypeScript Deep Dive',
        difficulty: 'Intermediate',
        duration: '10 hours',
        link: 'https://typescriptlang.org'
      },
      {
        name: 'Epic React by Kent C. Dodds',
        difficulty: 'Advanced',
        duration: '30 hours',
        link: 'https://epicreact.dev'
      },
      {
        name: 'Next.js 14 Complete Guide',
        difficulty: 'Intermediate',
        duration: '18 hours',
        link: 'https://nextjs.org'
      }
    ]
  },
  fullstack: {
    roadmap: [
      {
        month: 'Month 1: UI Engineering & TypeScript',
        topics: ['TypeScript Advanced Types', 'Tailwind CSS Flex/Grid', 'React Components & Hooks Performance']
      },
      {
        month: 'Month 2: Backend Development & Databases',
        topics: ['Node.js & Express API Development', 'Relational Databases (PostgreSQL)', 'NoSQL Databases (MongoDB) & Schema Design']
      },
      {
        month: 'Month 3: Containerization & Cloud Deployment',
        topics: ['Dockerizing Fullstack Apps', 'Cloud Deployment on AWS/Vercel/Render', 'CI/CD Pipelines & Security Best Practices']
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        skillsLearned: ['MERN Stack', 'Stripe Payments', 'Redux Toolkit', 'Tailwind'],
        duration: '3 weeks'
      },
      {
        name: 'Real-time Chat Application',
        skillsLearned: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
        duration: '2 weeks'
      },
      {
        name: 'AI-Powered Job Board',
        skillsLearned: ['Next.js', 'Prisma', 'PostgreSQL', 'Gemini API'],
        duration: '3 weeks'
      }
    ],
    resources: [
      {
        name: 'Full Stack Open (University of Helsinki)',
        difficulty: 'Intermediate',
        duration: '40 hours',
        link: 'https://fullstackopen.com'
      },
      {
        name: 'SQL & PostgreSQL Academy',
        difficulty: 'Beginner',
        duration: '12 hours',
        link: 'https://postgresql.org'
      },
      {
        name: 'Docker & AWS for Developers',
        difficulty: 'Advanced',
        duration: '20 hours',
        link: 'https://aws.amazon.com'
      }
    ]
  },
  'ai-ml': {
    roadmap: [
      {
        month: 'Month 1: Mathematical Foundations & PyTorch',
        topics: ['Python Object-Oriented Programming', 'Linear Algebra & Calculus for ML', 'PyTorch Basics & Neural Networks']
      },
      {
        month: 'Month 2: LLMs, Embeddings & Vectors',
        topics: ['Hugging Face Transformers', 'Vector Databases (Chroma, Qdrant, Pinecone)', 'Retrieval-Augmented Generation (RAG) Architecture']
      },
      {
        month: 'Month 3: AI Agents & Integrations',
        topics: ['LangChain & LlamaIndex frameworks', 'Model Context Protocol (MCP) Integration', 'Deploying Models to Production (Triton, FastAPI)']
      }
    ],
    projects: [
      {
        name: 'RAG Knowledge Assistant',
        skillsLearned: ['Python', 'LangChain', 'Qdrant Vector DB', 'OpenAI'],
        duration: '2 weeks'
      },
      {
        name: 'Autonomous AI Agent Workflow',
        skillsLearned: ['Python', 'CrewAI/LangGraph', 'MCP tools', 'SQLite'],
        duration: '3 weeks'
      },
      {
        name: 'Real-time Object Detection API',
        skillsLearned: ['Python', 'PyTorch', 'YOLOv8', 'FastAPI'],
        duration: '2 weeks'
      }
    ],
    resources: [
      {
        name: 'Deep Learning Specialization (Coursera)',
        difficulty: 'Intermediate',
        duration: '40 hours',
        link: 'https://deeplearning.ai'
      },
      {
        name: 'LangChain: Chat with your Data',
        difficulty: 'Beginner',
        duration: '4 hours',
        link: 'https://deeplearning.ai'
      },
      {
        name: 'Generative AI with Large Language Models',
        difficulty: 'Advanced',
        duration: '15 hours',
        link: 'https://deeplearning.ai'
      }
    ]
  },
  'data-scientist': {
    roadmap: [
      {
        month: 'Month 1: Advanced SQL & Data Wrangling',
        topics: ['SQL Analytical Windows & Subqueries', 'Pandas & NumPy data pipelines', 'Exploratory Data Analysis (EDA) Techniques']
      },
      {
        month: 'Month 2: Statistical Modeling & ML',
        topics: ['Probability & Hypothesis Testing', 'Supervised Learning Algorithms (Regression, Trees)', 'Unsupervised Learning (K-means, PCA)']
      },
      {
        month: 'Month 3: Big Data & Visualisation',
        topics: ['PySpark Distributed Computing', 'Tableau & PowerBI Dashboards', 'Storytelling with Data & Executive Presentations']
      }
    ],
    projects: [
      {
        name: 'Customer Churn Predictor',
        skillsLearned: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
        duration: '2 weeks'
      },
      {
        name: 'Sales Forecasting Dashboard',
        skillsLearned: ['Python', 'Prophet', 'Streamlit', 'SQL'],
        duration: '2 weeks'
      },
      {
        name: 'Logistics Network Optimization',
        skillsLearned: ['Python', 'SciPy', 'PuLP', 'Tableau'],
        duration: '3 weeks'
      }
    ],
    resources: [
      {
        name: 'Introduction to Statistical Learning',
        difficulty: 'Intermediate',
        duration: '25 hours',
        link: 'https://statlearning.com'
      },
      {
        name: 'Python for Data Science and Machine Learning Boot Camp',
        difficulty: 'Beginner',
        duration: '22 hours',
        link: 'https://udemy.com'
      },
      {
        name: 'Spark and Python for Big Data',
        difficulty: 'Advanced',
        duration: '15 hours',
        link: 'https://spark.apache.org'
      }
    ]
  },
  'product-manager': {
    roadmap: [
      {
        month: 'Month 1: Product Discovery & Strategy',
        topics: ['User Interview Techniques', 'Market Competitor Analysis', 'Product Vision & Strategy Frameworks']
      },
      {
        month: 'Month 2: Metrics & Analytics',
        topics: ['A/B Testing Frameworks', 'Retention & Engagement Analysis', 'SQL for Product Managers']
      },
      {
        month: 'Month 3: Agile Execution & Alignment',
        topics: ['Jira Backlog Grooming & Story Writing', 'Tech Stack Basics for PMs', 'Cross-Functional Stakeholder Management']
      }
    ],
    projects: [
      {
        name: 'Product Spec & PRD document',
        skillsLearned: ['Product Specs', 'Figma Wireframing', 'Market Sizing'],
        duration: '1 week'
      },
      {
        name: 'Mobile App Feature Redesign',
        skillsLearned: ['User Research', 'A/B Test Design', 'Amplitude Analytics'],
        duration: '2 weeks'
      }
    ],
    resources: [
      {
        name: 'Product Management First Steps (LinkedIn)',
        difficulty: 'Beginner',
        duration: '5 hours',
        link: 'https://linkedin.com'
      },
      {
        name: 'Product Analytics Certification (Mixpanel)',
        difficulty: 'Intermediate',
        duration: '8 hours',
        link: 'https://mixpanel.com'
      },
      {
        name: 'Agile Product Owner Role (Scrum Alliance)',
        difficulty: 'Advanced',
        duration: '12 hours',
        link: 'https://scrumalliance.org'
      }
    ]
  }
};
