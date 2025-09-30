import { createContext, useContext, useState, ReactNode } from 'react';

export type Route = 
  | { name: 'home' }
  | { name: 'playbooks'; params?: { tab?: 'all' | 'private' | 'shared' | 'harvey' } }
  | { name: 'playbook-review'; params: { playbookId: number; playbookTitle: string; showLoading?: boolean } }
  | { name: 'playbook-rule-detail'; params: { ruleId: number; ruleTitle: string } }
  | { name: 'messages'; params: { conversationId: string } }
  | { name: 'settings' }
  | { name: 'history' };

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  updateCurrentRoute: (route: Route) => void;
  history: Route[];
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function ChatPanelRouter({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Route[]>([{ name: 'home' }]);
  const currentRoute = history[history.length - 1];

  const navigate = (route: Route) => {
    setHistory(prev => [...prev, route]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const updateCurrentRoute = (route: Route) => {
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1] = route;
      return newHistory;
    });
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack, updateCurrentRoute, history }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useChatRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useChatRouter must be used within ChatPanelRouter');
  }
  return context;
}
