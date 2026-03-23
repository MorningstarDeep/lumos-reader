import { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const MOCK_RESPONSES = [
  "That's a great question. Kahneman describes System 1 as operating automatically and quickly, with little or no effort and no sense of voluntary control. It's the fast, intuitive part of our thinking.",
  "The anchoring effect is a cognitive bias where people rely too heavily on the first piece of information they encounter. In the chapter, Kahneman shows how even random numbers can influence our estimates.",
  "Priming works by activating associations in memory. When you encounter a word or idea, related concepts become temporarily more accessible, influencing your subsequent thoughts and actions without your awareness.",
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: "Hi! I'm Lumos. Ask me anything about what you're reading." },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? '' : ''}`}>
              {msg.role === 'ai' && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-reader-accent mb-1 block">
                  Lumos
                </span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-reader-user-msg text-reader-text rounded-br-md'
                    : 'bg-reader-ai-msg text-reader-text rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-reader-border">
        <div className="flex gap-2 items-end">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about this chapter..."
            className="flex-1 bg-reader-bg border border-reader-border rounded-xl px-4 py-2.5 text-sm text-reader-text placeholder:text-reader-muted focus:outline-none focus:ring-1 focus:ring-reader-accent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-reader-accent text-reader-surface disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
