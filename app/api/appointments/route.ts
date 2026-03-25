import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { specialistId, date, type } = await req.json();

    if (!specialistId || !date || !type) {
        return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!currentUser) throw new Error('User not found');

    const appointmentPrice = type === 'Telehealth' ? 500 : 800; // Price in EGP

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        type,
        status: 'Scheduled',
        paymentStatus: 'PENDING',
        price: appointmentPrice,
        parentId: currentUser.id,
        specialistId,
      }
    });

    try {
      // Create Stripe checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'egp',
              product_data: {
                name: `جلسة ${type === 'Telehealth' ? 'عن بُعد' : 'بالمركز'}`,
              },
              unit_amount: appointmentPrice * 100, // Amount in piastres/cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parent?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?payment=cancelled`,
        metadata: {
          appointmentId: appointment.id,
        },
      });

      // Update appointment with session ID
      await prisma.appointment.update({
        where: { id: appointment.id },
        data: { stripeSessionId: checkoutSession.id }
      });

      return NextResponse.json({ success: true, url: checkoutSession.url });
    } catch (stripeError: any) {
      console.error("Stripe Checkout Error:", stripeError);
      // Fallback: Return successful appointment creation without payment link if Stripe fails
      return NextResponse.json({ 
        success: true, 
        appointment,
        message: "تم الحجز، لكن نظام الدفع غير متاح حالياً." 
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
