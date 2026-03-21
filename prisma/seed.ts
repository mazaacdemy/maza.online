import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Maza@2026', 10)

  // 1. Create Specialists
  const specialist1 = await prisma.user.upsert({
    where: { email: 'specialist@maza.com' },
    update: {},
    create: {
      email: 'specialist@maza.com',
      name: 'د. مصطفى كمال',
      password: hashedPassword,
      role: 'SPECIALIST',
    },
  })

  const specialist2 = await prisma.user.upsert({
    where: { email: 'dr.sara@maza.com' },
    update: {},
    create: {
      email: 'dr.sara@maza.com',
      name: 'د. سارة أحمد',
      password: hashedPassword,
      role: 'SPECIALIST',
    },
  })

  // 2. Create Parent
  const parent = await prisma.user.upsert({
    where: { email: 'parent@maza.com' },
    update: {},
    create: {
      email: 'parent@maza.com',
      name: 'أحمد محمود',
      password: hashedPassword,
      role: 'PARENT',
    },
  })

  // 3. Create Patients
  const patient1 = await prisma.patient.upsert({
    where: { id: 'patient-1' },
    update: {},
    create: {
      id: 'patient-1',
      name: 'ياسين محمد',
      dateOfBirth: new Date('2018-05-15'),
      diagnosis: 'Autism Spectrum Disorder',
      parentId: parent.id,
    },
  })

  const patient2 = await prisma.patient.upsert({
    where: { id: 'patient-2' },
    update: {},
    create: {
      id: 'patient-2',
      name: 'ليلى أحمد',
      dateOfBirth: new Date('2020-10-20'),
      diagnosis: 'Typical Needs (Speech Focus)',
      parentId: parent.id,
    },
  })

  const patient3 = await prisma.patient.upsert({
    where: { id: 'patient-3' },
    update: {},
    create: {
      id: 'patient-3',
      name: 'يحيى إبراهيم',
      dateOfBirth: new Date('2019-03-10'),
      diagnosis: 'Delayed Speech',
      parentId: parent.id,
    },
  })

  // 4. Create Appointments
  await prisma.appointment.deleteMany({}) // Clear for fresh seed
  await prisma.appointment.createMany({
    data: [
      {
        date: new Date(),
        type: 'Telehealth',
        status: 'Scheduled',
        specialistId: specialist1.id,
        parentId: parent.id,
      },
      {
        date: new Date(Date.now() - 86400000), // Yesterday
        type: 'In-person',
        status: 'Completed',
        specialistId: specialist1.id,
        parentId: parent.id,
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        type: 'Telehealth',
        status: 'Scheduled',
        specialistId: specialist2.id,
        parentId: parent.id,
      },
      {
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        type: 'In-person',
        status: 'Scheduled',
        specialistId: specialist1.id,
        parentId: parent.id,
      },
      {
        date: new Date(Date.now() - 259200000), // 3 days ago
        type: 'Telehealth',
        status: 'Cancelled',
        specialistId: specialist2.id,
        parentId: parent.id,
      },
    ],
  })

  // 5. Create Assessments
  await prisma.assessment.deleteMany({}) // Clear for fresh seed
  await prisma.assessment.createMany({
    data: [
      {
        patientId: patient1.id,
        specialistId: specialist1.id,
        type: 'CARS-2 (Autism Assessment)',
        aiSummary: 'الطفل يظهر تحسناً ملحوظاً في التواصل البصري، ولكنه لا يزال يواجه تحديات في التفاعل الاجتماعي التلقائي.',
        aiProposedPlan: 'تكثيف جلسات تنمية المهارات الاجتماعية مع التركيز على اللعب المشترك.',
      },
      {
        patientId: patient2.id,
        specialistId: specialist1.id,
        type: 'Speech & Language Evaluation',
        aiSummary: 'تأخر بسيط في مخارج الحروف، خاصة حروف (السين، الضاد). استجابة سريعة للتدريب.',
        aiProposedPlan: 'خطة تدريبية مكثفة لمخارج الحروف لمدة 3 أشهر مع متابعة أسبوعية.',
      },
      {
        patientId: patient3.id,
        specialistId: specialist2.id,
        type: 'Behavioral Assessment',
        aiSummary: 'يظهر الطفل نوبات غضب عند تغيير الروتين. يحتاج إلى تهيئة مسبقة للأنشطة المختلفة.',
        aiProposedPlan: 'استخدام جداول مرئية (Visual Schedules) داخل المنزل لتقليل حدة نوبات الغضب.',
      },
    ],
  })

  console.log('✅ Database seeded successfully with diverse Demo Data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
