import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { CAREER_ROLES } from '../data/roles';
import { 
  Search, 
  TrendingUp, 
  Building2, 
  ArrowUpDown, 
  Sparkles
} from 'lucide-react';

interface SkillAnalytics {
  name: string;
  growth: number;
  demandLevel: 'Very High' | 'High' | 'Medium' | 'Low';
  priority: 'High' | 'Medium' | 'Low';
  history: number[];
}

interface RoleAnalytics {
  marketGrowth: number;
  demandScore: number;
  avgSalary: string;
  jobPostings: string;
  skills: SkillAnalytics[];
  companies: {
    name: string;
    isHiring: boolean;
  }[];
}

const ROLE_ANALYTICS: Record<string, RoleAnalytics> = {
  'ai-ml': {
    marketGrowth: 28,
    demandScore: 94,
    avgSalary: '$165,000',
    jobPostings: '2,450',
    skills: [
      { name: 'LangGraph', growth: 40, demandLevel: 'Very High', priority: 'High', history: [12, 18, 25, 30, 36, 40] },
      { name: 'Vector Databases', growth: 38, demandLevel: 'Very High', priority: 'High', history: [10, 15, 22, 28, 33, 38] },
      { name: 'Python', growth: 35, demandLevel: 'High', priority: 'High', history: [15, 20, 24, 28, 32, 35] },
      { name: 'TensorFlow', growth: 30, demandLevel: 'High', priority: 'Medium', history: [8, 12, 18, 22, 26, 30] },
      { name: 'PyTorch', growth: 27, demandLevel: 'High', priority: 'Medium', history: [5, 10, 15, 19, 23, 27] }
    ],
    companies: [
      { name: 'OpenAI', isHiring: true },
      { name: 'NVIDIA', isHiring: true },
      { name: 'Google', isHiring: true },
      { name: 'Anthropic', isHiring: true },
      { name: 'Microsoft', isHiring: false }
    ]
  },
  'frontend': {
    marketGrowth: 18,
    demandScore: 86,
    avgSalary: '$128,000',
    jobPostings: '3,120',
    skills: [
      { name: 'TypeScript', growth: 32, demandLevel: 'Very High', priority: 'High', history: [10, 15, 20, 24, 28, 32] },
      { name: 'React Server Components', growth: 28, demandLevel: 'Very High', priority: 'High', history: [5, 10, 14, 18, 23, 28] },
      { name: 'Vite', growth: 25, demandLevel: 'High', priority: 'Medium', history: [8, 12, 16, 19, 22, 25] },
      { name: 'Next.js', growth: 22, demandLevel: 'High', priority: 'High', history: [6, 10, 13, 16, 19, 22] },
      { name: 'Tailwind CSS', growth: 18, demandLevel: 'Medium', priority: 'Medium', history: [4, 7, 10, 12, 15, 18] }
    ],
    companies: [
      { name: 'Vercel', isHiring: true },
      { name: 'Meta', isHiring: true },
      { name: 'Stripe', isHiring: true },
      { name: 'Netlify', isHiring: false },
      { name: 'Airbnb', isHiring: true }
    ]
  },
  'backend': {
    marketGrowth: 20,
    demandScore: 89,
    avgSalary: '$138,000',
    jobPostings: '2,890',
    skills: [
      { name: 'Rust Axum', growth: 42, demandLevel: 'Very High', priority: 'High', history: [12, 18, 24, 30, 36, 42] },
      { name: 'Go (Golang)', growth: 35, demandLevel: 'Very High', priority: 'High', history: [10, 15, 21, 26, 31, 35] },
      { name: 'Docker & Kubernetes', growth: 24, demandLevel: 'High', priority: 'High', history: [6, 10, 14, 18, 21, 24] },
      { name: 'gRPC', growth: 20, demandLevel: 'Medium', priority: 'Medium', history: [5, 8, 12, 15, 18, 20] },
      { name: 'PostgreSQL', growth: 18, demandLevel: 'Medium', priority: 'Medium', history: [4, 7, 10, 13, 16, 18] }
    ],
    companies: [
      { name: 'Stripe', isHiring: true },
      { name: 'Netflix', isHiring: true },
      { name: 'Google', isHiring: true },
      { name: 'Amazon', isHiring: false },
      { name: 'HashiCorp', isHiring: true }
    ]
  },
  'fullstack': {
    marketGrowth: 22,
    demandScore: 91,
    avgSalary: '$142,000',
    jobPostings: '4,150',
    skills: [
      { name: 'Next.js App Router', growth: 30, demandLevel: 'Very High', priority: 'High', history: [8, 12, 17, 22, 26, 30] },
      { name: 'TypeScript', growth: 28, demandLevel: 'High', priority: 'High', history: [8, 12, 16, 20, 24, 28] },
      { name: 'Docker', growth: 22, demandLevel: 'High', priority: 'Medium', history: [6, 9, 13, 16, 19, 22] },
      { name: 'PostgreSQL', growth: 20, demandLevel: 'Medium', priority: 'Medium', history: [5, 8, 11, 14, 17, 20] },
      { name: 'tRPC & GraphQL', growth: 15, demandLevel: 'Medium', priority: 'Medium', history: [3, 6, 9, 11, 13, 15] }
    ],
    companies: [
      { name: 'Vercel', isHiring: true },
      { name: 'Stripe', isHiring: true },
      { name: 'Supabase', isHiring: true },
      { name: 'Linear', isHiring: true },
      { name: 'Prisma', isHiring: false }
    ]
  },
  'data-scientist': {
    marketGrowth: 15,
    demandScore: 82,
    avgSalary: '$132,000',
    jobPostings: '1,740',
    skills: [
      { name: 'PySpark', growth: 28, demandLevel: 'High', priority: 'High', history: [6, 10, 15, 19, 24, 28] },
      { name: 'Machine Learning Pipelines', growth: 24, demandLevel: 'High', priority: 'High', history: [5, 9, 13, 17, 21, 24] },
      { name: 'Python (Pandas/NumPy)', growth: 20, demandLevel: 'High', priority: 'High', history: [5, 8, 11, 14, 17, 20] },
      { name: 'SQL Query Optimization', growth: 15, demandLevel: 'Medium', priority: 'Medium', history: [3, 6, 9, 11, 13, 15] },
      { name: 'Tableau & BI Reporting', growth: 12, demandLevel: 'Medium', priority: 'Medium', history: [2, 4, 7, 9, 11, 12] }
    ],
    companies: [
      { name: 'Snowflake', isHiring: true },
      { name: 'Databricks', isHiring: true },
      { name: 'Meta', isHiring: true },
      { name: 'Google', isHiring: false },
      { name: 'Uber', isHiring: true }
    ]
  },
  'product-manager': {
    marketGrowth: 12,
    demandScore: 80,
    avgSalary: '$145,000',
    jobPostings: '1,120',
    skills: [
      { name: 'Data Analytics (Mixpanel/Amplitude)', growth: 24, demandLevel: 'High', priority: 'High', history: [5, 9, 13, 17, 21, 24] },
      { name: 'A/B Testing', growth: 18, demandLevel: 'High', priority: 'High', history: [4, 7, 10, 13, 16, 18] },
      { name: 'User Research', growth: 12, demandLevel: 'Medium', priority: 'Medium', history: [2, 4, 6, 8, 10, 12] },
      { name: 'Product Strategy & PRDs', growth: 10, demandLevel: 'Medium', priority: 'Medium', history: [2, 4, 6, 8, 9, 10] },
      { name: 'Agile Methodologies', growth: 8, demandLevel: 'Low', priority: 'Medium', history: [1, 3, 4, 6, 7, 8] }
    ],
    companies: [
      { name: 'Linear', isHiring: true },
      { name: 'Atlassian', isHiring: true },
      { name: 'Notion', isHiring: true },
      { name: 'Figma', isHiring: true },
      { name: 'Google', isHiring: false }
    ]
  }
};

