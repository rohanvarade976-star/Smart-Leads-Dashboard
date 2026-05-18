import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { Select } from '../ui/Input';
import { Button } from '../ui/Button';

interface FiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  onExport: () => void;
  total?: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onChange, onExport, total }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  React.useEffect(() => {
    onChange({ ...filters, search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const hasActiveFilters = filters.status || filters.source || filters.search;

  const clearFilters = () => {
    setSearchInput('');
    onChange({ sort: 'latest', page: 1, limit: 10 });
  };

  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-border dark:border-surface-border-dark bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select
            value={filters.status || ''}
            onChange={(e) => onChange({ ...filters, status: e.target.value as LeadStatus | '', page: 1 })}
            className="min-w-[130px]"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </Select>

          <Select
            value={filters.source || ''}
            onChange={(e) => onChange({ ...filters, source: e.target.value as LeadSource | '', page: 1 })}
            className="min-w-[130px]"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </Select>

          <Select
            value={filters.sort || 'latest'}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as 'latest' | 'oldest', page: 1 })}
            className="min-w-[120px]"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
          {total !== undefined && (
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> {total} result{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={onExport}>
          Export CSV
        </Button>
      </div>
    </div>
  );
};
