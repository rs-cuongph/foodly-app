/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  console.log(`Start seeding ...`);

  console.log(`==============> SEEDING ORGANIZATION <===============`);
  await prisma.organization.createManyAndReturn({
    data: [
      {
        short_name: 'GMO DN',
        name: 'GMO Zcom Runsystem (Đà Nẵng Branch)',
        description: '',
      },
    ],
  });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
