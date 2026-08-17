import React from 'react';

export const DashboardSectionSkeleton: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8 animate-pulse">
        <div className="lg:col-span-2 w-full border border-border bg-white p-6 rounded space-y-4">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="space-y-3 pt-2">
            <div className="h-16 bg-slate-100 rounded" />
            <div className="h-16 bg-slate-100 rounded" />
            <div className="h-16 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-full space-y-3.5">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-24 bg-slate-100 rounded border border-border" />
          <div className="h-24 bg-slate-100 rounded border border-border" />
          <div className="h-24 bg-slate-100 rounded border border-border" />
        </div>
      </div>

      <div className="w-full space-y-4 border-t border-border pt-8 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-100 rounded border border-border" />
          <div className="h-32 bg-slate-100 rounded border border-border" />
          <div className="h-32 bg-slate-100 rounded border border-border" />
        </div>
      </div>
    </>
  );
};

export default DashboardSectionSkeleton;
