import { ArrowLeft, Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  progress: number;
  onBack: () => void;
  onMenuOpen: () => void;
}

const TopBar = ({ title, progress, onBack, onMenuOpen }: TopBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-30">
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
        <button
          onClick={onMenuOpen}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-reader-text active:scale-95 transition-transform"
          aria-label="Table of contents"
        >
          <Menu size={22} />
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
