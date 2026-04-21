import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const demoEmail = 'demo@sonopass.com';
  const demoPassword = 'demo123';

  // Check if demo user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('✅ Demo user already exists');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(demoPassword, 10);

  // Create demo user with verified email
  const demoUser = await prisma.user.create({
    data: {
      email: demoEmail,
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(), // Pre-verified so demo user can log in immediately
    },
  });

  console.log('✅ Demo user created successfully');
  console.log(`   Email: ${demoEmail}`);
  console.log(`   Password: ${demoPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
