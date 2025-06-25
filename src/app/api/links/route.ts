import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const links = await prisma.link.findMany({
      where: { profileId: { equals: (await prisma.profile.findUnique({ where: { userId: session.user.id } }))?.id } },
    });
    return NextResponse.json(links);
  } catch {
    return NextResponse.json({ error: 'Error fetching links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url, type, order } = await request.json();
  if (!url || !type || typeof order !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const link = await prisma.link.create({
      data: {
        url,
        type,
        order,
        profileId: profile.id,
      },
    });
    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: 'Error creating link' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    await prisma.link.delete({
      where: { id, profileId: profile.id },
    });
    return NextResponse.json({ message: 'Link deleted' });
  } catch {
    return NextResponse.json({ error: 'Error deleting link' }, { status: 500 });
  }
}