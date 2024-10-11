import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function importCsvToUser(csvFilePath: string) {
  if (!fs.existsSync(csvFilePath)) {
    console.warn(`CSV file not found: ${csvFilePath}. Skipping user seeding.`);
    return;
  }

  const userData = await new Promise<any[]>((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });

  for (const userItem of userData) {
    const email = userItem.email;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping.`);
      continue;
    }

    const processedUser = {
      email: userItem.email,
      firstName: userItem.firstName,
      lastName: userItem.lastName,
      middleName: userItem.middleName || null,
      faculty: userItem.faculty,
      group: userItem.group,
      passwordHash: userItem.passwordHash,
      role: userItem.role || 'admin',
    };

    try {
      await prisma.user.create({
        data: processedUser,
      });
      console.log(`Successfully imported user: ${processedUser.email}`);
    } catch (err) {
      console.error(`Error inserting user data:`, err);
    }
  }
}

async function main() {
  const usersCsvPath = path.join(__dirname, '..', '..', 'data', 'users.csv');

  await importCsvToUser(usersCsvPath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
