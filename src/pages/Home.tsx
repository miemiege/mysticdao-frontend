import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(200,164,92,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Brand */}
        <div className="mb-8">
          <h1
            className="text-5xl md:text-7xl font-bold text-white tracking-tight font-heading mb-4"
            style={{ textShadow: '0 0 50px rgba(200,164,92,0.2)' }}
          >
            <span className="text-gold">Mystic</span>DAO
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Ancient I Ching wisdom meets modern AI guidance
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/daily?ref=share&utm_source=twitter')}
          className="relative px-12 py-5 bg-gradient-to-r from-gold via-gold-light to-gold text-black font-semibold text-base rounded-pill transition-all duration-300 flex items-center gap-3 group mx-auto"
          style={{ boxShadow: '0 0 40px rgba(200,164,92,0.2), 0 4px 20px rgba(0,0,0,0.3)' }}
        >
          <span className="tracking-wider uppercase text-sm">Try Your Own Oracle</span>
        </button>

        {/* Subtitle */}
        <p className="mt-5 text-sm text-text-muted tracking-wide">
          Draw your daily hexagram · Connect with ancient wisdom
        </p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20 pointer-events-none" />
    </div>
  )
}
