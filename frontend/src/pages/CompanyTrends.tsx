import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, Award, GraduationCap, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AssessmentData } from '../types';

interface FirmSkill {
  name: string;
  demand: string;
  reason: string;
}

interface FirmRoleData {
  roleName: string;
  skills: FirmSkill[];
  architecture: string;
  interviewFocus: string[];
  openings: string[];
}

interface FirmData {
  id: string;
  name: string;
  logoColor: string;
  description: string;
  roles: Record<string, FirmRoleData>;
}

const FIRMS_DATA: FirmData[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logoColor: 'bg-emerald-600 text-white',
    description: 'Leading AI research and deployment company, creator of GPT-4, ChatGPT, and Swarm frameworks.',
    roles: {
      'ai-ml': {
        roleName: 'AI/ML Engineer',
        skills: [
          { name: 'Agentic AI Systems', demand: '98%', reason: 'Designing autonomous multi-agent networks, reasoning loops, and function calling tools.' },
          { name: 'Triton & GPU Kernels', demand: '94%', reason: 'Writing custom GPU kernels in Python/Triton to bypass CUDA memory bandwidth constraints.' },
          { name: 'PyTorch & CUDA', demand: '90%', reason: 'Distributed neural network training, model scaling, and Tensor parallelism.' }
        ],
        architecture: 'OpenAI runs massive Kubernetes clusters on Microsoft Azure, leveraging Triton for customized GPU compilation and Ray/Megatron-LM for orchestrating large-scale training runs.',
        interviewFocus: [
          'Custom attention kernel design using Triton.',
          'Model parallelism (Tensor, Pipeline, and Sequence Parallelism) scaling theory.',
          'Distributed training debugging, communication primitives (AllReduce, ReduceScatter).'
        ],
        openings: ['Senior Research Engineer, Scaling Laws', 'Member of Technical Staff, Agentic Architecture', 'AI Infrastructure Specialist']
      },
      'frontend': {
        roleName: 'Frontend Engineer',
        skills: [
          { name: 'Next.js & Server Components', demand: '92%', reason: 'Optimizing ChatGPT web app render speeds, token streaming, and hydration performance.' },
          { name: 'TypeScript Strict Mode', demand: '89%', reason: 'Ensuring strict state validations and typing across complex real-time streaming sockets.' },
          { name: 'Tailwind CSS', demand: '85%', reason: 'Building sleek, fluid developer consoles, playgrounds, and minimalist chat interfaces.' }
        ],
        architecture: 'Next.js application shell hosted on Vercel/Azure, communicating with LLM orchestration layers via Server-Sent Events (SSE) for sub-millisecond response streaming.',
        interviewFocus: [
          'Managing stream buffers and real-time canvas rendering in React.',
          'Web workers for off-thread markdown parsing and code execution styling.',
          'Server-side rendering optimization for SEO and developer portals.'
        ],
        openings: ['Frontend Engineer, ChatGPT Consumer Web', 'Staff Engineer, Developer Playground', 'UX Engineer, API Tooling']
      },
      'backend': {
        roleName: 'Backend Engineer',
        skills: [
          { name: 'Go (Golang)', demand: '91%', reason: 'Writing high-throughput API gateway proxies and rate-limiting middleware.' },
          { name: 'Python & FastAPI', demand: '88%', reason: 'Serving LLM pipeline endpoints and writing sandbox Python execution engines.' },
          { name: 'gRPC & Microservices', demand: '86%', reason: 'Orchestrating microservice requests between API clients and model hosting servers.' }
        ],
        architecture: 'Highly concurrent Go-based API routing tier managing user authentication, rate limits, and routing requests to Python-based PyTorch inference environments.',
        interviewFocus: [
          'Designing rate-limiting algorithms for high-throughput public endpoints.',
          'Handling concurrent streams and SSE connection lifecycles in Go.',
          'Database optimization for billing log ingestion and API request metadata.'
        ],
        openings: ['Backend Engineer, API Infrastructure', 'Infrastructure Engineer, Code Sandbox Runtime', 'Staff Engineer, Global Gateway Routing']
      }
    }
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logoColor: 'bg-indigo-600 text-white',
    description: 'Financial infrastructure platform for the internet, handling hundreds of billions in transactions.',
    roles: {
      'ai-ml': {
        roleName: 'AI/ML Engineer',
        skills: [
          { name: 'Vector Search & RAG', demand: '85%', reason: 'Parsing documentation schemas for developer assistants and automated support flows.' },
          { name: 'Python & Pandas', demand: '82%', reason: 'Building fraud-detection pipelines, transaction scoring models, and ledger drift classifiers.' },
          { name: 'SQL & Database Optimization', demand: '80%', reason: 'Interfacing models directly with massive transactional data warehouses.' }
        ],
        architecture: 'Machine learning training run on AWS clusters, with inference engines embedded directly inside Ruby/Java transaction processors for real-time risk scores.',
        interviewFocus: [
          'Developing low-latency fraud-detection classifiers.',
          'Feature engineering for transaction stream anomaly checking.',
          'Designing retrieval-augmented generation architectures for structured payment documentation.'
        ],
        openings: ['AI Engineer, Risk and Fraud Detection', 'Machine Learning Platform Engineer', 'Data Scientist, Financial Intelligence']
      },
      'frontend': {
        roleName: 'Frontend Engineer',
        skills: [
          { name: 'TypeScript Strict Mode', demand: '95%', reason: 'Enforcing type-safety on financial dashboards, invoices, and checkout widgets.' },
          { name: 'React & Tailwind CSS', demand: '91%', reason: 'Building dashboard elements, custom checkout drawers, and modular card elements.' },
          { name: 'Framer Motion', demand: '86%', reason: 'Sleek, fluid micro-animations on Stripe Dashboards and marketing assets.' }
        ],
        architecture: 'Single Page Applications built with React and custom strict TypeScript modules, communicating with REST APIs and utilizing CSS variables for styling schemes.',
        interviewFocus: [
          'State management under ledger constraints.',
          'Creating accessible (WCAG compliant) custom form fields for credit card ingestion.',
          'Performance metrics and asset size budgets for Stripe Elements embed widgets.'
        ],
        openings: ['Frontend Software Engineer, Dashboard Core', 'Staff Designer & Developer, Checkout Experience', 'UI Developer, Developer Documentation Portals']
      },
      'backend': {
        roleName: 'Backend Engineer',
        skills: [
          { name: 'Ruby on Rails', demand: '92%', reason: 'Maintaining core payment ledgers, invoice engines, and public API interfaces.' },
          { name: 'Go (Golang)', demand: '88%', reason: 'Rewriting low-latency core pipelines, consensus modules, and rate-limiting filters.' },
          { name: 'Kafka & Event Streams', demand: '85%', reason: 'Broadcasting transactions to risk engines, ledger recorders, and email services.' }
        ],
        architecture: 'Highly standardized Ruby core service backed by MongoDB/Postgres, wrapping microservice migrations in Go for transaction routing, coordinated using Kafka.',
        interviewFocus: [
          'Designing distributed transaction processing logic with retry mechanisms.',
          'Idempotency key configurations in public APIs to prevent double charges.',
          'Event-driven architecture scalability under strict read/write database locks.'
        ],
        openings: ['Backend Engineer, Payments Core', 'Software Engineer, Billing Infrastructure', 'Distributed Systems Architect, Ledger Services']
      }
    }
  },
  {
    id: 'google',
    name: 'Google',
    logoColor: 'bg-blue-600 text-white',
    description: 'Global technology giant, builder of Android, Search, and Google Cloud, hosting massive web infrastructures.',
    roles: {
      'ai-ml': {
        roleName: 'AI/ML Engineer',
        skills: [
          { name: 'JAX & XLA', demand: '94%', reason: 'Compiling neural networks using accelerated linear algebra compiler pipelines for TPUs.' },
          { name: 'TensorFlow & PyTorch', demand: '86%', reason: 'Supporting model creation across Google Research and Google Cloud integrations.' },
          { name: 'TPU Hardware Parallelism', demand: '84%', reason: 'Configuring models to distribute tensors over TPU pod topologies.' }
        ],
        architecture: 'Deep Learning models executed in Google Cloud TPU pods, compiled using XLA, and integrated into Search/Gemini via custom internal distributed runtimes.',
        interviewFocus: [
          'Writing accelerator code and managing memory layouts in JAX.',
          'TPU hardware alignment optimization.',
          'Attention mechanism math and scaling parameters.'
        ],
        openings: ['AI Research Engineer, Gemini Architecture', 'Software Engineer, TPU Compiler Integration', 'Cloud AI Solutions Architect']
      },
      'frontend': {
        roleName: 'Frontend Engineer',
        skills: [
          { name: 'TypeScript & Angular/React', demand: '90%', reason: 'Developing responsive UI screens for Google Cloud Console and workspace applications.' },
          { name: 'WebAssembly (Wasm)', demand: '84%', reason: 'Enabling high-performance C++ core components to run inside Chrome tabs.' },
          { name: 'Vite & Rollup Build Systems', demand: '81%', reason: 'Managing bundle compilation paths and dependency injection limits.' }
        ],
        architecture: 'Large-scale monorepo systems built with Angular, Lit, and React, bundled via optimized bazel pipelines, served from Google Edge Network nodes.',
        interviewFocus: [
          'Virtual DOM vs. direct DOM manipulation optimizations.',
          'Custom Web Component architecture and shadow DOM encapsulation.',
          'Webpack/Vite compiler hook design for tree-shaking dead code.'
        ],
        openings: ['Frontend Developer, Google Cloud Console', 'Software Engineer, Google Docs Workspace Core', 'UI Engineer, Chrome Developer Tools']
      },
      'backend': {
        roleName: 'Backend Engineer',
        skills: [
          { name: 'Go & C++', demand: '93%', reason: 'Interfacing with core storage, networking layers, and Google File System abstractions.' },
          { name: 'Spanner & Bigtable', demand: '90%', reason: 'Handling globally distributed relational transactional tables with atomic clocks.' },
          { name: 'Docker & Kubernetes', demand: '87%', reason: 'Orchestrating services using Borg/Kubernetes container pools at scale.' }
        ],
        architecture: 'Massive globally distributed backend microservices written in C++/Go, running in Borg container pools, utilizing Stubby/gRPC RPC frameworks.',
        interviewFocus: [
          'Designing distributed consensus patterns (Paxus, Raft).',
          'Database design matching Google Spanner true-time principles.',
          'System load balancing and fault tolerance under network partition outages.'
        ],
        openings: ['Software Engineer, Borg Container Core', 'Distributed Database Engineer, Spanner', 'Systems Architect, YouTube Streaming Network']
      }
    }
  },
  {
    id: 'meta',
    name: 'Meta',
    logoColor: 'bg-sky-600 text-white',
    description: 'Social technology platform, creator of React, Llama models, PyTorch, and developer of global social networks.',
    roles: {
      'ai-ml': {
        roleName: 'AI/ML Engineer',
        skills: [
          { name: 'PyTorch Core', demand: '95%', reason: 'Implementing customized autograd functions and contributing to the open-source PyTorch ecosystem.' },
          { name: 'Llama Finetuning', demand: '91%', reason: 'Running alignment training, instruction finetuning (RLHF), and Quantization optimizations.' },
          { name: 'Ray & PyTorch Lightning', demand: '85%', reason: 'Managing distributed model scaling across clusters of H100 GPU servers.' }
        ],
        architecture: 'Custom GPU server clusters, orchestrating AI workloads using PyTorch and customized storage systems for streaming parameters during training runs.',
        interviewFocus: [
          'Finetuning open-source Llama weights (LoRA/QLoRA parameters).',
          'Profiling PyTorch memory usage to fix Out-Of-Memory (OOM) errors.',
          'Implementing customized data loading and distributed samplers.'
        ],
        openings: ['Research Scientist, Llama Scaling Team', 'PyTorch Core Engineer, Hardware Backends', 'AI Integration Lead, Messenger and Threads']
      },
      'frontend': {
        roleName: 'Frontend Engineer',
        skills: [
          { name: 'React 19 & Relay', demand: '96%', reason: 'Using declarative GraphQL queries via Relay to fetch data for dynamic UI states.' },
          { name: 'React Native & Expo', demand: '90%', reason: 'Developing responsive mobile screens for Facebook, Instagram, and Threads.' },
          { name: 'TypeScript Strict Mode', demand: '88%', reason: 'Resolving strict types on large-scale modular frontend monorepos.' }
        ],
        architecture: 'Monolithic client codebase utilizing React, GraphQL, and Relay, communicating with Hack/HHVM API endpoints.',
        interviewFocus: [
          'GraphQL schema design and data normalization in Relay cache.',
          'Custom rendering hooks and concurrent React scheduler profiling.',
          'Asset lazy-loading configurations and bundle optimizations.'
        ],
        openings: ['Frontend Architect, Facebook Web Core', 'React Native Developer, Threads Mobile Team', 'Software Engineer, UI Frameworks and Tools']
      },
      'backend': {
        roleName: 'Backend Engineer',
        skills: [
          { name: 'Python & Hack/HHVM', demand: '89%', reason: 'Scaling the core web backend, business logic layers, and GraphQL servers.' },
          { name: 'Rust & C++', demand: '86%', reason: 'Rewriting key database routers, key-value stores, and compilers.' },
          { name: 'GraphQL API Design', demand: '84%', reason: 'Designing unified schema queries to serve billions of active devices.' }
        ],
        architecture: 'Hack/HHVM serving client queries from GraphQL gateways, interfacing with C++ cache tiers and globally distributed database partitions.',
        interviewFocus: [
          'GraphQL query optimization and resolving the N+1 query problem.',
          'Memcached cache design and cache coherency policies.',
          'High-throughput API schema refactoring.'
        ],
        openings: ['Backend Engineer, Threads API Infrastructure', 'Infrastructure Engineer, Hack/HHVM Compiler team', 'Systems Specialist, Media Storage Platform']
      }
    }
  }
];

