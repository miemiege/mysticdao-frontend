import { useNavigate } from 'react-router'
import { Sparkles } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#C8A45C]/5 blur-3xl pointer-events-none" />

      {/* 标题 */}
      <h1
        className="text-4xl md:text-6xl font-bold tracking-[0.15em] text-center mb-2"
        style={{
          color: '#C8A45C',
          fontFamily: "'Cinzel', 'Noto Serif SC', serif",
          textShadow: '0 0 60px rgba(200,164,92,0.3)',
        }}
      >
        MYSTIC DAO
      </h1>
      <p className="text-white/40 text-sm tracking-[0.3em] uppercase mb-12">
        AI-Powered I Ching Oracle
      </p>

      {/* DRAW 按钮 */}
      <button
        onClick={() => navigate('/daily')}
        className="group relative px-10 py-4 rounded-full border-2 border-[#C8A45C]/60 text-[#C8A45C] tracking-[0.2em] text-sm font-medium transition-all hover:bg-[#C8A45C]/10 hover:border-[#C8A45C] hover:shadow-[0_0_40px_rgba(200,164,92,0.2)] active:scale-95 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          DRAW YOUR FORTUNE
        </span>
      </button>

      {/* Free Forever */}
      <p className="mt-8 text-white/20 text-xs tracking-[0.2em]">
        FREE FOREVER · NO SIGN-UP
      </p>

      {/* 底部装饰线 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-8 h-px bg-white/10" />
        <span className="text-white/15 text-[10px] tracking-[0.3em]">䷀ ䷁ ䷂ ䷃</span>
        <div className="w-8 h-px bg-white/10" />
      </div>
    </div>
  )
}
