import React, { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onView }) => {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-surface-border-dark bg-white dark:bg-surface-card-dark">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border dark:border-surface-border-dark bg-slate-50 dark:bg-slate-800/50">
            <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Name</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Email</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Source</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Created</th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border dark:divide-surface-border-dark">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                <button
                  onClick={() => onView(lead)}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left"
                >
                  {lead.name}
                </button>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{lead.email}</td>
              <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
              <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
              <td className="px-4 py-3 text-slate-400 dark:text-slate-500 text-xs">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-3 relative">
                <button
                  onClick={() => setOpenMenu(openMenu === lead._id ? null : lead._id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>
                {openMenu === lead._id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                    <div className="absolute right-3 top-8 z-20 bg-white dark:bg-slate-800 border border-surface-border dark:border-surface-border-dark rounded-lg shadow-xl py-1 min-w-[130px]">
                      <button
                        onClick={() => { onView(lead); setOpenMenu(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        onClick={() => { onEdit(lead); setOpenMenu(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => { onDelete(lead._id); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
