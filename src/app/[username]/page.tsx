import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ProfileCard from '@/components/blocks/ProfileCard/ProfileCard';

interface LinkItem {
  id: string;
  url: string;
  type: string;
  order: number;
}

interface Params {
  username: string;
}

export default async function PublicProfilePage({ params }: { params: Promise<Params> }) {
  const { username } = await params; // Await params

  const profile = await prisma.profile.findFirst({
    where: { handle: username },
    include: { links: { orderBy: { order: 'asc' } } },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">@{profile.handle}</h1>
      <div className="w-full max-w-sm mb-8">
        <ProfileCard
          name={profile.name}
          title={profile.title}
          handle={profile.handle ?? ''}
          status={profile.status}
          contactText={profile.contactText}
          avatarUrl={profile.avatarUrl}
          iconUrl={profile.iconUrl}
          grainUrl={profile.grainUrl}
          miniAvatarUrl={profile.miniAvatarUrl}
          behindGradient={profile.behindGradient}
          innerGradient={profile.innerGradient}
          showBehindGradient={profile.showBehindGradient}
          enableTilt={profile.enableTilt}
          showUserInfo={profile.showUserInfo}
          cardRadius={profile.cardRadius}
          className="custom-profile-card"
        />
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Links</h2>
        {profile.links.length === 0 ? (
          <p className="text-white">No links available.</p>
        ) : (
          <ul className="space-y-4">
            {profile.links.map((link: LinkItem) => (
              <li key={link.id} className="bg-gray-800 p-4 rounded border border-gray-600">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  {link.url}
                </a>
                <p className="text-gray-400 text-sm">Type: {link.type}, Order: {link.order}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}