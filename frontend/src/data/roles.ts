import type { CareerRole } from '../types';

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'backend',
    name: 'Backend Engineer',
    category: 'Engineering',
    requiredSkills: [
      'Java', 'Spring Boot', 'Node.js', 'Go', 'Docker', 'AWS', 'CI/CD', 
      'System Design', 'PostgreSQL', 'Redis', 'Kubernetes', 'GraphQL', 'gRPC'
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Engineer',
    category: 'Engineering',
    requiredSkills: [
      'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'Jest', 
      'Webpack', 'Vite', 'HTML5', 'CSS3', 'Framer Motion', 'REST APIs'
    ]
  },
  {
    id: 'fullstack',
    name: 'Full Stack Engineer',
    category: 'Engineering',
    requiredSkills: [
      'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Docker', 
      'AWS', 'Tailwind CSS', 'PostgreSQL', 'Git', 'System Design', 'CI/CD'
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI/ML Engineer',
    category: 'Data & AI',
    requiredSkills: [
      'Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'LangChain', 
      'CUDA', 'Agentic AI', 'MCP', 'Hugging Face', 'vector-databases', 'SQL'
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data & AI',
    requiredSkills: [
      'Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'R', 
      'Statistics', 'Spark', 'Machine Learning', 'Data Visualisation'
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product',
    requiredSkills: [
      'Product Strategy', 'Agile Methodology', 'Jira', 'Data Analytics', 
      'User Research', 'Wireframing', 'A/B Testing', 'SQL', 'Roadmapping'
    ]
  }
];
