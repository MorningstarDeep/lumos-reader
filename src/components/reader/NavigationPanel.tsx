import { useState } from 'react';
import { List, Bookmark, X } from 'lucide-react';

export interface BookmarkEntry {
  id: string;
  chapter: string;
  excerpt: string;
}

interface NavigationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
  bookmarks: BookmarkEntry[];
  onRemoveBookmark: (id: string) => void;
}

const CHAPTERS = [
  'The Characters of the Story',
  'Attention and Effort',
  'The Lazy Controller',
  'The Associative Machine',
  'Cognitive Ease',
  'Norms, Surprises, and Causes',
  'A Machine for Jumping to Conclusions',
  'How Judgments Happen',
];

const NavigationPanel = ({
  isOpen,
  onToggle,
  activeChapterIndex,
  onChapterSelect,
  bookmarks,
  onRemoveBookmark,
}: NavigationPanelProps) => {
  const [activeTab, setActiveTab] = useState<'contents' | 'bookmarks'>('contents');

  return (
    <>
      {/* Toggle tab — always visible on md+ */}
      <button
        onClick={onToggle}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 w-7 h-14 items-center justify-center rounded-r-lg bg-reader-surface border border-l-0 border-reader-border shadow-sm text-reader-muted hover:text-reader-text transition-colors active:scale-95"
        style={{ left: isOpen ? 260 : 0, transition: 'left 300ms cubic-bezier(0.16,1,0.3,1)' }}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        <List size={16} />
      </button>

      {/* Panel */}
      <div
        className="hidden md:flex fixed top-0 left-0 bottom-0 z-30 w-[260px] flex-col bg-reader-surface border-r border-reader-border shadow-lg"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Tabs */}
        <div className="flex border-b border-reader-border">
          <button
            onClick={() => setActiveTab('contents')}
            className={`flex-1 h-12 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
              activeTab === 'contents'
                ? 'text-reader-accent border-b-2 border-reader-accent'
                : 'text-reader-muted hover:text-reader-text'
            }`}
          >
            <List size={15} />
            Contents
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 h-12 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-reader-accent border-b-2 border-reader-accent'
                : 'text-reader-muted hover:text-reader-text'
            }`}
          >
            <Bookmark size={15} />
            Bookmarks
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'contents' ? (
            <ul className="py-2">
              {CHAPTERS.map((chapter, i) => {
                const isActive = i === activeChapterIndex;
                return (
                  <li key={i}>
                    <button
                      onClick={() => onChapterSelect(i)}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center gap-2.5 ${
                        isActive
                          ? 'text-reader-accent font-medium bg-reader-accent/8'
                          : 'text-reader-text hover:bg-reader-bg'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-reader-accent shrink-0" />
                      )}
                      <span className={isActive ? '' : 'pl-4'}>{chapter}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <Bookmark size={32} className="text-reader-border mb-3" />
              <p className="text-sm text-reader-muted leading-relaxed">
                No bookmarks yet. Tap the bookmark icon while reading to save your place.
              </p>
            </div>
          ) : (
            <ul className="py-2 space-y-1">
              {bookmarks.map((bm) => (
                <li
                  key={bm.id}
                  className="mx-3 p-3 rounded-lg bg-reader-bg border border-reader-border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-reader-accent mb-1">{bm.chapter}</p>
                      <p className="text-xs text-reader-muted leading-relaxed line-clamp-2">
                        {bm.excerpt}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-reader-muted hover:text-reader-text hover:bg-reader-border transition-colors active:scale-95"
                      aria-label="Remove bookmark"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NavigationPanel;
