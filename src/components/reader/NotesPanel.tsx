import { useState } from 'react';

export interface Note {
  id: string;
  quote: string;
  text: string;
  chapter: string;
  timestamp: string;
}

interface NotesPanelProps {
  notes: Note[];
  onSave: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  pendingQuote: string;
  onClearPendingQuote: () => void;
}

const NotesPanel = ({ notes, onSave, pendingQuote, onClearPendingQuote }: NotesPanelProps) => {
  const [noteText, setNoteText] = useState('');
  const [quote, setQuote] = useState(pendingQuote);

  // Sync pending quote
  if (pendingQuote && pendingQuote !== quote) {
    setQuote(pendingQuote);
    onClearPendingQuote();
  }

  const handleSave = () => {
    if (!noteText.trim() && !quote.trim()) return;
    onSave({ quote: quote, text: noteText.trim(), chapter: 'Chapter 4' });
    setNoteText('');
    setQuote('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {notes.length === 0 && (
          <p className="text-sm text-reader-muted text-center py-8">
            No notes yet. Tap a highlight or write one below.
          </p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="bg-reader-bg rounded-xl p-4">
            {note.quote && (
              <div className="border-l-2 border-reader-accent pl-3 mb-2">
                <p className="text-sm italic text-reader-muted leading-relaxed">{note.quote}</p>
              </div>
            )}
            {note.text && <p className="text-sm text-reader-text leading-relaxed">{note.text}</p>}
            <p className="text-[11px] text-reader-muted mt-2">{note.chapter} · {note.timestamp}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-reader-border">
        {quote && (
          <div className="border-l-2 border-reader-accent pl-3 mb-2 flex items-start gap-2">
            <p className="text-xs italic text-reader-muted flex-1 leading-relaxed">{quote}</p>
            <button onClick={() => setQuote('')} className="text-reader-muted text-xs shrink-0">✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note..."
            rows={2}
            className="flex-1 bg-reader-bg border border-reader-border rounded-xl px-4 py-2.5 text-sm text-reader-text placeholder:text-reader-muted focus:outline-none focus:ring-1 focus:ring-reader-accent resize-none"
          />
          <button
            onClick={handleSave}
            disabled={!noteText.trim() && !quote.trim()}
            className="self-end px-4 py-2.5 rounded-xl bg-reader-accent text-reader-surface text-sm font-medium disabled:opacity-40 active:scale-95 transition-transform"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
