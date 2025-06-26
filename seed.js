import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: '$2b$10$jmTOxpFXHCJBbx3EVTRgDOT.MiCmxMu8Yzv9ondEnWtX7Zq/yXnqi', // Hash for password123
      plan: 'free',
      profile: {
        create: {
          handle: 'testuser', // Required non-nullable field
          name: 'Test User',
          showBehindGradient: true,
          enableTilt: true,
          showUserInfo: true,
          cardRadius: 30,
        },
      },
    },
  });
  console.log('Test user created successfully');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });