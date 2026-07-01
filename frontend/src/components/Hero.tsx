import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Route } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="py-16 lg:py-24 px-4 text-center flex flex-col items-center">
      {/* Title */}
      <h1 className="max-w-3xl font-sans font-bold text-4xl sm:text-5xl md:text-6xl text-primary tracking-tight mb-6">
        Navigate Your Tech Career Journey With Clarity
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-text text-base sm:text-lg mb-10 leading-relaxed">
        Bridge the gap between your current skills and your target role. Analyze market fit, build month-by-month roadmaps, and explore trending technologies.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
        <Link
          to="/assess"
          id="hero-cta-start"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded hover:bg-slate-800 transition-colors text-sm"
        >
          Analyze Skill Gap
        </Link>
        <Link
          to="/trends"
          id="hero-cta-trends"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-border text-primary font-bold rounded hover:bg-surface transition-colors text-sm"
        >
          Explore Tech Trends
        </Link>
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="flat-card flex items-start gap-4">
          <div className="w-10 h-10 rounded border border-border flex items-center justify-center text-primary shrink-0 bg-white">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary mb-1">Smart Roadmaps</h3>
            <p className="text-sm text-text">Get month-wise curriculum tailored to target roles and optimized for missing skills.</p>
          </div>
        </div>

        <div className="flat-card flex items-start gap-4">
          <div className="w-10 h-10 rounded border border-border flex items-center justify-center text-primary shrink-0 bg-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary mb-1">Market Fit Index</h3>
            <p className="text-sm text-text">Understand your compatibility with target roles based on actual technical requirements.</p>
          </div>
        </div>

        <div className="flat-card flex items-start gap-4">
          <div className="w-10 h-10 rounded border border-border flex items-center justify-center text-primary shrink-0 bg-white">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary mb-1">Practical Learning</h3>
            <p className="text-sm text-text">Receive project prompts and handpicked educational materials to accelerate learning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
