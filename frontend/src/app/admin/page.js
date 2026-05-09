"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, MessageSquare, Users, Settings, Plus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalReviews: 0,
    totalUsers: 0,
    totalGenres: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/movies/stats/overview');
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchStats();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const statCards = [
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: <Film className="w-8 h-8 text-indigo-400" />,
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: <MessageSquare className="w-8 h-8 text-amber-400" />,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8 text-emerald-400" />,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Genres',
      value: stats.totalGenres,
      icon: <Settings className="w-8 h-8 text-rose-400" />,
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600/20 rounded-xl">
          <LayoutDashboard className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="font-outfit text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`glass-card p-6 border ${stat.border}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-400 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-4">
            <Link href="/admin/movies" className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors">Manage Movies</h3>
                  <p className="text-sm text-slate-400">Add, edit, or delete movies</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </Link>
            
            <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-700 rounded-lg text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Manage Users</h3>
                  <p className="text-sm text-slate-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
