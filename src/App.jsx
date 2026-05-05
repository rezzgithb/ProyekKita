import { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigationStore } from './store';
import { BottomNav } from './components/navigation/BottomNav';
import { HomePage } from './pages/home';
import { BudgetPage } from './pages/budget';
import { LayoutPage } from './pages/layout';
import { CatatanPage } from './pages/catatan';
import { ToolsPage } from './pages/tools';

const pages = ['home', 'budget', 'layout', 'catatan', 'tools'];

const pageComponents = {
  home: HomePage,
  budget: BudgetPage,
  layout: LayoutPage,
  catatan: CatatanPage,
  tools: ToolsPage,
};

function App() {
  const { currentPage, setPage, direction } = useNavigationStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  
  // Swipe detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  
  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (isAnimating) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 80; // Minimum swipe distance
    
    if (Math.abs(diff) < threshold) return;
    
    const currentIndex = pages.indexOf(currentPage);
    
    if (diff > 0 && currentIndex < pages.length - 1) {
      // Swipe left - go to next page
      setPage(pages[currentIndex + 1]);
    } else if (diff < 0 && currentIndex > 0) {
      // Swipe right - go to previous page
      setPage(pages[currentIndex - 1]);
    }
  }, [currentPage, setPage, isAnimating]);
  
  // Page transition variants
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };
  
  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };
  
  const PageComponent = pageComponents[currentPage];

  return (
    <div 
      className="h-full w-full overflow-hidden bg-background flex flex-col"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence 
          mode="wait" 
          custom={direction}
          onExitComplete={() => setIsAnimating(false)}
        >
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            className="absolute inset-0 flex flex-col"
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default App;
