import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground font-sans antialiased">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          PickleStats Platform &copy; {new Date().getFullYear()} · Community Match Tracker
        </div>
      </footer>
    </div>
  );
}