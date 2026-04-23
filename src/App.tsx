import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import TaijiLoader from './components/TaijiLoader'

const Home = lazy(() => import('./pages/Home'))
const Bazi = lazy(() => import('./pages/Bazi'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Daily = lazy(() => import('./pages/Daily'))
const FengShui = lazy(() => import('./pages/FengShui'))
const CompassPage = lazy(() => import('./pages/CompassPage'))
const UserProfile = lazy(() => import('./pages/UserProfile'))

export default function App() {
  return (
    <Suspense fallback={<TaijiLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bazi" element={<Bazi />} />
          <Route path="/fengshui" element={<FengShui />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/compass" element={<CompassPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
