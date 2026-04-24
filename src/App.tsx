import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import TaijiLoader from './components/TaijiLoader'

const Home = lazy(() => import('./pages/Home'))
const Daily = lazy(() => import('./pages/Daily'))
const FengShui = lazy(() => import('./pages/FengShui'))

export default function App() {
  return (
    <Suspense fallback={<TaijiLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fengshui" element={<FengShui />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
