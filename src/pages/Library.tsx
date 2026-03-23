import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  coverGradient: string;
  isLoading?: boolean;
  fileName?: string;
}

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    progress: 34,
    coverGradient: 'from-amber-700 via-amber-600 to-amber-500',
  },
  {
    id: '2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    progress: 0,
    coverGradient: 'from-orange-800 via-red-700 to-orange-600',
  },
  {
    id: '3',
    title: 'The Art of Learning',
    author: 'Josh Waitzkin',
    progress: 67,
    coverGradient: 'from-emerald-800 via-green-700 to-emerald-600',
  },
];

const BookCard = ({ book, onClick }: { book: Book; onClick: () => void }) => {
  if (book.isLoading) {
    return (
      <div className="rounded-xl border border-reader-border bg-reader-surface shadow-sm overflow-hidden">
        <div className="aspect-[3/4] relative">
          <Skeleton className="w-full h-full rounded-none bg-reader-border" />
        </div>
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-reader-border" />
          <Skeleton className="h-3 w-1/2 bg-reader-border" />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-reader-border bg-reader-surface shadow-sm overflow-hidden text-left w-full active:scale-[0.97] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reader-accent focus-visible:ring-offset-2"
    >
      <div className={`aspect-[3/4] bg-gradient-to-br ${book.coverGradient} relative flex items-end p-4`}>
        <h3 className="font-serif text-white text-lg leading-snug drop-shadow-md" style={{ lineHeight: '1.25' }}>
          {book.title}
        </h3>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-sm text-reader-muted truncate">{book.author}</p>
        <div className="h-1 bg-reader-border rounded-full overflow-hidden">
          <div
            className="h-full bg-reader-accent rounded-full transition-[width] duration-300"
            style={{ width: `${book.progress}%` }}
          />
        </div>
        {book.progress > 0 && (
          <p className="text-xs text-reader-muted">{book.progress}% read</p>
        )}
      </div>
    </button>
  );
};

const Library = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingBook: Book = {
      id: Date.now().toString(),
      title: '',
      author: '',
      progress: 0,
      coverGradient: 'from-stone-700 via-stone-600 to-stone-500',
      isLoading: true,
      fileName: file.name,
    };

    setBooks((prev) => [loadingBook, ...prev]);

    setTimeout(() => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === loadingBook.id
            ? {
                ...b,
                title: file.name.replace('.pdf', ''),
                author: 'Unknown Author',
                isLoading: false,
              }
            : b
        )
      );
    }, 2000);

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-reader-bg text-reader-text">
      {/* Top Bar */}
      <header className="h-[52px] flex items-center justify-between px-4 border-b border-reader-border bg-reader-surface">
        <span className="font-serif text-xl text-reader-accent tracking-tight">Lumos</span>
        <button
          className="w-9 h-9 rounded-full bg-reader-accent text-white flex items-center justify-center text-sm font-medium active:scale-95 transition-transform"
          aria-label="Profile"
        >
          D
        </button>
      </header>

      {/* Content */}
      <main className="px-5 pt-8 pb-12 max-w-xl mx-auto">
        {/* Hero */}
        <section className="mb-8">
          <p className="font-body italic text-reader-muted text-sm mb-1">Good morning, Deep.</p>
          <p className="font-body text-lg text-reader-text">What will you read today?</p>
        </section>

        {/* Add Book */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mb-8 h-12 rounded-xl bg-reader-accent text-white font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-transform duration-150 shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reader-accent focus-visible:ring-offset-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          Add Book
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Library Grid */}
        <section className="grid grid-cols-2 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => !book.isLoading && navigate('/reader')}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Library;
