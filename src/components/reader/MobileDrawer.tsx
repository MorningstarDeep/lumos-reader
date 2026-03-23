import { useState, useEffect } from 'react';
import { List, Bookmark, X } from 'lucide-react';
import type { BookmarkEntry } from './NavigationPanel';

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

const SIDE_NOTES = [
  'Kahneman coined System 1 / System 2 framework in 2002',
  'The coffee cup warmth study: Williams & Bargh, 2008',
  'Priming first described by Meyer & Schvaneveldt, 1971',
];

interface MobileDrawerProps {
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
  bookmarks: BookmarkEntry[];
  onRemoveBookmark: (id: string) => void;
}

const MobileDrawer = ({
  activeChapterIndex,
  onChapterSelect,
  bookmarks,
  onRemoveBookmark,
}: MobileDrawerProps) => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'contents' | 'bookmarks'>('contents');
  const [showHint, setShowHint] = useState(false);
  const [seenChapters, setSeenChapters] = useState<Set<number>>(new Set());

  // Side note hint pulse
  useEffect(() => {
    if (seenChapters.has(activeChapterIndex)) return;
    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 1500);
    return () => clearTimeout(timer);
  }, [activeChapterIndex, seenChapters]);

  useEffect(() => {
    if (rightOpen) {
      setSeenChapters((prev) => new Set(prev).add(activeChapterIndex));
      setShowHint(false);
    }
  }, [rightOpen, activeChapterIndex]);

  return (
    <div className="md:hidden">
      {/* Left edge notch */}
      <button
        onClick={() => setLeftOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-reader-border active:scale-95 transition-transform"
        style={{
          width: 7,
          height: 52,
          borderRadius: '0 4px 4px 0',
        }}
        aria-label="Open navigation"
      />

      {/* Right edge notch */}
      <button
        onClick={() => setRightOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-reader-border active:scale-95 transition-transform"
        style={{
          width: 7,
          height: 52,
          borderRadius: '4px 0 0 4px',
          boxShadow: showHint ? '0 0 10px 3px hsla(25, 73%, 31%, 0.3)' : 'none',
          transition: 'box-shadow 300ms ease',
        }}
        aria-label="Open side notes"
      />

      {/* Left drawer overlay */}
      {leftOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setLeftOpen(false)} />
      )}

      {/* Left drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col bg-reader-surface border-r border-reader-border shadow-xl"
        style={{
          transform: leftOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Tabs */}
        <div className="flex border-b border-reader-border shrink-0">
          <button
            onClick={() => setActiveTab('contents')}
            className={`flex-1 h-12 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
              activeTab === 'contents'
                ? 'text-reader-accent border-b-2 border-reader-accent'
                : 'text-reader-muted'
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
                : 'text-reader-muted'
            }`}
          >
            <Bookmark size={15} />
            Bookmarks
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'contents' ? (
            <ul className="py-2">
              {CHAPTERS.map((chapter, i) => {
                const isActive = i === activeChapterIndex;
                return (
                  <li key={i}>
                    <button
                      onClick={() => {
                        onChapterSelect(i);
                        setLeftOpen(false);
                      }}
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
            <ul className="py-2 space-y-1 px-3">
              {bookmarks.map((bm) => (
                <li key={bm.id} className="p-3 rounded-lg bg-reader-bg border border-reader-border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-reader-accent mb-1">{bm.chapter}</p>
                      <p className="text-xs text-reader-muted leading-relaxed line-clamp-2">{bm.excerpt}</p>
                    </div>
                    <button
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-reader-muted hover:text-reader-text transition-colors active:scale-95"
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

      {/* Right drawer overlay */}
      {rightOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setRightOpen(false)} />
      )}

      {/* Right drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-[280px] flex flex-col bg-reader-surface border-l border-reader-border shadow-xl"
        style={{
          transform: rightOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="h-12 flex items-center px-5 border-b border-reader-border shrink-0">
          <h2 className="text-sm font-medium text-reader-text">Side Notes</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {SIDE_NOTES.map((note, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-reader-bg border border-reader-border border-l-2 border-l-reader-accent"
            >
              <p className="text-sm text-reader-text leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
