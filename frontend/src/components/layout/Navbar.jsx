import { Sparkles, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onReset, showReset }) => {
  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={showReset ? onReset : undefined}>
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="font-serif text-xl font-bold">CV Insights</span>
          </Link>
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            {showReset && (
              <button
                onClick={onReset}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Analyze New Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
