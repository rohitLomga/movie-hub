"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Search } from 'lucide-react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Fetch top rated movies for trending section
        const { data } = await api.get('/movies?sort=rating_desc&limit=4');
        setMovies(data.movies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/movies?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 mix-blend-multiply" />
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-indigo-500/30 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] opacity-50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Discover the magic of cinema
            </div>
            
            <h1 className="font-outfit text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Track your favorite <br />
              <span className="text-gradient">movies & reviews</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Join our community of cinephiles. Discover trending films, read critical reviews, and share your thoughts on the latest releases.
            </p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-4 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 shadow-xl"
                  placeholder="Search for movies, directors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-outfit text-3xl font-bold text-white mb-2">Trending Now</h2>
              <p className="text-slate-400">Highest rated movies by our community</p>
            </div>
            <Link href="/movies" className="hidden sm:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              <div className="mt-8 sm:hidden flex justify-center">
                <Link href="/movies" className="btn-secondary w-full">
                  View all movies
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-outfit text-4xl font-bold text-white mb-6">Ready to share your opinion?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Create an account today to start rating movies and writing reviews. Join thousands of movie lovers.
          </p>
          <Link href="/auth/register" className="inline-flex px-8 py-4 bg-white text-indigo-900 hover:bg-slate-100 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
