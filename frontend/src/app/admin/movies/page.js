"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function AdminMovies() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    release_year: new Date().getFullYear(),
    director: '',
    cast_members: '',
    poster_url: '',
    trailer_url: '',
    duration: 120
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    fetchMovies();
  }, [user, authLoading, router]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Fetch more movies for admin table
      const { data } = await api.get('/movies?limit=50&sort=created_desc');
      setMovies(data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get(`/movies?search=${search}&limit=50`);
      setMovies(data.movies);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this movie? This will also delete all associated reviews.')) return;
    
    try {
      await api.delete(`/movies/${id}`);
      setMovies(movies.filter(m => m.id !== id));
    } catch (error) {
      alert('Failed to delete movie.');
    }
  };

  const openModal = (movie = null) => {
    setError('');
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        genre: movie.genre || '',
        release_year: movie.release_year || new Date().getFullYear(),
        director: movie.director || '',
        cast_members: movie.cast_members || '',
        poster_url: movie.poster_url || '',
        trailer_url: movie.trailer_url || '',
        duration: movie.duration || 120
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        genre: '',
        release_year: new Date().getFullYear(),
        director: '',
        cast_members: '',
        poster_url: '',
        trailer_url: '',
        duration: 120
      });
    }
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'release_year' || name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);
    
    try {
      if (editingMovie) {
        await api.put(`/movies/${editingMovie.id}`, formData);
      } else {
        await api.post('/movies', formData);
      }
      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to save movie.');
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-outfit text-3xl font-bold text-white">Manage Movies</h1>
            <p className="text-slate-400">Add, edit, and remove movies from the platform</p>
          </div>
          
          <button onClick={() => openModal()} className="btn-primary gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Add New Movie
          </button>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search by title or director..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700/50">
                  <th className="p-4 text-slate-300 font-medium">Title</th>
                  <th className="p-4 text-slate-300 font-medium hidden md:table-cell">Director</th>
                  <th className="p-4 text-slate-300 font-medium hidden sm:table-cell">Year</th>
                  <th className="p-4 text-slate-300 font-medium hidden lg:table-cell">Genre</th>
                  <th className="p-4 text-slate-300 font-medium">Rating</th>
                  <th className="p-4 text-slate-300 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                          {movie.poster_url && (
                            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-white">{movie.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 hidden md:table-cell">{movie.director}</td>
                    <td className="p-4 text-slate-400 hidden sm:table-cell">{movie.release_year}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        <span className="font-medium">{Number(movie.avg_rating).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(movie)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No movies found. Try a different search or add a new movie.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 p-6 border-b border-slate-700/50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                  <input type="text" name="title" required className="input-field" value={formData.title} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Genre *</label>
                  <input type="text" name="genre" required className="input-field" placeholder="Action, Drama, etc." value={formData.genre} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Release Year</label>
                  <input type="number" name="release_year" className="input-field" value={formData.release_year} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                  <input type="number" name="duration" className="input-field" value={formData.duration} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Director</label>
                  <input type="text" name="director" className="input-field" value={formData.director} onChange={handleFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cast Members (comma separated)</label>
                  <input type="text" name="cast_members" className="input-field" value={formData.cast_members} onChange={handleFormChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Poster URL</label>
                  <input type="url" name="poster_url" className="input-field" placeholder="https://..." value={formData.poster_url} onChange={handleFormChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Trailer Embed URL</label>
                  <input type="url" name="trailer_url" className="input-field" placeholder="https://www.youtube.com/embed/..." value={formData.trailer_url} onChange={handleFormChange} />
                  <p className="text-xs text-slate-500 mt-1">Must be an embeddable URL, e.g., YouTube embed link.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description / Synopsis</label>
                  <textarea name="description" rows="4" className="input-field resize-none" value={formData.description} onChange={handleFormChange}></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="btn-primary gap-2">
                  {formLoading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Movie</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
