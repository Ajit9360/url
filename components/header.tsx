'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/generator', label: 'Generator' },
    { href: '/dashboard', label: 'Dashboard', requireAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <QrCode className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">QR Studio</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            {links.map((link) => {
              // Skip auth-required links if user is not authenticated
              if (link.requireAuth && !user) return null;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === link.href ? "text-foreground font-medium" : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}