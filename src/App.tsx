import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useSearchParams } from 'react-router'
import { trackEvent } from '@/lib/analytics'

const Home = lazy(() => import('./pages/Home'))
const Daily = lazy(() => import('./pages/Daily'))

const PageFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-gold/40 text-sm tracking-widest animate-pulse">LOADING...</div>
  </div>
)

/** 分享追踪参数 */
export const SHARE_TRACKING_PARAMS = '?ref=share&utm_source=twitter'

/** 获取带追踪参数的完整分享链接 */
export function getShareUrl(basePath = 'https://mysticdao.app'): string {
  return `${basePath}${SHARE_TRACKING_PARAMS}`
}

export default function App() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    const utmSource = searchParams.get('utm_source')

    if (ref || utmSource) {
      // 记录分享来源到 analytics
      trackEvent({
        action: 'share_link_visit',
        category: 'Acquisition',
        label: `${ref || 'unknown'} · ${utmSource || 'unknown'}`,
      })

      // 保存到 sessionStorage 供整个会话使用
      if (ref) sessionStorage.setItem('mystic_ref', ref)
      if (utmSource) sessionStorage.setItem('mystic_utm_source', utmSource)
    }
  }, [searchParams])

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  )
}
