import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header.jsx';
import TabNav from './components/TabNav/TabNav.jsx';
import DashboardView from './views/DashboardView/DashboardView.jsx';
import SyllabusView from './views/SyllabusView/SyllabusView.jsx';
import MockTestsView from './views/MockTestsView/MockTestsView.jsx';
import UtilizationView from './views/UtilizationView/UtilizationView.jsx';
import MistakesView from './views/MistakesView/MistakesView.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dash');

  return (
    <div className="min-h-screen bg-surface-0 bg-dot-pattern relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden flex justify-center">
        <div className="w-[800px] h-[300px] bg-accent/10 blur-[100px] rounded-full -top-[150px] absolute" />
      </div>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6 pb-32 md:pb-36 relative z-10">
        <Header />
        
        <main className="relative mt-6 md:mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dash'     && <DashboardView />}
              {activeTab === 'syllabus' && <SyllabusView />}
              {activeTab === 'tests'    && <MockTestsView />}
              {activeTab === 'util'     && <UtilizationView />}
              {activeTab === 'mistakes' && <MistakesView />}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-16 text-center font-mono text-xs sm:text-[13px] text-text-muted/60 leading-relaxed">
          Data is stored privately in this browser only — use Export to back it up.<br className="md:hidden" />
          <span className="hidden md:inline"> · </span>Prep deadline: 31 Dec 2026<br className="md:hidden" />
          <span className="hidden md:inline"> · </span>GATE 2027 CS exam window: 6–21 Feb 2027
        </footer>
      </div>
      
      {/* Fixed Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-none z-50 flex justify-center pb-safe-bottom">
        <div className="pointer-events-auto w-full max-w-md">
          <TabNav active={activeTab} onChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
