const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'mazaacdemy@gmail.com';
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN', emailVerified: new Date() } // Also verify email manually to be safe
  });
  console.log(`User ${email} promoted to ADMIN and verified.`);
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
