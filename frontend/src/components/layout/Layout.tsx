import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-surface-dark transition-colors">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
  </div>
);
