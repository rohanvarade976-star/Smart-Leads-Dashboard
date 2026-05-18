import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from '../types';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { role: 'sales' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await api.register(data);
      login(result.token, result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      navigate('/dashboard');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 dark:from-slate-900 dark:via-surface-dark dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start managing your leads</p>
        </div>

        <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-xl border border-surface-border dark:border-surface-border-dark p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <Select
              label="Role"
              error={errors.role?.message}
              {...register('role', { required: 'Role is required' })}
            >
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </Select>
            <Button type="submit" isLoading={isLoading} className="w-full justify-center mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
