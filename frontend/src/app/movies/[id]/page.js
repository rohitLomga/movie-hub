"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';
import StarRating from '@/components/StarRating';

export default function MovieDetailsPage({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Form State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  const hasReviewed = user ? reviews.some(r => r.user_id === user.id) : false;

  const fetchMovieData = async () => {
    try {
      const { data } = await api.get(`/movies/${params.id}`);
      setMovie(data.movie);
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
      setError('Failed to load movie details. It might not exist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    
    if (rating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    
    if (comment.trim().length < 5) {
      setReviewError('Comment must be at least 5 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/movies/${params.id}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      await fetchMovieData(); // Refresh data to show new review and updated rating
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchMovieData(); // Refresh data
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
        <Link href="/movies" className="btn-primary inline-flex gap-2 w-fit mx-auto">
          <ArrowLeft className="w-4 h-4" /> Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Backdrop Header */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          {movie.poster_url && (
            <img 
              src={movie.poster_url} 
              alt={movie.title}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <Link href="/movies" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors backdrop-blur-md bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 aspect-[2/3] bg-slate-800">
              {movie.poster_url ? (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">No Poster</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-2/3 lg:w-3/4 pt-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-full text-sm font-medium">
                {movie.genre}
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-medium">
                {movie.release_year}
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-medium">
                {movie.duration} min
              </span>
            </div>
            
            <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <StarRating rating={Number(movie.avg_rating)} readOnly size="lg" />
              </div>
              <span className="text-slate-400 text-sm">
                ({movie.total_reviews} {movie.total_reviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="glass-card p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
              <p className="text-slate-300 leading-relaxed">
                {movie.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Director</h4>
                <p className="text-white font-medium">{movie.director}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Cast</h4>
                <p className="text-white font-medium">{movie.cast_members}</p>
              </div>
            </div>

            {/* Trailer Embed if available */}
            {movie.trailer_url && (
              <div className="mb-12">
                <h3 className="font-outfit text-2xl font-bold text-white mb-4">Trailer</h3>
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-700/50 shadow-xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={movie.trailer_url} 
                    title={`${movie.title} Trailer`}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-slate-800">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-outfit text-3xl font-bold text-white">Reviews</h2>
            <span className="text-slate-400">{reviews.length} total</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                {user ? (
                  hasReviewed ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Review Submitted</h3>
                      <p className="text-slate-400 text-sm">You have already shared your thoughts on this movie. Thank you!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit}>
                      <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                      
                      {reviewError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                          {reviewError}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
                        <StarRating rating={rating} setRating={setRating} />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Thoughts</label>
                        <textarea
                          rows="4"
                          className="input-field resize-none"
                          placeholder="What did you think of the movie?"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn-primary w-full"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-lg font-medium text-white mb-2">Join the Discussion</h3>
                    <p className="text-slate-400 text-sm mb-6">Log in to leave a rating and review for this movie.</p>
                    <Link href="/auth/login" className="btn-primary w-full">
                      Log In to Review
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="glass-card p-5 border-l-4 border-l-indigo-500">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                          {review.avatar_url ? (
                            <img src={review.avatar_url} alt={review.username} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{review.username}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} readOnly size="sm" />
                        
                        {(user?.id === review.user_id || user?.role === 'admin') && (
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed ml-13 pl-1">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="glass-card p-12 text-center border-dashed">
                  <p className="text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
