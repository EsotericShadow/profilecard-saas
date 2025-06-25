'use client';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e]">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e]">
      <aside className="w-64 bg-gray-900 p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/profile" className="p-2 text-white hover:bg-gray-700 rounded">
            Profile Settings
          </Link>
          <Link href="/dashboard/appearance" className="p-2 text-white hover:bg-gray-700 rounded">
            Appearance/Themes
          </Link>
          <Link href="/dashboard/links" className="p-2 text-white hover:bg-gray-700 rounded">
            Links
          </Link>
          <Link href="/dashboard/analytics" className="p-2 text-white hover:bg-gray-700 rounded">
            Analytics
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-white hover:bg-red-600 rounded text-left"
          >
            Sign Out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}