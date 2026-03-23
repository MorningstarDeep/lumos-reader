interface TypographyPanelProps {
  fontFamily: string;
  fontSize: number;
  theme: 'light' | 'sepia' | 'dark';
  onFontFamilyChange: (f: string) => void;
  onFontSizeChange: (s: number) => void;
  onThemeChange: (t: 'light' | 'sepia' | 'dark') => void;
}

const FONTS = ['Lora', 'Crimson Pro', 'Source Serif 4'];
const THEMES: { label: string; value: 'light' | 'sepia' | 'dark'; swatch: string }[] = [
  { label: 'Light', value: 'light', swatch: 'bg-[hsl(39,60%,97%)]' },
  { label: 'Sepia', value: 'sepia', swatch: 'bg-[hsl(42,45%,89%)]' },
  { label: 'Dark', value: 'dark', swatch: 'bg-[hsl(30,8%,7%)]' },
];

const TypographyPanel = ({
  fontFamily,
  fontSize,
  theme,
  onFontFamilyChange,
  onFontSizeChange,
  onThemeChange,
}: TypographyPanelProps) => {
  return (
    <div className="px-5 py-5 space-y-6">
      {/* Typeface */}
      <div>
        <p className="text-xs tracking-widest uppercase text-reader-muted mb-3">Typeface</p>
        <div className="flex gap-2">
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => onFontFamilyChange(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${
                fontFamily === f
                  ? 'bg-reader-accent text-reader-surface'
                  : 'bg-reader-bg text-reader-text border border-reader-border'
              }`}
              style={{ fontFamily: f }}
            >
              {f.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <p className="text-xs tracking-widest uppercase text-reader-muted mb-3">
          Font Size — {fontSize}px
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-reader-muted">A</span>
          <input
            type="range"
            min={15}
            max={24}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="flex-1 accent-reader-accent h-1"
          />
          <span className="text-lg text-reader-muted">A</span>
        </div>
      </div>

      {/* Theme */}
      <div>
        <p className="text-xs tracking-widest uppercase text-reader-muted mb-3">Theme</p>
        <div className="flex gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => onThemeChange(t.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                theme === t.value
                  ? 'ring-2 ring-reader-accent'
                  : 'border border-reader-border'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${t.swatch} border border-reader-border`} />
              <span className="text-reader-text">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypographyPanel;
