import { Sun, FileText, Type } from 'lucide-react';
import AIChat from './AIChat';
import NotesPanel, { type Note } from './NotesPanel';
import TypographyPanel from './TypographyPanel';

type PanelType = 'ai' | 'notes' | 'typography' | null;

interface BottomPanelProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
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

const BottomPanel = ({
  activePanel,
  onPanelChange,
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
}: BottomPanelProps) => {
  const isExpanded = activePanel !== null;
  const panelHeight = activePanel === 'typography' ? 'auto' : '60vh';

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => onPanelChange(null)}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-reader-surface border-t border-reader-border transition-all duration-300 ease-out"
        style={{ height: isExpanded ? panelHeight : '52px' }}
      >
        {/* Toolbar */}
        <div className="h-[52px] flex items-center px-4 border-b border-reader-border shrink-0">
          <button
            onClick={() => onPanelChange(activePanel === 'ai' ? null : 'ai')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors active:scale-95 ${
              activePanel === 'ai' ? 'text-reader-accent font-medium' : 'text-reader-muted'
            }`}
          >
            <Sun size={16} />
            Ask Lumos
          </button>
          <button
            onClick={() => onPanelChange(activePanel === 'notes' ? null : 'notes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors active:scale-95 ${
              activePanel === 'notes' ? 'text-reader-accent font-medium' : 'text-reader-muted'
            }`}
          >
            <FileText size={16} />
            Notes
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onPanelChange(activePanel === 'typography' ? null : 'typography')}
            className={`px-3 py-2 rounded-lg text-sm font-serif transition-colors active:scale-95 ${
              activePanel === 'typography' ? 'text-reader-accent font-medium' : 'text-reader-muted'
            }`}
          >
            Aa
          </button>
        </div>

        {/* Panel Content */}
        {isExpanded && (
          <div className="overflow-hidden" style={{ height: activePanel === 'typography' ? 'auto' : 'calc(100% - 52px)' }}>
            {activePanel === 'ai' && <AIChat />}
            {activePanel === 'notes' && (
              <NotesPanel
                notes={notes}
                onSave={onSaveNote}
                pendingQuote={pendingQuote}
                onClearPendingQuote={onClearPendingQuote}
              />
            )}
            {activePanel === 'typography' && (
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
        )}
      </div>
    </>
  );
};

export default BottomPanel;
