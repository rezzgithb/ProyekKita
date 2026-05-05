import { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Swipe detection - hanya di area bebas, tidak di form/button
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const isSwiping = useRef(false);
  
  const handleTouchStart = useCallback((e) => {
    // Skip swipe jika target adalah input, button, atau elemen interaktif
    const target = e.target;
    const interactiveElements = ['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'A'];
    if (interactiveElements.includes(target.tagName)) return;
    if (target.closest('button') || target.closest('input') || target.closest('[role="button"]')) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
  }, []);
  
  const handleTouchMove = useCallback((e) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  }, []);
  
  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current || isAnimating) {
      isSwiping.current = false;
      return;
    }
    
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    const threshold = 100; // Minimum swipe distance
    
    // Hanya swipe horizontal, abaikan jika vertical scroll dominan
    if (Math.abs(diffX) < threshold || diffY > Math.abs(diffX)) {
      isSwiping.current = false;
      return;
    }
    
    const currentIndex = pages.indexOf(currentPage);
    
    if (diffX > 0 && currentIndex < pages.length - 1) {
      setPage(pages[currentIndex + 1]);
    } else if (diffX < 0 && currentIndex > 0) {
      setPage(pages[currentIndex - 1]);
    }
    
    isSwiping.current = false;
  }, [currentPage, setPage, isAnimating]);
  
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
    type: 'tween',
    duration: 0.25,
    ease: 'easeInOut',
  };
  
  const PageComponent = pageComponents[currentPage];

  return (
    <div 
      className="app-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="app-content">
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
            className="page-wrapper"
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <BottomNav />
    </div>
  );
}

export default App;
