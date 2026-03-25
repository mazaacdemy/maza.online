import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder'
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { paymentStatus: 'PAID' },
      });
    }
  }

  return NextResponse.json({ received: true });
}
