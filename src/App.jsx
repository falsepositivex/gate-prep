import { useState } from 'react';
import Header from './components/Header/Header.jsx';
import TabNav from './components/TabNav/TabNav.jsx';
import DashboardView from './views/DashboardView/DashboardView.jsx';
import SyllabusView from './views/SyllabusView/SyllabusView.jsx';
import MockTestsView from './views/MockTestsView/MockTestsView.jsx';
import StudyLogView from './views/StudyLogView/StudyLogView.jsx';
import UtilizationView from './views/UtilizationView/UtilizationView.jsx';
import MistakesView from './views/MistakesView/MistakesView.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dash');

  return (
    <div className="shell">
      <Header />
      <TabNav active={activeTab} onChange={setActiveTab} />

      {activeTab === 'dash'     && <DashboardView />}
      {activeTab === 'syllabus' && <SyllabusView />}
      {activeTab === 'tests'    && <MockTestsView />}
      {activeTab === 'log'      && <StudyLogView />}
      {activeTab === 'util'     && <UtilizationView />}
      {activeTab === 'mistakes' && <MistakesView />}

      <footer className="tip">
        Data is stored privately in this browser only — use Export to back it up.
        · Prep deadline: 31 Dec 2026 · GATE 2027 CS exam window: 6–21 Feb 2027 (IIT Madras)
      </footer>
    </div>
  );
}
