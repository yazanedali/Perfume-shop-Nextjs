import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
await prisma.product.updateMany({
  where: { isActive: undefined },
  data: { isActive: true }
});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

