import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, X, AlertCircle, RefreshCw, UploadCloud, CheckCircle } from 'lucide-react';
import { CAREER_ROLES } from '../data/roles';
import { performAssessment } from '../services/mockAnalysis';
import type { AssessmentData } from '../types';

const ALL_KNOWN_SKILLS = [
  'Java', 'Spring Boot', 'Node.js', 'Go', 'Docker', 'AWS', 'CI/CD', 
  'System Design', 'PostgreSQL', 'Redis', 'Kubernetes', 'GraphQL', 'gRPC',
  'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'Jest', 
  'Webpack', 'Vite', 'HTML5', 'CSS3', 'Framer Motion', 'REST APIs',
  'Express', 'MongoDB', 'Git', 'Python', 'PyTorch', 'TensorFlow', 
  'Scikit-learn', 'LangChain', 'CUDA', 'Agentic AI', 'MCP', 'Hugging Face', 
  'vector-databases', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'R', 
  'Statistics', 'Spark', 'Machine Learning', 'Data Visualisation', 
  'Product Strategy', 'Agile Methodology', 'Jira', 'Data Analytics', 
  'User Research', 'Wireframing', 'A/B Testing', 'Roadmapping'
];

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');

  // Form State
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState(CAREER_ROLES[0].id);
  const [skillInput, setSkillInput] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  
  // Resume State
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeMessage, setResumeMessage] = useState('');

  // UX State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const loadingMessages = [
    'Parsing current skill profiles...',
    'Matching skills with industry-standard roles...',
    'Identifying technical knowledge gaps...',
    'Constructing month-by-month study roadmap...',
    'Generating personalized projects and resources...'
  ];

  // Handle adding skill tags
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = skillInput.trim().replace(/,/g, '');
      if (cleaned) {
        if (currentSkills.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
          setError('Skill already added!');
          return;
        }
        setCurrentSkills([...currentSkills, cleaned]);
        setSkillInput('');
        setError('');
      }
    }
  };

  const handleAddSkillClick = () => {
    const cleaned = skillInput.trim();
    if (cleaned) {
      if (currentSkills.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
        setError('Skill already added!');
        return;
      }
      setCurrentSkills([...currentSkills, cleaned]);
      setSkillInput('');
      setError('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setResumeLoading(true);
    setError('');
    setResumeMessage('Uploading and scanning resume...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const matched: string[] = [];

      if (file.name.endsWith('.txt')) {
        ALL_KNOWN_SKILLS.forEach(skill => {
          const regex = new RegExp(`\\b${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
          if (regex.test(text)) {
            matched.push(skill);
          }
        });
      } else {
        const presetSkills = ['React', 'TypeScript', 'Git', 'HTML5', 'CSS3', 'Node.js', 'SQL'];
        const count = 4 + Math.floor(Math.random() * 3);
        matched.push(...presetSkills.slice(0, count));
      }

      setTimeout(() => {
        setResumeLoading(false);
        if (matched.length > 0) {
          const merged = Array.from(new Set([...currentSkills, ...matched]));
          setCurrentSkills(merged);
          setResumeMessage(`Extracted ${matched.length} skills from resume: ${matched.join(', ')}`);
        } else {
          setResumeMessage('Scan completed. No matching skills found in the text file.');
        }
      }, 1200);
    };

    reader.onerror = () => {
      setResumeLoading(false);
      setError('Failed to read the file.');
    };

    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        const presetSkills = ['React', 'TypeScript', 'Git', 'HTML5', 'CSS3', 'Node.js', 'SQL'];
        const count = 4 + Math.floor(Math.random() * 3);
        const matched = presetSkills.slice(0, count);
        const merged = Array.from(new Set([...currentSkills, ...matched]));
        setCurrentSkills(merged);
        setResumeLoading(false);
        setResumeMessage(`Extracted skills from ${file.name}: ${matched.join(', ')}`);
      }, 1200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRole.trim()) {
      setError('Please enter your current role.');
      return;
    }
    if (currentSkills.length === 0) {
      setError('Please add or extract at least one skill tag.');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300);

    const assessmentInput: AssessmentData = {
      currentRole: currentRole.trim(),
      targetRole,
      currentSkills
    };

    try {
      const result = await performAssessment(assessmentInput);
      localStorage.setItem('cc_assessment_input', JSON.stringify(assessmentInput));
      localStorage.setItem('cc_assessment_result', JSON.stringify(result));
      
      clearInterval(interval);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
        window.location.reload();
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError('An error occurred during assessment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Analyzing Career Path</h2>
        <p className="text-xs text-text h-6 transition-all duration-300">
          {loadingMessages[loadingStep]}
        </p>
        <div className="w-full bg-border rounded h-1 mt-6 overflow-hidden">
          <div 
            className="bg-primary h-1 rounded transition-all duration-300"
            style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded border border-border flex items-center justify-center mx-auto mb-3 bg-white text-primary">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Start Skill Assessment</h2>
        <p className="text-xs text-text mt-1">Map out your existing skillset to identify key gaps for your target position.</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-surface p-6 rounded space-y-5">
        {/* Current Role */}
        <div>
          <label htmlFor="current-role" className="block text-xs font-semibold text-primary mb-1">
            Current Role
          </label>
          <input
            type="text"
            id="current-role"
            placeholder="e.g. Junior Developer, Student, Freelancer"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Target Role */}
        <div>
          <label htmlFor="target-role" className="block text-xs font-semibold text-primary mb-1">
            Target Role
          </label>
          <select
            id="target-role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
          >
            {CAREER_ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab selection */}
        <div>
          <label className="block text-xs font-semibold text-primary mb-2">
            Skill Set Input Method
          </label>
          <div className="border-b border-border flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-primary'
              }`}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-primary'
              }`}
            >
              Upload Resume
            </button>
          </div>

          {/* Manual input UI */}
          {activeTab === 'manual' && (
            <div className="flex gap-2">
              <input
                type="text"
                id="skill-input"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 px-3 py-2 border border-border rounded bg-white text-primary text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                id="btn-add-skill"
                onClick={handleAddSkillClick}
                className="px-3 border border-border rounded bg-white hover:bg-surface text-xs font-semibold text-primary"
              >
                Add
              </button>
            </div>
          )}

          {/* Resume Upload UI */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border p-6 rounded text-center relative hover:bg-surface transition-colors">
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".txt,.pdf,.docx"
                  onChange={handleResumeUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={resumeLoading}
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="block text-sm font-semibold text-primary">
                  {resumeFile ? resumeFile.name : 'Choose a file or drag it here'}
                </span>
                <span className="block text-[10px] text-muted mt-1">
                  Supports PDF, DOCX, or TXT formats
                </span>
              </div>

              {resumeLoading && (
                <div className="flex items-center gap-2 justify-center text-xs text-text">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Scanning resume text...</span>
                </div>
              )}

              {resumeMessage && !resumeLoading && (
                <div className="flex items-start gap-1.5 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{resumeMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Display Accumulated Skills Badges */}
          <div className="mt-4">
            <span className="block text-xs font-semibold text-primary mb-2">Selected Skills ({currentSkills.length})</span>
            {currentSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 rounded bg-white border border-border">
                {currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-surface border border-border text-primary"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-text">No skills added yet. Choose an input method above to add skills.</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1.5 p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          id="btn-submit-assessment"
          className="w-full py-2.5 bg-primary text-white font-bold rounded hover:bg-slate-800 transition-colors text-sm"
        >
          Calculate Alignment
        </button>
      </form>
    </div>
  );
};
export default Assessment;
