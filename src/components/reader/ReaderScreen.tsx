import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import ReadingArea from './ReadingArea';
import BottomPanel from './BottomPanel';
import NavigationPanel from './NavigationPanel';
import SideNotesPanel from './SideNotesPanel';
import type { Note } from './NotesPanel';
import type { BookmarkEntry } from './NavigationPanel';
import { useEdgeSwipe } from '@/hooks/use-swipe';

const PARAGRAPHS = [
  `When you think of a mental image of a friend, that image comes to mind effortlessly and without intention. You did not will it into being and you could not prevent it. It was an act of System 1. The operations of associative memory contribute to a general confirmation bias, which favors uncritical acceptance of suggestions and exaggeration of the likelihood of extreme and improbable events.`,
  `A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth. Authoritarian institutions and marketers have always known this fact. The psychologist Daniel Gilbert once proposed that understanding a statement must begin with an attempt to believe it — you must first know what the idea would mean if it were true.`,
  `The associative machine is the core of System 1 thinking. It continuously constructs a coherent interpretation of what is going on in our world at any instant. A major advance in our understanding of memory is that the concepts of the associative network are linked not only to other concepts but also to emotions, physical responses, and behavioral tendencies.`,
  `Priming effects take many forms. If the idea of eating is currently on your mind, you would be quicker than usual to recognize the word "soup" when it is spoken in a whisper or shown briefly on a screen. And you would also be primed to complete the word fragment SO_P as SOUP rather than SOAP. This remarkable phenomenon is known as associative coherence.`,
  `The consequences of repeated exposures benefit the organism in its relations to the immediate environment. The exposure effect has been observed for a remarkable variety of things — words, Chinese ideographs, faces, randomly shaped polygons, and geometric figures. The effect does not depend on the conscious experience of familiarity.`,
  `System 1 operates as a machine for jumping to conclusions. The confidence that individuals have in their beliefs depends mostly on the quality of the story they can tell about what they see, even if they see little. We often fail to allow for the possibility that evidence that should be critical to our judgment is missing — what we see is all there is.`,
  `The world in our heads is not a precise replica of reality; our expectations about the frequency of events are distorted by the prevalence and emotional intensity of the messages to which we are exposed. The estimates that people produce when asked about the frequency of certain categories of death are driven not by data but by the ease with which instances come to mind.`,
  `Anchoring effects are among the most reliable and robust results of experimental psychology. When people consider a particular value for an unknown quantity before estimating that quantity, the estimate stays close to the number that people considered — hence the image of an anchor dragged along the bottom of the sea.`,
];

const HIGHLIGHTS = [
  {
    id: 'h1',
    text: 'familiarity is not easily distinguished from truth',
    paragraphIndex: 1,
    startOffset: 0,
  },
  {
    id: 'h2',
    text: 'what we see is all there is',
    paragraphIndex: 5,
    startOffset: 0,
  },
];

const ReaderScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [activePanel, setActivePanel] = useState<'ai' | 'notes' | 'typography' | null>(null);
  const [barVisible, setBarVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [pendingQuote, setPendingQuote] = useState('');
  const [fontFamily, setFontFamily] = useState('Lora');
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [navOpen, setNavOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(3);
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);

  // Mobile swipe gestures
  useEdgeSwipe({
    elementRef: wrapperRef,
    edge: 'left',
    isOpen: navOpen,
    onSwipeOpen: () => setNavOpen(true),
    onSwipeClose: () => setNavOpen(false),
  });

  useEdgeSwipe({
    elementRef: wrapperRef,
    edge: 'right',
    isOpen: notesOpen,
    onSwipeOpen: () => setNotesOpen(true),
    onSwipeClose: () => setNotesOpen(false),
  });

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    if (scrollHeight > 0) {
      setProgress((scrollTop / scrollHeight) * 100);
    }

    if (Math.abs(scrollTop - lastScrollTopRef.current) > 5) {
      setBarVisible(false);
      setActivePanel(null);
    }
    lastScrollTopRef.current = scrollTop;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleReadingAreaTap = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[role="button"]') || target.closest('button')) return;
    setBarVisible((prev) => !prev);
  }, []);

  const handleHighlightTap = (highlight: { text: string }) => {
    setPendingQuote(highlight.text);
    setBarVisible(true);
    setActivePanel('notes');
  };

  const handleSaveNote = (note: Omit<Note, 'id' | 'timestamp'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handlePanelChange = useCallback((panel: 'ai' | 'notes' | 'typography' | null) => {
    setActivePanel(panel);
  }, []);

  const chapterNames = [
    'The Characters of the Story',
    'Attention and Effort',
    'The Lazy Controller',
    'The Associative Machine',
    'Cognitive Ease',
    'Norms, Surprises, and Causes',
    'A Machine for Jumping to Conclusions',
    'How Judgments Happen',
  ];

  const handleBookmark = useCallback(() => {
    const el = scrollRef.current;
    const excerpt = el
      ? PARAGRAPHS[Math.min(Math.floor((progress / 100) * PARAGRAPHS.length), PARAGRAPHS.length - 1)].slice(0, 80) + '…'
      : '';

    const entry: BookmarkEntry = {
      id: Date.now().toString(),
      chapter: chapterNames[activeChapter],
      excerpt,
    };
    setBookmarks((prev) => [entry, ...prev]);
  }, [progress, activeChapter]);

  const handleRemoveBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const handleChapterSelect = useCallback((index: number) => {
    setActiveChapter(index);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div ref={wrapperRef} className="h-screen flex flex-col overflow-hidden bg-reader-bg">
      <NavigationPanel
        isOpen={navOpen}
        onToggle={() => setNavOpen((p) => !p)}
        activeChapterIndex={activeChapter}
        onChapterSelect={handleChapterSelect}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
      />
      <SideNotesPanel
        isOpen={notesOpen}
        onToggle={() => setNotesOpen((p) => !p)}
        activeChapter={activeChapter}
      />
      <TopBar
        title="Thinking, Fast and Slow"
        progress={progress}
        onBack={() => navigate('/')}
        onMenuOpen={() => setNavOpen((p) => !p)}
        onBookmark={handleBookmark}
      />

      {/* Reading area — pushed by panels on desktop */}
      <div
        className="flex-1 overflow-y-auto transition-[margin] duration-300 ease-out"
        ref={scrollRef}
        onClick={handleReadingAreaTap}
        style={{
          marginLeft: undefined,
          marginRight: undefined,
        }}
      >
        {/* Desktop margin push via CSS */}
        <style>{`
          @media (min-width: 768px) {
            .reader-scroll-area {
              margin-left: ${navOpen ? '260px' : '0px'};
              margin-right: ${notesOpen ? '260px' : '0px'};
              transition: margin 300ms cubic-bezier(0.16, 1, 0.3, 1);
            }
          }
        `}</style>
        <div className="reader-scroll-area">
          <ReadingArea
            chapterLabel="Chapter 4"
            chapterTitle="The Associative Machine"
            paragraphs={PARAGRAPHS}
            highlights={HIGHLIGHTS}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onHighlightTap={handleHighlightTap}
          />
        </div>
      </div>

      <BottomPanel
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
        barVisible={barVisible}
        onBarDismiss={() => { setBarVisible(false); setActivePanel(null); }}
        notes={notes}
        onSaveNote={handleSaveNote}
        pendingQuote={pendingQuote}
        onClearPendingQuote={() => setPendingQuote('')}
        fontFamily={fontFamily}
        fontSize={fontSize}
        theme={theme}
        onFontFamilyChange={setFontFamily}
        onFontSizeChange={setFontSize}
        onThemeChange={setTheme}
      />
    </div>
  );
};

export default ReaderScreen;
