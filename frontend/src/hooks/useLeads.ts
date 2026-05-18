import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { LeadFilters, CreateLeadForm } from '../types';
import toast from 'react-hot-toast';

export const useLeads = (filters: LeadFilters) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => api.getLeads(filters),
    staleTime: 30_000,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.getLead(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadForm) => api.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
    },
    onError: () => toast.error('Failed to create lead'),
  });
};

export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateLeadForm> }) =>
      api.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated!');
    },
    onError: () => toast.error('Failed to update lead'),
  });
};

export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
};
