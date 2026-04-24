import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

const Home = lazy(() => import('./pages/Home'))
const Daily = lazy(() => import('./pages/Daily'))
const FengShui = lazy(() => import('./pages/FengShui'))

const PageFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-gold/40 text-sm tracking-widest animate-pulse">LOADING...</div>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/fengshui" element={<FengShui />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  )
}
