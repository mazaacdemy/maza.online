import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const appointments = await prisma.appointment.findMany({
    include: {
      parent: true,
      specialist: true
    }
  });
  const assessments = await prisma.assessment.findMany({
    include: {
      patient: true,
      specialist: true
    }
  });

  console.log('--- Appointments ---');
  console.log(JSON.stringify(appointments, null, 2));
  console.log('--- Assessments ---');
  console.log(JSON.stringify(assessments, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
