import { ArrowLeft, Bookmark, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  title: string;
  progress: number;
  onBack: () => void;
  onBookmark: () => void;
  isBookmarked?: boolean;
}

const TopBar = ({ title, progress, onBack, onBookmark, isBookmarked }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-[52px] bg-reader-surface border-b border-reader-border flex items-center px-3">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-reader-text active:scale-95 transition-transform"
          aria-label="Back to library"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center font-serif text-base text-reader-text truncate px-2">
          {title}
        </h1>
        {/* Library button — desktop only */}
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-1 px-2 h-8 rounded-lg text-reader-muted hover:text-reader-text transition-colors active:scale-95 mr-1"
          aria-label="Library"
        >
          <Home size={16} />
          <span className="text-xs font-medium">Library</span>
        </button>
        <button
          onClick={onBookmark}
          className={`w-10 h-10 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
            isBookmarked ? 'text-reader-accent' : 'text-reader-text'
          }`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this position'}
        >
          <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="h-[2px] bg-reader-border">
        <div
          className="h-full bg-reader-accent transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default TopBar;
