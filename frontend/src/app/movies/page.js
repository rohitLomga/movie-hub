"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import MovieCard from '@/components/MovieCard';

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || '';

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [genre, setGenre] = useState(initialGenre);
  const [sort, setSort] = useState('rating_desc');

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/movies?page=${page}&limit=12&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;

      const { data } = await api.get(url);
      setMovies(data.movies);
      setGenres(data.genres);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies(1);
  };

  const clearFilters = () => {
    setSearch('');
    setGenre('');
    setSort('rating_desc');
    // Fetch will happen via useEffect when genre/sort changes
    if (!genre && sort === 'rating_desc') {
      fetchMovies(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="font-outfit text-4xl font-bold text-white mb-2">Discover Movies</h1>
          <p className="text-slate-400">Find your next favorite film</p>
        </div>

        <div className="w-full md:w-auto flex gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10 py-2.5"
              placeholder="Search movies (Nahi karenge)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-3"
            title="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass-card p-5 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Filter className="w-4 h-4" />
              <span>Filters & Sorting</span>
            </div>
            <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Genre</label>
              <select
                className="input-field appearance-none"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                className="input-field appearance-none"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="rating_asc">Lowest Rated</option>
                <option value="year_desc">Newest First</option>
                <option value="year_asc">Oldest First</option>
                <option value="title_asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={pagination.page === 1}
                onClick={() => fetchMovies(pagination.page - 1)}
              >
                Previous
              </button>
              <div className="text-slate-300 text-sm font-medium px-4">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <button
                className="btn-secondary px-3 py-1 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchMovies(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
          <p className="text-slate-400 mb-6 max-w-md">
            We couldn't find any movies matching your current filters. Try adjusting your search or category.
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>}>
      <MoviesContent />
    </Suspense>
  );
}
