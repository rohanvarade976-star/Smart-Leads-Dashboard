import React from 'react';
import { LeadStatus, LeadSource } from '../../types';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Qualified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Lost: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
};

const sourceStyles: Record<LeadSource, string> = {
  Website: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Referral: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
    {status}
  </span>
);

export const SourceBadge: React.FC<{ source: LeadSource }> = ({ source }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceStyles[source]}`}>
    {source}
  </span>
);
