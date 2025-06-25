'use client';

import { useSession, signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e]">
      {session ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome, {session.user.name}</h2>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <h2 className="text-2xl text-white">Not signed in</h2>
      )}
    </div>
  );
}
