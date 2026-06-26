import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { TrendCard } from '../components/TrendCard';
import { TECH_TRENDS } from '../data/trends';
import { ArrowRight, HelpCircle, ShieldAlert, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const featuredTrends = TECH_TRENDS.slice(0, 3);

  return (
    <div className="w-full pb-20">
      {/* Hero Header */}
      <Hero />

      {/* Problem Statement Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text">The Challenge</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-2 mb-6 font-sans">
              Why Upskilling is Difficult
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-primary shrink-0 bg-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1 text-sm">Overwhelming Tech Shifts</h4>
                  <p className="text-xs text-text leading-relaxed">New frameworks and methodologies appear frequently. Determining which skills are critical to your career goals can be overwhelming.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-primary shrink-0 bg-white">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1 text-sm">Unclear Action Steps</h4>
                  <p className="text-xs text-text leading-relaxed">Knowing you need to learn a general technology does not help you structure a learning path or choose portfolio-worthy projects.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flat-card bg-surface border border-border p-6 rounded">
            <h3 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              The Career Compass Approach
            </h3>
            <p className="text-text text-xs leading-relaxed mb-4">
              We analyze your target role against your current verified skills. We identify key missing competencies, group them by priority, and construct a month-by-month study roadmap along with suggested projects and resources.
            </p>
            <Link
              to="/assess"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Take assessment</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Skills Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text">Market Insights</span>
            <h2 className="text-2xl font-bold text-primary mt-1">
              Trending Technologies
            </h2>
          </div>
          <Link
            to="/trends"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-2 sm:mt-0"
          >
            View all trends
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrends.map((trend) => (
            <TrendCard key={trend.name} trend={trend} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default Landing;
