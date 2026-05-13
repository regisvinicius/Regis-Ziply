import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Wordmark } from '../brand/wordmark';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#23242f] px-4 py-8 text-[#1f2029] sm:px-8 sm:py-10">
      <main className="mx-auto w-full max-w-6xl rounded-sm bg-[#d9dbe1] p-5 shadow-[0_20px_44px_rgba(0,0,0,0.15)] sm:p-8 lg:p-10">
        <Link to="/" className="mb-6 inline-flex items-center" aria-label="Ziply - home">
          <Wordmark text="brev.ly" className="text-lg text-[#2f46b9]" />
        </Link>
        {children}
      </main>
    </div>
  );
}
