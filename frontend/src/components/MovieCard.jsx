import Link from 'next/link';
import { Star, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function MovieCard({ movie }) {
  return (
    <div className="glass-card group overflow-hidden flex flex-col h-full">
      <Link href={`/movies/${movie.id}`} className="block relative aspect-[2/3] overflow-hidden">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-500">No poster</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 text-sm text-slate-200 mb-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{movie.release_year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-200 mb-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{movie.duration} min</span>
          </div>
          <span className="inline-block px-2 py-1 bg-indigo-600/80 text-white text-xs font-medium rounded backdrop-blur-sm w-fit">
            {movie.genre}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-700/50">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-white">{Number(movie.avg_rating).toFixed(1)}</span>
        </div>
      </Link>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/movies/${movie.id}`}>
            <h3 className="font-outfit font-bold text-lg text-white mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {movie.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">
            {movie.description}
          </p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Dir:</span>
          <span className="text-slate-300 truncate">{movie.director}</span>
        </div>
      </div>
    </div>
  );
}