export const Trends: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ai-ml');
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Table sorting & searching states
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<'rank' | 'name' | 'growth' | 'demandLevel' | 'priority'>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Load user's target role on mount if available
  useEffect(() => {
    const rawInput = localStorage.getItem('cc_assessment_input');
    if (rawInput) {
      try {
        const input = JSON.parse(rawInput);
        if (input.targetRole && ROLE_ANALYTICS[input.targetRole]) {
          setSelectedRoleId(input.targetRole);
        }
      } catch (e) {
        setSelectedRoleId('ai-ml');
      }
    }
  }, []);

  const handleRoleChange = (roleId: string) => {
    setIsUpdating(true);
    setSelectedRoleId(roleId);
    setTableSearch('');
    setTimeout(() => {
      setIsUpdating(false);
    }, 250);
  };

  const handleSort = (field: 'rank' | 'name' | 'growth' | 'demandLevel' | 'priority') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter role list by sidebar search input
  const filteredRolesList = CAREER_ROLES.filter(role => 
    role.name.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  const activeData = ROLE_ANALYTICS[selectedRoleId] || ROLE_ANALYTICS['backend'];

  // Map ranking and perform table filtering/sorting
  const filteredAndSortedSkills = activeData.skills
    .map((skill, index) => ({ ...skill, rank: index + 1 }))
    .filter(s => s.name.toLowerCase().includes(tableSearch.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'growth') {
        comparison = a.growth - b.growth;
      } else if (sortField === 'demandLevel') {
        comparison = a.demandLevel.localeCompare(b.demandLevel);
      } else if (sortField === 'priority') {
        comparison = a.priority.localeCompare(b.priority);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Format 6-month historical data points for the AreaChart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const chartData = months.map((month, idx) => {
    const dataPoint: Record<string, any> = { name: month };
    activeData.skills.forEach(skill => {
      dataPoint[skill.name] = skill.history[idx] !== undefined ? skill.history[idx] : 0;
    });
    return dataPoint;
  });

  const lineColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="max-w-[1700px] mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-border text-[10px] uppercase font-bold text-primary mb-3 w-fit tracking-wider">
            <Sparkles className="w-3 h-3 text-slate-600" />
            <span>Market Intelligence Platform</span>
          </div>
          <h2 className="text-2xl font-bold text-primary">Career Analytics Dashboard</h2>
          <p className="text-xs text-text mt-1">
            Real-time upskilling metrics, historical demand indicators, and trending capabilities across core roles.
          </p>
        </div>
      </div>

      {/* Main Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT PANEL — Sticky Career Role Directory */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4 bg-white border border-border rounded-xl p-4 shadow-xs">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 px-1">
              Role Playbook Directory
            </h3>
            {/* Search filter for sidebar */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={roleSearchQuery}
                onChange={(e) => setRoleSearchQuery(e.target.value)}
                placeholder="Search career path..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-border rounded-md text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-primary font-medium"
              />
            </div>
          </div>

          {/* Desktop/Tablet Vertical Navigation List */}
          <div className="hidden md:flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredRolesList.map((role) => {
              const roleMeta = ROLE_ANALYTICS[role.id] || { marketGrowth: 15 };
              const isActive = selectedRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'text-text hover:text-primary hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">{role.name}</span>
                  <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 shrink-0 ${
                    isActive ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    +{roleMeta.marketGrowth}%
                  </span>
                </button>
              );
            })}
            {filteredRolesList.length === 0 && (
              <p className="text-center text-[11px] text-text italic py-4">No matching roles.</p>
            )}
          </div>

          {/* Mobile Dropdown Menu Selector */}
          <div className="block md:hidden">
            <label htmlFor="role-select" className="sr-only">Choose a Career Path</label>
            <select
              id="role-select"
              value={selectedRoleId}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full p-2 border border-border bg-white rounded-lg text-xs font-semibold text-primary"
            >
              {CAREER_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT CONTENT PANEL — BI Analytics Dashboard */}
        <div className={`lg:col-span-3 space-y-6 transition-opacity duration-200 ${
          isUpdating ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          
          {/* SECTION 1 — KPI Metrics row */}
          <div className="flex md:grid md:grid-cols-4 overflow-x-auto gap-4 pb-2 md:pb-0 scrollbar-none snap-x w-full">
            {/* KPI 1: Market Growth */}
            <div className="border border-border bg-white p-4 rounded-xl shadow-xs min-w-[200px] md:min-w-0 flex-1 snap-start hover:border-slate-400 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Market Growth
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary">
                  +{activeData.marketGrowth}%
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  YoY
                </span>
              </div>
              <span className="text-[9px] text-text block mt-1">Accelerating demand index</span>
            </div>

            {/* KPI 2: Demand Score */}
            <div className="border border-border bg-white p-4 rounded-xl shadow-xs min-w-[200px] md:min-w-0 flex-1 snap-start hover:border-slate-400 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Demand Score
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-primary">
                  {activeData.demandScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/100</span>
              </div>
              <span className="text-[9px] text-text block mt-1">Extremely high hiring signal</span>
            </div>

            {/* KPI 3: Avg Salary */}
            <div className="border border-border bg-white p-4 rounded-xl shadow-xs min-w-[200px] md:min-w-0 flex-1 snap-start hover:border-slate-400 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Average Salary
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">
                  {activeData.avgSalary}
                </span>
              </div>
              <span className="text-[9px] text-text block mt-1">Mid-to-senior target band</span>
            </div>

            {/* KPI 4: Open Postings */}
            <div className="border border-border bg-white p-4 rounded-xl shadow-xs min-w-[200px] md:min-w-0 flex-1 snap-start hover:border-slate-400 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Open Job Postings
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-primary">
                  {activeData.jobPostings}
                </span>
              </div>
              <span className="text-[9px] text-text block mt-1">Active listings this week</span>
            </div>
          </div>

          {/* PRIMARY CHART: Skill Demand Trajectory Area Chart */}
          <div className="border border-border bg-white p-5 rounded-xl shadow-xs flex flex-col justify-between w-full">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                Skill Growth Trajectory (H1 2026)
              </h4>
              <p className="text-[10px] text-text mb-4">Adoption growth curve over the last 6 months relative to baseline requirements.</p>
            </div>

            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {activeData.skills.map((skill, idx) => (
                      <linearGradient key={skill.name} id={`color_${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={lineColors[idx % lineColors.length]} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={lineColors[idx % lineColors.length]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `+${val}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                      color: '#0f172a'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}
                    formatter={(value: any) => [`+${value}%`, 'Growth']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="square"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', color: '#64748b', paddingTop: '10px' }}
                  />
                  {activeData.skills.map((skill, idx) => (
                    <Area
                      key={skill.name}
                      type="monotone"
                      dataKey={skill.name}
                      stroke={lineColors[idx % lineColors.length]}
                      fillOpacity={1}
                      fill={`url(#color_${idx})`}
                      strokeWidth={1.5}
                      name={skill.name}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECTION 3 — Hiring Companies */}
          <div className="border border-border bg-white p-5 rounded-xl shadow-xs">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Target Hiring Presence
            </h4>
            <p className="text-[10px] text-text mb-4">Leading organizations actively recruiting or building specialized teams for this path.</p>
            
            <div className="flex flex-wrap gap-2">
              {activeData.companies.map((company) => (
                <div 
                  key={company.name} 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 border border-border rounded-lg text-xs font-semibold text-primary transition-all cursor-default"
                >
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-200 text-slate-700 rounded-full text-[9px] font-bold uppercase shrink-0">
                    {company.name.charAt(0)}
                  </span>
                  <span>{company.name}</span>
                  {company.isHiring && (
                    <span className="flex h-1.5 w-1.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4 — Skills Table */}
          <div className="border border-border bg-white rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-1">
                  Skills Evaluation Table
                </h4>
                <p className="text-[10px] text-text">Ranked metrics, demand categories, and study priority tags.</p>
              </div>

              {/* Table search input */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-border rounded-md text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-primary font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[9px] select-none">
                    <th 
                      onClick={() => handleSort('rank')} 
                      className="py-3 px-4 w-20 cursor-pointer hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Rank
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('name')} 
                      className="py-3 px-4 cursor-pointer hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Skill
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('growth')} 
                      className="py-3 px-4 cursor-pointer hover:text-primary transition-colors text-right"
                    >
                      <div className="flex items-center gap-1 justify-end">
                        Growth
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('demandLevel')} 
                      className="py-3 px-4 cursor-pointer hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Demand Level
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('priority')} 
                      className="py-3 px-4 cursor-pointer hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Priority
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAndSortedSkills.map((skill) => (
                    <tr key={skill.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-500">
                        #{skill.rank}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary">
                        {skill.name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                        +{skill.growth}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          skill.demandLevel === 'Very High' 
                            ? 'text-blue-700 bg-blue-50 border border-blue-100' 
                            : 'text-slate-700 bg-slate-50 border border-slate-100'
                        }`}>
                          {skill.demandLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          skill.priority === 'High' 
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                            : 'text-amber-700 bg-amber-50 border border-amber-100'
                        }`}>
                          {skill.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedSkills.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-text italic">
                        No matching skills found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
