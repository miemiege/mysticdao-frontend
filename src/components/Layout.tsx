import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
