import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border dark:border-surface-border-dark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-slate-900 dark:text-white text-lg tracking-tight">
            LeadsIQ
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{user?.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              user?.role === 'admin'
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {user?.role}
            </span>
          </div>

          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};
