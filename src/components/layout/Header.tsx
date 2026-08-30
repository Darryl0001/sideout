import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const publicNavItems = [
  { label: 'Home', path: '/', end: true },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Players', path: '/players' },
  { label: 'Matches', path: '/matches' },
  { label: 'Courts', path: '/courts' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto grid h-[76px] max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="w-fit transition-opacity hover:opacity-70"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {publicNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  'relative py-7 text-[15px] font-medium transition-colors',
                  'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full',
                  'after:transition-all after:duration-200',
                  isActive
                    ? 'text-foreground after:bg-foreground'
                    : 'text-muted-foreground after:scale-x-0 hover:text-foreground',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex justify-end">
          <Link
            to="/admin/login"
            className="hidden text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Admin
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-md md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto max-w-[1500px] px-6 py-4">
            <div className="flex flex-col">
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'border-b py-3.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}