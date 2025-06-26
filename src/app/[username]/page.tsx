import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ProfileCard from '@/components/blocks/ProfileCard/ProfileCard';
import { Suspense } from 'react';
import { cache } from 'react';
import styles from './ProfilePage.module.css';

// Define interfaces for type safety
interface LinkItem {
  id: string;
  url: string;
  type: string;
  order: number;
}

interface Profile {
  id: string;
  handle: string;
  name: string | null;
  title: string | null;
  status: string | null;
  contactText: string | null;
  avatarUrl: string | null;
  iconUrl: string | null;
  grainUrl: string | null;
  miniAvatarUrl: string | null;
  behindGradient: string | null;
  innerGradient: string | null;
  showBehindGradient: boolean;
  enableTilt: boolean;
  showUserInfo: boolean;
  cardRadius: number;
  links: LinkItem[];
}

interface Params {
  username: string;
}

// Cache the profile query to avoid repeated database hits
const getProfile = cache(async (username: string): Promise<Profile | null> => {
  return prisma.profile.findFirst({
    where: { handle: username },
    select: {
      id: true,
      handle: true,
      name: true,
      title: true,
      status: true,
      contactText: true,
      avatarUrl: true,
      iconUrl: true,
      grainUrl: true,
      miniAvatarUrl: true,
      behindGradient: true,
      innerGradient: true,
      showBehindGradient: true,
      enableTilt: true,
      showUserInfo: true,
      cardRadius: true,
      links: {
        select: {
          id: true,
          url: true,
          type: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });
});

// Static params for pre-rendering (optional, if usernames are known)
// export async function generateStaticParams() {
//   const profiles = await prisma.profile.findMany({ select: { handle: true } });
//   return profiles.map((profile) => ({ username: profile.handle }));
// }

// Main page component
export default async function PublicProfilePage({ params }: { params: Promise<Params> }) {
  const { username } = await params;

  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1e] to-[#2c2c2e] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">@{profile.handle}</h1>
      <div className={`w-full max-w-sm mb-8 ${styles.profileCardContainer}`}>
        <ProfileCard
          name={profile.name ?? undefined}
          title={profile.title ?? undefined}
          handle={profile.handle}
          status={profile.status ?? undefined}
          contactText={profile.contactText ?? undefined}
          avatarUrl={profile.avatarUrl ?? undefined}
          iconUrl={profile.iconUrl ?? undefined}
          grainUrl={profile.grainUrl ?? undefined}
          miniAvatarUrl={profile.miniAvatarUrl ?? undefined}
          behindGradient={profile.behindGradient ?? undefined}
          innerGradient={profile.innerGradient ?? undefined}
          showBehindGradient={profile.showBehindGradient}
          enableTilt={profile.enableTilt}
          showUserInfo={profile.showUserInfo}
          cardRadius={profile.cardRadius}
          className="custom-profile-card"
        />
      </div>

      {/* Defer links section with Suspense */}
      <Suspense fallback={<p className="text-white">Loading links...</p>}>
        <LinksSection links={profile.links} />
      </Suspense>
    </div>
  );
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Separate component for links to enable deferred loading
async function LinksSection({ links }: { links: LinkItem[] }) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Links</h2>
      {links.length === 0 ? (
        <p className="text-white">No links available.</p>
      ) : (
        <ul className="space-y-4">
          {links.map((link) => (
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
  );
}