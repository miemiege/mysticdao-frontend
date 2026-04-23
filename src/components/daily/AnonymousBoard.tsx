import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send } from 'lucide-react';

interface BoardMessage {
  id: string;
  text: string;
  timestamp: number;
  likes: number;
}

const STORAGE_KEY = 'mysticdao_board';
const LIKES_KEY = 'mysticdao_board_likes';

function getBoardMessages(): BoardMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveBoardMessages(msgs: BoardMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-30)));
}

const AnonymousBoard: React.FC = () => {
  const [messages, setMessages] = useState<BoardMessage[]>(getBoardMessages);
  const [input, setInput] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]')); }
    catch { return new Set(); }
  });
  
  const handleSubmit = () => {
    if (!input.trim() || input.length > 140) return;
    const msg: BoardMessage = { id: Date.now().toString(), text: input.trim(), timestamp: Date.now(), likes: 0 };
    const next = [...messages, msg];
    setMessages(next);
    saveBoardMessages(next);
    setInput('');
  };
  
  const handleLike = (id: string) => {
    if (likedIds.has(id)) return;
    const nextLiked = new Set(likedIds);
    nextLiked.add(id);
    setLikedIds(nextLiked);
    localStorage.setItem(LIKES_KEY, JSON.stringify([...nextLiked]));
    const next = messages.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    setMessages(next);
    saveBoardMessages(next);
  };
  
  return (
    <div>
      {/* 发布框 */}
      <div className="mb-6 p-4 rounded-2xl border border-gold/10 bg-gold/[0.03]">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 140))}
          placeholder="分享你的感悟...（匿名，140字内）"
          className="w-full bg-transparent text-sm text-white/80 placeholder:text-text-muted resize-none outline-none min-h-[80px]"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-text-muted">{input.length}/140</span>
          <button onClick={handleSubmit} disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs hover:bg-gold/20 transition-all disabled:opacity-30">
            <Send size={12} /> 发布
          </button>
        </div>
      </div>
      
      {/* 留言列表 */}
      <div className="space-y-3">
        <AnimatePresence>
          {[...messages].reverse().map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="p-4 rounded-xl border border-gold/[0.06] bg-white/[0.02]">
                <p className="text-sm text-white/70 leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-text-muted">{new Date(msg.timestamp).toLocaleString()}</span>
                  <button onClick={() => handleLike(msg.id)}
                    className={`inline-flex items-center gap-1 text-[10px] transition-all ${likedIds.has(msg.id) ? 'text-red-400' : 'text-text-muted hover:text-red-400'}`}>
                    <Heart size={12} className={likedIds.has(msg.id) ? 'fill-red-400' : ''} /> {msg.likes}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnonymousBoard;
