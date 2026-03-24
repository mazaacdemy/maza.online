import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mailer";
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRoles = ["PARENT", "SPECIALIST", "CENTER", "ADMIN"];
    const targetRole = validRoles.includes(role) ? role : "PARENT";
    
    // Generate secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: targetRole as any,
        verificationToken
      },
    });

    try {
      // Send Email. This won't block the request if SMTP is missing in development mode.
      await sendVerificationEmail(email, verificationToken);
    } catch (mailErr) {
      console.log('Failed to send verification email (likely no SMTP configured)', mailErr);
    }

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role } });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
