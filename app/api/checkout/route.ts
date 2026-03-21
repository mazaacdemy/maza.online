import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { patientName, age, appointmentDate, currency, paymentMethod } = await request.json();

    // 1. Simulate Geo-Pricing Logic (Gateway routing)
    let gateway = 'Stripe (USD)';
    if (currency === 'EGP' || paymentMethod === 'Fawry' || paymentMethod === 'Meeza') {
      gateway = 'Paymob (EGP)';
    }
    const transactionId = `TXN_${gateway.split(' ')[0].toUpperCase()}_${Math.random().toString(36).substr(2, 9)}`;

    // 2. Database Mutations (Adding a patient and scheduling an appointment)
    
    // We mock the user authentications to bypass empty table issues during MVP testing
    const placeholderParentId = "mock-parent-1234";
    const placeholderSpecialistId = "mock-specialist-5678";

    // Upsert a test user to ensure foreign keys do not fail
    const mockParent = await prisma.user.upsert({
      where: { email: "tester@maza.com" },
      update: {},
      create: {
        id: placeholderParentId,
        name: "Test Parent",
        email: "tester@maza.com",
        password: "hashedpassword123",
        role: "PARENT"
      }
    });

    const mockSpecialist = await prisma.user.upsert({
      where: { email: "dr.test@maza.com" },
      update: {},
      create: {
        id: placeholderSpecialistId,
        name: "Dr. Ahmed المراجع",
        email: "dr.test@maza.com",
        password: "hashedpassword123",
        role: "SPECIALIST"
      }
    });

    // Write Patient to DB
    const patient = await prisma.patient.create({
      data: {
        name: patientName,
        dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - Number(age))),
        parentId: mockParent.id,
      }
    });

    // Write Appointment to DB
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(appointmentDate),
        type: "Telehealth Video Call",
        status: "Scheduled",
        parentId: mockParent.id,
        specialistId: mockSpecialist.id
      }
    });

    return NextResponse.json({
      success: true,
      transactionId,
      gateway,
      appointmentId: appointment.id,
      patientId: patient.id,
      message: `تم حجز الجلسة بنجاح عبر ${gateway}`
    });

  } catch (error: any) {
    console.error("Checkout System Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
