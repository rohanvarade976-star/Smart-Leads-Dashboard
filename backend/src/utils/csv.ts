import { ILeadDocument } from '../models/Lead';

export const generateCSV = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
  const rows = leads.map((lead) => [
    `"${lead.name}"`,
    `"${lead.email}"`,
    `"${lead.status}"`,
    `"${lead.source}"`,
    `"${lead.notes || ''}"`,
    `"${lead.createdAt.toISOString()}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
