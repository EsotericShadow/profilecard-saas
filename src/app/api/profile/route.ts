import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json(profile || {});
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      name: data.name,
      title: data.title,
      handle: data.handle,
      status: data.status,
      contactText: data.contactText,
      avatarUrl: data.avatarUrl,
      iconUrl: data.iconUrl,
      grainUrl: data.grainUrl,
      miniAvatarUrl: data.miniAvatarUrl,
      behindGradient: data.behindGradient,
      innerGradient: data.innerGradient,
      showBehindGradient: data.showBehindGradient,
      enableTilt: data.enableTilt,
      showUserInfo: data.showUserInfo,
      cardRadius: data.cardRadius,
      bio: data.bio,
      theme: data.theme,
    },
    create: {
      userId: session.user.id,
      name: data.name,
      title: data.title,
      handle: data.handle,
      status: data.status,
      contactText: data.contactText,
      avatarUrl: data.avatarUrl,
      iconUrl: data.iconUrl,
      grainUrl: data.grainUrl,
      miniAvatarUrl: data.miniAvatarUrl,
      behindGradient: data.behindGradient,
      innerGradient: data.innerGradient,
      showBehindGradient: data.showBehindGradient,
      enableTilt: data.enableTilt,
      showUserInfo: data.showUserInfo,
      cardRadius: data.cardRadius,
      bio: data.bio,
      theme: data.theme,
    },
  });
  return NextResponse.json(profile);
}