export const CompanyTrends: React.FC = () => {
  const [selectedFirmId, setSelectedFirmId] = useState<string>('openai');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ai-ml');
  const [userSession, setUserSession] = useState<{ email: string; name: string } | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [simulatedApplications, setSimulatedApplications] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const rawSession = localStorage.getItem('user_session');
    if (rawSession) {
      setUserSession(JSON.parse(rawSession));
    }

    const rawInput = localStorage.getItem('cc_assessment_input');
    if (rawInput) {
      const parsedInput = JSON.parse(rawInput) as AssessmentData;
      setUserSkills(parsedInput.currentSkills || []);
    }
  }, []);

  const activeFirm = FIRMS_DATA.find(f => f.id === selectedFirmId) || FIRMS_DATA[0];
  const activeRoleData = activeFirm.roles[selectedRoleId] || activeFirm.roles['ai-ml'];

  // Calculate Match Score specifically against this firm's role requirements
  const requiredSkillNames = activeRoleData.skills.map(s => s.name);
  const matchedSkills = requiredSkillNames.filter(reqSkill =>
    userSkills.some(userSkill => userSkill.toLowerCase() === reqSkill.toLowerCase())
  );
  const missingSkills = requiredSkillNames.filter(reqSkill =>
    !userSkills.some(userSkill => userSkill.toLowerCase() === reqSkill.toLowerCase())
  );

  const totalReq = requiredSkillNames.length;
  const matchPercentage = totalReq > 0 ? Math.round((matchedSkills.length / totalReq) * 100) : 0;

  const handleApply = (jobTitle: string) => {
    setSimulatedApplications(prev => ({
      ...prev,
      [jobTitle]: true
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <h2 className="text-2xl font-bold text-primary">Company Tech Insights</h2>
        <p className="text-xs text-text mt-1">
          Explore current technology stacks, in-demand skills, and active job role match scores for top tech firms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Select Company</h3>
            <div className="flex flex-col gap-2">
              {FIRMS_DATA.map(firm => (
                <button
                  key={firm.id}
                  onClick={() => setSelectedFirmId(firm.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded border text-left transition-all ${
                    selectedFirmId === firm.id
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-border text-text hover:border-primary'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${firm.logoColor}`}>
                    {firm.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{firm.name}</div>
                    <div className={`text-[10px] ${selectedFirmId === firm.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {firm.id === 'openai' ? 'AI Research' : firm.id === 'stripe' ? 'FinTech' : 'Big Tech'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Select Target Role</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'ai-ml', name: 'AI/ML Engineer' },
                { id: 'frontend', name: 'Frontend Engineer' },
                { id: 'backend', name: 'Backend Engineer' }
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full text-left p-2.5 rounded border text-xs font-semibold transition-all ${
                    selectedRoleId === role.id
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-border text-text hover:border-primary'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-8">
          {/* Company Brief */}
          <div className="flat-card p-6 bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${activeFirm.logoColor}`}>
                {activeFirm.name}
              </span>
              <span className="text-slate-300">|</span>
              <h3 className="text-sm font-bold text-primary">{activeRoleData.roleName} Requirements</h3>
            </div>
            <p className="text-xs text-text leading-relaxed">
              {activeFirm.description}
            </p>
          </div>

          {/* User Matching Score Check */}
          <div className="flat-card p-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-500" />
              Your Compatibility Match
            </h4>

            {userSession ? (
              userSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center p-4 border border-border rounded bg-slate-50">
                    <span className="text-2xl font-black text-primary">{matchPercentage}%</span>
                    <span className="text-[10px] font-bold text-text uppercase tracking-wider mt-1">Role Match Fit</span>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase block mb-1">Matched Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.length > 0 ? (
                          matchedSkills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-text italic">None matched yet.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase block mb-1">Target Skill Gaps:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.length > 0 ? (
                          missingSkills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 border border-red-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-semibold">All skills matched! Ready to apply.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <ShieldAlert className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="text-xs text-text mb-3">You haven't added any skills to your profile yet.</p>
                  <Link to="/assess" className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-colors">
                    Add Skills Now
                  </Link>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <ShieldAlert className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs text-text mb-3">Log in to check your target alignment compatibility score against this company.</p>
                <Link to="/login" className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-slate-800 transition-colors">
                  Log In / Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Detailed In-Demand Skills List */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Trending Skills in Demand</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeRoleData.skills.map(skill => (
                <div key={skill.name} className="flat-card p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-primary">{skill.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-100 border border-slate-200 text-slate-800">
                        {skill.demand}
                      </span>
                    </div>
                    <p className="text-[11px] text-text leading-relaxed">
                      {skill.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture & Stack details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flat-card p-5">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" />
                Stack & Architectural Context
              </h4>
              <p className="text-xs text-text leading-relaxed">
                {activeRoleData.architecture}
              </p>
            </div>

            <div className="flat-card p-5">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                Interview Evaluation Focus
              </h4>
              <ul className="space-y-2">
                {activeRoleData.interviewFocus.map((focus, i) => (
                  <li key={i} className="text-xs text-text flex items-start gap-1.5">
                    <span className="text-slate-400 mt-1">•</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active Job Openings */}
          <div className="flat-card p-6">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500" />
              Simulated Active Openings
            </h4>
            <div className="space-y-3">
              {activeRoleData.openings.map(opening => (
                <div key={opening} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded border border-border hover:bg-slate-50 transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-primary">{opening}</h5>
                    <span className="text-[9px] text-text uppercase tracking-wider font-semibold block mt-0.5">
                      {activeFirm.name} • Full-time
                    </span>
                  </div>
                  <button
                    onClick={() => handleApply(opening)}
                    disabled={simulatedApplications[opening]}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded border transition-colors ${
                      simulatedApplications[opening]
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                        : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {simulatedApplications[opening] ? 'Applied (Simulated)' : 'Simulate Application'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
