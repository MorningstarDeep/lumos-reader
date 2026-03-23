import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SideNotesPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SIDE_NOTES = [
  'Kahneman coined System 1 / System 2 framework in 2002',
  'The coffee cup warmth study: Williams & Bargh, 2008',
  'Priming first described by Meyer & Schvaneveldt, 1971',
];

const SideNotesPanel = ({ isOpen, onToggle }: SideNotesPanelProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={onToggle}
        />
      )}

      {/* Handle tab — always visible */}
      <button
        onClick={onToggle}
        className="fixed top-1/2 -translate-y-1/2 z-50 flex items-center justify-center bg-reader-surface border border-reader-border text-reader-muted hover:text-reader-text transition-all duration-300 active:scale-95"
        style={{
          right: isOpen ? 260 : 0,
          width: 24,
          height: 48,
          borderRadius: '24px 0 0 24px',
          borderRight: 'none',
          transition: 'right 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
        aria-label={isOpen ? 'Close side notes' : 'Open side notes'}
      >
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-40 w-[260px] flex flex-col bg-reader-surface border-l border-reader-border shadow-lg"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
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
    </>
  );
};

export default SideNotesPanel;
