import React from 'react';

interface Highlight {
  id: string;
  text: string;
  paragraphIndex: number;
  startOffset: number;
}

interface ReadingAreaProps {
  chapterLabel: string;
  chapterTitle: string;
  paragraphs: string[];
  highlights: Highlight[];
  fontFamily: string;
  fontSize: number;
  onHighlightTap: (highlight: Highlight) => void;
}

const ReadingArea = ({
  chapterLabel,
  chapterTitle,
  paragraphs,
  highlights,
  fontFamily,
  fontSize,
  onHighlightTap,
}: ReadingAreaProps) => {
  const fontClass =
    fontFamily === 'Crimson Pro'
      ? 'font-crimson'
      : fontFamily === 'Source Serif 4'
        ? 'font-source'
        : 'font-body';

  const renderParagraph = (text: string, index: number) => {
    const paraHighlights = highlights.filter((h) => h.paragraphIndex === index);

    if (paraHighlights.length === 0) {
      return (
        <p
          key={index}
          className={`mb-6 text-reader-text ${index === 0 ? 'drop-cap' : ''}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
        >
          {text}
        </p>
      );
    }

    // Simple highlight rendering — find the highlight text in the paragraph
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    for (const hl of paraHighlights) {
      const idx = remaining.indexOf(hl.text);
      if (idx === -1) continue;

      if (idx > 0) {
        parts.push(<span key={keyIdx++}>{remaining.slice(0, idx)}</span>);
      }
      parts.push(
        <span
          key={keyIdx++}
          className="bg-reader-highlight rounded-sm px-0.5 cursor-pointer transition-colors hover:opacity-80 active:scale-[0.99]"
          onClick={() => onHighlightTap(hl)}
          role="button"
          tabIndex={0}
        >
          {hl.text}
        </span>
      );
      remaining = remaining.slice(idx + hl.text.length);
    }
    if (remaining) {
      parts.push(<span key={keyIdx++}>{remaining}</span>);
    }

    return (
      <p
        key={index}
        className={`mb-6 text-reader-text ${index === 0 ? 'drop-cap' : ''}`}
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
      >
        {parts}
      </p>
    );
  };

  return (
    <div className="pt-[54px] pb-[60px] min-h-screen bg-reader-bg">
      <div className={`max-w-[660px] mx-auto px-5 pt-12 ${fontClass}`}>
        <p className="text-xs tracking-[0.2em] uppercase text-reader-muted mb-3">
          {chapterLabel}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-reader-text mb-10 leading-tight">
          {chapterTitle}
        </h2>
        {paragraphs.map((p, i) => renderParagraph(p, i))}
      </div>
    </div>
  );
};

export default ReadingArea;
