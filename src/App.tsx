import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Bazi from './pages/Bazi'
import Pricing from './pages/Pricing'
import Daily from './pages/Daily'
import FengShui from './pages/FengShui'
import CompassPage from './pages/CompassPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bazi" element={<Bazi />} />
        <Route path="/fengshui" element={<FengShui />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/compass" element={<CompassPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
