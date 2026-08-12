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
        duration: '2 weeks',
        description: 'Build a high-performance URL shortener with custom alias generation, rate limiting, and Redis analytics tracking.'
      },
      {
        name: 'Distributed In-Memory Cache',
        skillsLearned: ['Go', 'TCP/UDP Networking', 'Concurrency', 'Mutexes'],
        duration: '3 weeks',
        description: 'Implement a peer-to-peer distributed cache engine using TCP socket communication, LRU eviction, and thread safety.'
      },
      {
        name: 'AI Resume Analyzer API',
        skillsLearned: ['Python', 'LangChain', 'OpenAI API', 'Docker'],
        duration: '2 weeks',
        description: 'Design a REST API service that parses PDF resumes, extracts key skills, and performs semantic gap analysis.'
      },
      {
        name: 'Event-Driven Order Processing Engine',
        skillsLearned: ['Java/Spring Boot', 'Kafka', 'RabbitMQ', 'PostgreSQL'],
        duration: '3 weeks',
        description: 'Construct an async event-driven checkout pipeline utilizing message queues for payment processing and stock updates.'
      },
      {
        name: 'API Gateway & Rate Limiter',
        skillsLearned: ['Node.js', 'Redis Token Bucket', 'JWT Auth', 'Nginx'],
        duration: '2 weeks',
        description: 'Develop a reverse proxy API Gateway implementing dynamic rate limiting, authentication verification, and route routing.'
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
        duration: '1 week',
        description: 'Interactive analytics dashboard featuring real-time data visualisations, dark mode themes, and filterable data tables.'
      },
      {
        name: 'Collaborative Docs Editor',
        skillsLearned: ['Next.js', 'WebSockets', 'Yjs CRDTs', 'Tailwind'],
        duration: '3 weeks',
        description: 'Multi-user real-time document editor supporting concurrent editing cursor presence and rich text formatting.'
      },
      {
        name: 'Interactive Component Library',
        skillsLearned: ['React', 'TypeScript', 'Storybook', 'Tailwind CSS'],
        duration: '2 weeks',
        description: 'Publishable UI component design system documented in Storybook with full keyboard accessibility and theme customization.'
      },
      {
        name: 'E-Commerce Storefront with Next.js',
        skillsLearned: ['Next.js App Router', 'Stripe API', 'Zustand', 'Tailwind'],
        duration: '2 weeks',
        description: 'Lightning-fast server-rendered e-commerce platform with cart management, search filtering, and secure Stripe checkout.'
      },
      {
        name: 'Kanban Task Board with Drag & Drop',
        skillsLearned: ['React', 'dnd-kit', 'TypeScript', 'LocalStorage'],
        duration: '1 week',
        description: 'Trello-style drag-and-drop project management board with custom columns, task labels, and optimistic updates.'
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
        duration: '3 weeks',
        description: 'Full-stack marketplace with user authentication, product catalog, shopping cart, and Stripe payment gateway.'
      },
      {
        name: 'Real-time Chat Application',
        skillsLearned: ['Node.js', 'Socket.io', 'React', 'MongoDB'],
        duration: '2 weeks',
        description: 'Real-time messaging platform supporting direct messages, group chat rooms, image attachments, and typing status.'
      },
      {
        name: 'AI-Powered Job Board',
        skillsLearned: ['Next.js', 'Prisma', 'PostgreSQL', 'Gemini API'],
        duration: '3 weeks',
        description: 'Recruitment portal featuring AI resume matching score calculation, applicant tracking, and automated candidate summaries.'
      },
      {
        name: 'DevOps Automated Deployment Portal',
        skillsLearned: ['React', 'Node.js', 'Docker API', 'AWS S3'],
        duration: '2 weeks',
        description: 'Web portal for developers to deploy containerized web services, monitor health logs, and view server metrics.'
      },
      {
        name: 'Social Content Media Platform',
        skillsLearned: ['Next.js', 'GraphQL', 'PostgreSQL', 'Redis'],
        duration: '3 weeks',
        description: 'Full-featured social network with post creation, media upload, upvoting algorithms, nested comments, and user profiles.'
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
        duration: '2 weeks',
        description: 'Question-answering assistant over custom enterprise documents built with semantic vector embeddings and LLM reranking.'
      },
      {
        name: 'Autonomous AI Agent Workflow',
        skillsLearned: ['Python', 'CrewAI/LangGraph', 'MCP tools', 'SQLite'],
        duration: '3 weeks',
        description: 'Multi-agent orchestration pipeline performing automated web research, content drafting, and code generation.'
      },
      {
        name: 'Real-time Object Detection API',
        skillsLearned: ['Python', 'PyTorch', 'YOLOv8', 'FastAPI'],
        duration: '2 weeks',
        description: 'Computer vision REST service detecting objects in live video streams with bounding box visualisations.'
      },
      {
        name: 'Fine-Tuned Domain LLM Evaluator',
        skillsLearned: ['Python', 'HuggingFace PEFT/LoRA', 'MLflow', 'CUDA'],
        duration: '3 weeks',
        description: 'Fine-tune an open-source LLM (Llama 3 / Mistral) on domain-specific datasets and measure perplexity and accuracy.'
      },
      {
        name: 'AI Code Assistant & Linter',
        skillsLearned: ['Python', 'Tree-Sitter', 'FastAPI', 'Vector Search'],
        duration: '2 weeks',
        description: 'Code intelligence extension tool providing automated code refactoring, bug detection, and documentation generation.'
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
        duration: '2 weeks',
        description: 'Predictive classification model identifying customer churn risks using XGBoost and SHAP feature importance visualisations.'
      },
      {
        name: 'Sales Forecasting Dashboard',
        skillsLearned: ['Python', 'Prophet', 'Streamlit', 'SQL'],
        duration: '2 weeks',
        description: 'Time-series forecasting web application predicting quarterly revenue trends with confidence intervals.'
      },
      {
        name: 'Logistics Network Optimization',
        skillsLearned: ['Python', 'SciPy', 'PuLP', 'Tableau'],
        duration: '3 weeks',
        description: 'Linear programming optimization model reducing supply chain transport costs across warehouse distribution hubs.'
      },
      {
        name: 'Fraud Detection Analytics Engine',
        skillsLearned: ['PySpark', 'SQL', 'Imbalanced-Learn', 'PowerBI'],
        duration: '2 weeks',
        description: 'Big data anomaly detection pipeline identifying credit card transaction fraud patterns in large stream datasets.'
      },
      {
        name: 'A/B Test Experimentation Toolkit',
        skillsLearned: ['Python', 'SciPy Stats', 'Streamlit', 'Pandas'],
        duration: '1 week',
        description: 'Statistical analysis tool calculating sample sizes, p-values, confidence bounds, and minimum detectable effects.'
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
        duration: '1 week',
        description: 'Comprehensive Product Requirement Document defining feature scope, user personas, wireframes, and launch KPIs.'
      },
      {
        name: 'Mobile App Feature Redesign',
        skillsLearned: ['User Research', 'A/B Test Design', 'Amplitude Analytics'],
        duration: '2 weeks',
        description: 'UX wireframing redesign targeting onboarding drop-offs, backed by quantitative retention cohort data analysis.'
      },
      {
        name: 'SaaS Pricing & Packaging Strategy',
        skillsLearned: ['Pricing Strategy', 'Conjoint Analysis', 'Financial Modeling'],
        duration: '2 weeks',
        description: 'Formulate tiered subscription pricing plans based on customer value metrics, willingness-to-pay research, and ARR forecasts.'
      },
      {
        name: 'Product Launch GTM Roadmap',
        skillsLearned: ['GTM Strategy', 'Competitive Analysis', 'User Stories'],
        duration: '2 weeks',
        description: 'Create a Go-To-Market strategy detailing positioning, launch channels, sales enablement collateral, and success metrics.'
      },
      {
        name: 'Customer Funnel Conversion Audit',
        skillsLearned: ['Mixpanel', 'Google Analytics', 'SQL', 'Conversion Rate Optimization'],
        duration: '1 week',
        description: 'Perform funnel conversion audit identifying user drop-off bottlenecks and proposing prioritized backlog experiments.'
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
