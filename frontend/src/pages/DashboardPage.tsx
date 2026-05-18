import React, { useState } from 'react';
import { Plus, Users, AlertCircle } from 'lucide-react';
import { Lead, LeadFilters } from '../types';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { Layout } from '../components/layout/Layout';
import { FiltersBar } from '../components/leads/FiltersBar';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetail } from '../components/leads/LeadDetail';
import { StatsCards } from '../components/leads/StatsCards';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1, limit: 10 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const { data, isLoading, isError } = useLeads(filters);
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const leads = data?.leads || [];
  const meta = data?.meta;

  const handleExport = () => {
    const url = api.getExportUrl(filters);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Leads Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage and track your sales pipeline
            </p>
          </div>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Add Lead
          </Button>
        </div>

        {/* Stats */}
        {!isLoading && leads.length > 0 && (
          <StatsCards leads={leads} total={meta?.total || 0} />
        )}

        {/* Filters */}
        <FiltersBar
          filters={filters}
          onChange={setFilters}
          onExport={handleExport}
          total={meta?.total}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Failed to load leads. Try refreshing.</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-700 dark:text-slate-300">No leads found</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {filters.search || filters.status || filters.source
                  ? 'Try adjusting your filters'
                  : 'Add your first lead to get started'}
              </p>
            </div>
            {!filters.search && !filters.status && !filters.source && (
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
                Add First Lead
              </Button>
            )}
          </div>
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={setEditingLead}
              onDelete={(id) => deleteLead.mutate(id)}
              onView={setViewingLead}
            />
            {meta && (
              <Pagination meta={meta} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <LeadForm
          onSubmit={(data) => {
            createLead.mutate(data, { onSuccess: () => setIsCreateOpen(false) });
          }}
          isLoading={createLead.isPending}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead">
        <LeadForm
          defaultValues={editingLead || undefined}
          onSubmit={(data) => {
            if (editingLead)
              updateLead.mutate({ id: editingLead._id, data }, { onSuccess: () => setEditingLead(null) });
          }}
          isLoading={updateLead.isPending}
          onCancel={() => setEditingLead(null)}
        />
      </Modal>

      {/* View Modal */}
      <LeadDetail lead={viewingLead} onClose={() => setViewingLead(null)} />
    </Layout>
  );
};
