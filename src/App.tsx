import { useState } from 'react';
import { HomePage } from './components/layout/HomePage';
import { Layout } from './components/layout/Layout';
import type { PanelView } from './components/layout/Sidebar';

type Page = 'home' | 'app';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [initialModule, setInitialModule] = useState<PanelView>('chat');

  if (page === 'home') {
    return (
      <HomePage
        onEnter={(module) => {
          setInitialModule(module);
          setPage('app');
        }}
      />
    );
  }

  return <Layout initialModule={initialModule} />;
}
