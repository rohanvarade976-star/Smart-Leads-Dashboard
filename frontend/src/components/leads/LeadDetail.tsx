import React from 'react';
import { Lead } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Calendar, Mail, User, FileText } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const createdByName = typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" /> {lead.email}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>
        </div>

        <div className="border-t border-surface-border dark:border-surface-border-dark pt-4 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Created
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-200">{formatDate(lead.createdAt)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3" /> Added by
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-200">{createdByName}</span>
          </div>
        </div>

        {lead.notes && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
              <FileText className="w-3 h-3" /> Notes
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{lead.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
