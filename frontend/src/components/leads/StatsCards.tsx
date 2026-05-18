import React from 'react';
import { Lead, LeadStatus } from '../../types';

interface StatsCardsProps {
  leads: Lead[];
  total: number;
}

const statusConfig: { status: LeadStatus; label: string; color: string; bg: string }[] = [
  { status: 'New', label: 'New', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { status: 'Contacted', label: 'Contacted', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { status: 'Qualified', label: 'Qualified', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { status: 'Lost', label: 'Lost', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
];

export const StatsCards: React.FC<StatsCardsProps> = ({ leads }) => {
  const counts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statusConfig.map(({ status, label, color, bg }) => (
        <div key={status} className={`${bg} glass-card p-4 border border-transparent`}>
          <div className={`text-2xl font-display font-bold ${color}`}>
            {counts[status] || 0}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
};
