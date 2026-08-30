import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} PickleStats. All rights reserved.</p>
        <p className="text-xs">Community Winrate & Score Display</p>
      </div>
    </footer>
  );
};