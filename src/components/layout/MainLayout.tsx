import { ReactNode } from 'react';
import { Header } from './Header';
import { User } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  currentUser: User | null;
  onLoginToggle: () => void;
  activeTab: 'leaderboard' | 'players';
  onTabChange: (tab: 'leaderboard' | 'players') => void;
}

export function MainLayout({
  children,
  currentUser,
  onLoginToggle,
  activeTab,
  onTabChange,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header
        currentUser={currentUser}
        onLoginToggle={onLoginToggle}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}