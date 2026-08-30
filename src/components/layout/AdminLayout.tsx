import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Swords, 
  Users, 
  History, 
  Settings, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { MOCK_USERS } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/layout/Logo'


const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Match Management', path: '/admin/matches', icon: Swords },
  { label: 'Player Roster', path: '/admin/roster', icon: Users },
  { label: 'Audit Log', path: '/admin/audit', icon: History },
  { label: 'Group Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const currentUser = MOCK_USERS[0];

  const handleSignOut = () => {
    navigate('/');
  };

  const NavContent = () => (
    <div className="flex flex-col justify-between h-full py-4">

      <nav className="flex flex-col items-start gap-1 mt-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `w-full md:w-fit flex items-center gap-2.5 px-3.5 py-2 rounded-full text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Sign Out */}
      <div className="pt-6 border-t border-zinc-100 flex flex-col items-start gap-3 mt-auto">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
            <AvatarFallback className="text-[10px] font-bold bg-zinc-100 text-zinc-700">
              {currentUser.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-800 truncate leading-tight">
              {currentUser.displayName}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-fit flex items-center gap-2 px-3 py-1.5 h-auto rounded-full text-xs font-medium text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-white text-zinc-900 flex flex-col md:flex-row antialiased overflow-hidden">
      {/* Mobile Top Navigation Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
            <AvatarFallback className="text-[9px] font-bold">
              {currentUser.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-zinc-800">
            {currentUser.displayName}
          </span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Menu className="w-4 h-4 text-zinc-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6 flex flex-col">
            <SheetHeader className="text-left mb-2">
              <SheetTitle className="text-sm font-semibold text-zinc-900">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-60 bg-transparent flex-col justify-between p-6 h-full shrink-0">
        <NavContent />
      </aside>

      {/* Main Content Area - Single Scroll Parent */}
      <main className="flex-1 h-full w-full min-w-0 overflow-y-auto p-4 sm:p-6 md:p-10 pb-16">
        <Outlet />
      </main>
    </div>
  );
}