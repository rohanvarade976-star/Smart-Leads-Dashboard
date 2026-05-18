import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateLeadForm, Lead } from '../../types';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface LeadFormProps {
  onSubmit: (data: CreateLeadForm) => void;
  isLoading?: boolean;
  defaultValues?: Partial<Lead>;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading, defaultValues, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateLeadForm>({
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      status: defaultValues?.status || 'New',
      source: defaultValues?.source || 'Website',
      notes: defaultValues?.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
        })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </Select>
        <Select
          label="Source"
          error={errors.source?.message}
          {...register('source', { required: 'Source is required' })}
        >
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </Select>
      </div>
      <Textarea
        label="Notes (optional)"
        placeholder="Any additional context..."
        rows={3}
        {...register('notes', { maxLength: { value: 500, message: 'Max 500 characters' } })}
      />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
