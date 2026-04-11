import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const [email, password, name = 'Ninja Admin', role = 'SUPER_ADMIN'] = process.argv.slice(2);

if (!email || !password) {
    console.error('Usage: node scripts/create-admin-user.mjs <email> <password> [name] [role]');
    process.exit(1);
}

const prisma = new PrismaClient();

try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.adminUser.upsert({
        where: { email: email.trim().toLowerCase() },
        update: {
            name,
            role,
            status: 'ACTIVE',
            password: hashedPassword,
        },
        create: {
            email: email.trim().toLowerCase(),
            name,
            role,
            status: 'ACTIVE',
            password: hashedPassword,
        },
    });

    console.log(`Admin user ready: ${adminUser.email}`);
} finally {
    await prisma.$disconnect();
}
