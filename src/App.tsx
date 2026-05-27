import { useState } from 'react';
import { HomePage } from './components/layout/HomePage';
import { AcnhHomePage } from './components/layout/AcnhHomePage';
import { Layout } from './components/layout/Layout';
import { useSettingsStore } from './stores/settingsStore';
import type { PanelView } from './components/layout/Sidebar';

type Page = 'home' | 'app';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [initialModule, setInitialModule] = useState<PanelView>('chat');
  const theme = useSettingsStore((s) => s.theme);

  if (page === 'home') {
    const onEnter = (module: PanelView) => {
      setInitialModule(module);
      setPage('app');
    };

    if (theme === 'acnh') {
      return <AcnhHomePage onEnter={onEnter} />;
    }
    return <HomePage onEnter={onEnter} />;
  }

  return <Layout initialModule={initialModule} />;
}
