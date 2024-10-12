import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { User } from './types/user.type';

const prisma = new PrismaClient();

async function importCsvToUser(csvFilePath: string) {
  if (!fs.existsSync(csvFilePath)) {
    console.warn(`CSV file not found: ${csvFilePath}. Skipping user seeding.`);
    return;
  }

  const userData: User[] = await new Promise<User[]>((resolve, reject) => {
    const results: User[] = [];
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

    try {
      await prisma.user.create({
        data: userItem,
      });
      console.log(`Successfully imported user: ${userItem.email}`);
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
