/* eslint-disable no-console */
import {
  PrismaClient,
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  console.log(`==============> SEEDING ORGANIZATION <===============`);
  const organization = await prisma.organization.create({
    data: {
      code: 'GMODN',
      short_name: 'GMO DN',
      name: 'GMO Zcom Runsystem (Đà Nẵng Branch)',
      description: '',
    },
  });

  // console.log(`==============> SEEDING USER <===============`);
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'admin@gmodn.com',
  //     password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9.m', // password: admin123
  //     display_name: 'Admin',
  //     role: 'ADMIN',
  //     organization_id: organization.id,
  //   },
  // });

  // console.log(
  //   `==============> SEEDING GROUPS, ORDERS AND TRANSACTIONS <===============`,
  // );

  // // Create 10 groups
  // for (let i = 0; i < 10; i++) {
  //   const group = await prisma.group.create({
  //     data: {
  //       name: faker.company.name(),
  //       created_by_id: user.id,
  //       public_start_time: faker.date.past(),
  //       public_end_time: faker.date.future(),
  //       price: faker.number.int({ min: 10000, max: 100000 }),
  //       organization_id: organization.id,
  //     },
  //   });

  //   console.log(`Created group: ${group.name}`);

  //   // Create 100 orders for each group
  //   for (let j = 0; j < 100; j++) {
  //     const orderAmount = faker.number.int({ min: 10000, max: 100000 });
  //     const order = await prisma.order.create({
  //       data: {
  //         quantity: faker.number.int({ min: 1, max: 5 }),
  //         status: faker.helpers.arrayElement(Object.values(OrderStatus)),
  //         payment_method: faker.helpers.arrayElement([
  //           'CASH',
  //           'BANK_TRANSFER',
  //           'MOMO',
  //         ]),
  //         price: orderAmount,
  //         amount: orderAmount,
  //         menu: {
  //           items: [
  //             {
  //               name: faker.commerce.productName(),
  //               price: orderAmount,
  //               quantity: 1,
  //             },
  //           ],
  //         },
  //         group_id: group.id,
  //         note: faker.lorem.sentence(),
  //         created_by_id: user.id,
  //         updated_by_id: user.id,
  //         organization_id: organization.id,
  //         created_at: faker.date.past(),
  //         updated_at: faker.date.recent(),
  //       },
  //     });

  //     // Create transaction for each order
  //     const transaction = await prisma.transaction.create({
  //       data: {
  //         status: faker.helpers.arrayElement(Object.values(TransactionStatus)),
  //         type: TransactionType.SINGLE_ORDER,
  //         unique_code: faker.string.alphanumeric(10).toUpperCase(),
  //         total_amount: orderAmount,
  //         created_by_id: user.id,
  //         organization_id: organization.id,
  //         created_at: faker.date.past(),
  //         updated_at: faker.date.recent(),
  //       },
  //     });

  //     // Link order to transaction
  //     await prisma.orderOnTransaction.create({
  //       data: {
  //         order_id: order.id,
  //         transaction_id: transaction.id,
  //         amount: orderAmount,
  //       },
  //     });

  //     // Update order with transaction_id
  //     await prisma.order.update({
  //       where: { id: order.id },
  //       data: { transaction_id: transaction.id },
  //     });

  //     if (j % 10 === 0) {
  //       console.log(`Created ${j + 1} orders for group: ${group.name}`);
  //     }
  //   }
  // }

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
