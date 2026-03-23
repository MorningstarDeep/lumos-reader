import { useState, useEffect, useRef } from 'react';
import { List, Bookmark, Sun, FileText, Type, X } from 'lucide-react';
import AIChat from './AIChat';
import NotesPanel, { type Note } from './NotesPanel';
import TypographyPanel from './TypographyPanel';
import type { BookmarkEntry } from './NavigationPanel';

type Section = 'contents' | 'bookmarks' | 'ai' | 'notes' | 'display' | null;

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

interface DesktopSidebarProps {
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
  bookmarks: BookmarkEntry[];
  onRemoveBookmark: (id: string) => void;
  notes: Note[];
  onSaveNote: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  pendingQuote: string;
  onClearPendingQuote: () => void;
  fontFamily: string;
  fontSize: number;
  theme: 'light' | 'sepia' | 'dark';
  onFontFamilyChange: (f: string) => void;
  onFontSizeChange: (s: number) => void;
  onThemeChange: (t: 'light' | 'sepia' | 'dark') => void;
}

const ICON_ITEMS: { key: Section; icon: typeof List; label: string }[] = [
  { key: 'contents', icon: List, label: 'Contents' },
  { key: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { key: 'ai', icon: Sun, label: 'Ask Lumos' },
  { key: 'notes', icon: FileText, label: 'Notes' },
  { key: 'display', icon: Type, label: 'Display' },
];

const DesktopSidebar = ({
  activeChapterIndex,
  onChapterSelect,
  bookmarks,
  onRemoveBookmark,
  notes,
  onSaveNote,
  pendingQuote,
  onClearPendingQuote,
  fontFamily,
  fontSize,
  theme,
  onFontFamilyChange,
  onFontSizeChange,
  onThemeChange,
}: DesktopSidebarProps) => {
  const [activeSection, setActiveSection] = useState<Section>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: Section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  // Close panel on outside click
  useEffect(() => {
    if (!activeSection) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is inside the sidebar area (icon rail + floating panel)
      if (target.closest('[data-desktop-sidebar]')) return;
      setActiveSection(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeSection]);

  return (
    <div
      data-desktop-sidebar
      className="hidden md:flex fixed top-[54px] right-0 bottom-0 z-40"
    >
      {/* Floating overlay panel — appears LEFT of the icon rail */}
      <div
        className="absolute right-14 top-0 bottom-0 w-[280px] bg-reader-surface border-l border-reader-border flex flex-col overflow-hidden"
        style={{
          transform: activeSection ? 'translateX(0)' : 'translateX(100%)',
          opacity: activeSection ? 1 : 0,
          transition: 'transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease',
          borderRadius: '12px 0 0 12px',
          boxShadow: activeSection
            ? '-4px 0 24px -4px hsla(0, 0%, 0%, 0.1), -1px 0 6px -1px hsla(0, 0%, 0%, 0.06)'
            : 'none',
          pointerEvents: activeSection ? 'auto' : 'none',
        }}
        ref={panelRef}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-reader-border shrink-0">
          <h2 className="text-sm font-medium text-reader-text truncate">
            {ICON_ITEMS.find((i) => i.key === activeSection)?.label}
          </h2>
          <button
            onClick={() => setActiveSection(null)}
            className="w-7 h-7 flex items-center justify-center rounded text-reader-muted hover:text-reader-text transition-colors active:scale-95"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'contents' && (
            <ul className="py-2">
              {CHAPTERS.map((chapter, i) => {
                const isActive = i === activeChapterIndex;
                return (
                  <li key={i}>
                    <button
                      onClick={() => onChapterSelect(i)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'text-reader-accent font-medium bg-reader-accent/8'
                          : 'text-reader-text hover:bg-reader-bg'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-reader-accent shrink-0" />
                      )}
                      <span className={isActive ? '' : 'pl-3.5'}>{chapter}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {activeSection === 'bookmarks' && (
            bookmarks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center py-12">
                <Bookmark size={28} className="text-reader-border mb-3" />
                <p className="text-sm text-reader-muted leading-relaxed">
                  No bookmarks yet. Tap the bookmark icon to save your place.
                </p>
              </div>
            ) : (
              <ul className="py-2 space-y-1 px-2">
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
            )
          )}

          {activeSection === 'ai' && <AIChat />}

          {activeSection === 'notes' && (
            <NotesPanel
              notes={notes}
              onSave={onSaveNote}
              pendingQuote={pendingQuote}
              onClearPendingQuote={onClearPendingQuote}
            />
          )}

          {activeSection === 'display' && (
            <TypographyPanel
              fontFamily={fontFamily}
              fontSize={fontSize}
              theme={theme}
              onFontFamilyChange={onFontFamilyChange}
              onFontSizeChange={onFontSizeChange}
              onThemeChange={onThemeChange}
            />
          )}
        </div>
      </div>

      {/* Icon rail — always 56px */}
      <div className="w-14 shrink-0 flex flex-col items-center pt-4 gap-1 bg-reader-surface border-l border-reader-border">
        {ICON_ITEMS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => toggleSection(key)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors active:scale-95 ${
              activeSection === key
                ? 'text-reader-accent bg-reader-accent/10'
                : 'text-reader-muted hover:text-reader-text hover:bg-reader-bg'
            }`}
            aria-label={label}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DesktopSidebar;
