'use client';
// Widget chat AI cố định góc dưới phải — nút màu amber, khung chat dùng navy header

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi có thể giúp bạn tra cứu văn bản pháp lý ngành xây dựng. Hãy đặt câu hỏi.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Lỗi không xác định');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: json.answer, sources: json.sources ?? [] },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Có lỗi xảy ra: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Nút mở chat — pill shape, màu amber */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 px-5 bg-accent-amber rounded-full shadow-lg flex items-center gap-2.5 hover:brightness-95 active:scale-95 transition-all"
        style={{ color: '#412402' }}
        aria-label="Mở chat AI"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
        <span className="font-semibold text-sm tracking-wide">AI Assist</span>
      </button>

      {/* Khung chat */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border border-border-subtle rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh' }}
        >
          {/* Header — navy */}
          <div className="bg-primary-navy text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-accent-amber" />
              <span className="font-semibold text-sm">Trợ lý AI pháp lý xây dựng</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng" className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Nội dung hội thoại */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-bg-page">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary-navy text-white'
                      : 'bg-white text-gray-800 border border-border-subtle'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {/* Nguồn trích dẫn */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-text-muted font-medium mb-1">Văn bản tham chiếu:</p>
                      <ul className="space-y-0.5">
                        {msg.sources.map((src) => (
                          <li key={src.id}>
                            <Link
                              href={`/documents/${src.id}`}
                              className="text-xs text-primary-navy-light hover:underline font-mono"
                              onClick={() => setOpen(false)}
                            >
                              {src.so_hieu ?? src.ten_van_ban}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border-subtle rounded-lg px-3 py-2 flex items-center gap-2 text-text-muted">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Đang tìm kiếm...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Ô nhập */}
          <div className="border-t border-border-subtle p-2 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
              className="flex-1 border border-border-subtle rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy disabled:bg-bg-page"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary-navy text-white px-3 py-1.5 rounded-md hover:bg-primary-navy-light disabled:opacity-50 transition-colors"
              aria-label="Gửi"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
