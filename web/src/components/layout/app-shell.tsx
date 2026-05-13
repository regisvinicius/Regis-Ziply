import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from '../brand/wordmark';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center" aria-label="Ziply - home">
            <Wordmark text="Ziply" className="text-xl" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
          <span className="font-mono uppercase tracking-[0.08em] text-muted-foreground">
            © {new Date().getFullYear()} Ziply
          </span>
          <span className="font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Rocketseat FullStack Challenge
          </span>
        </div>
      </footer>
    </div>
  );
}
