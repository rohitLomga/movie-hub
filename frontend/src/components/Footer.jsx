import Link from 'next/link';
import { Film, Code, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-indigo-500" />
              <span className="font-outfit font-bold text-xl tracking-tight text-white">
                Movie<span className="text-indigo-500">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Your ultimate destination for discovering, tracking, and reviewing the best movies in cinema history.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Code className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/movies" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">All Movies (Updated)</Link></li>
              <li><Link href="/movies?genre=action" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Action</Link></li>
              <li><Link href="/movies?genre=drama" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Drama</Link></li>
              <li><Link href="/movies?genre=sci-fi" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Sci-Fi</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Login</Link></li>
              <li><Link href="/auth/register" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} MovieHub. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
