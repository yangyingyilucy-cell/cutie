import { useState, useEffect } from 'react';
import { Sidebar, type PanelView } from './Sidebar';
import { ChatView } from '../chat/ChatView';
import { StoryView } from '../story/StoryView';
import { DiaryView } from '../diary/DiaryView';
import { SettingsPanel } from '../settings/SettingsPanel';
import { PetFloating } from '../pet/PetFloating';
import { useSettingsStore } from '../../stores/settingsStore';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

export function Layout({ initialModule = 'chat' }: { initialModule?: PanelView }) {
  const theme = useSettingsStore((s) => s.theme);
  const [activePanel, setActivePanel] = useState<PanelView>(initialModule);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setActivePanel(initialModule);
  }, [initialModule]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatView onToggleSidebar={handleToggleSidebar} />;
      case 'story':
        return <StoryView onToggleSidebar={handleToggleSidebar} />;
      case 'diary':
        return <DiaryView />;
      case 'settings':
        return (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
              <button onClick={handleToggleSidebar} className="opacity-50 hover:opacity-80 cursor-pointer">
                <span className="text-lg">☰</span>
              </button>
              <span className="font-medium text-sm">设置</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {isMobile ? (
        sidebarOpen && (
          <Sidebar
            active={activePanel}
            onSelect={setActivePanel}
            onHome={() => window.location.reload()}
            isMobile={true}
            onClose={handleCloseSidebar}
          />
        )
      ) : (
        <Sidebar
          active={activePanel}
          onSelect={setActivePanel}
          onHome={() => window.location.reload()}
          isMobile={false}
          onClose={handleCloseSidebar}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">{renderPanel()}</div>
      <PetFloating />
    </div>
  );
}
