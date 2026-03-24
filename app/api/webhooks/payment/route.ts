import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // NOTE: Simplified webhook handler for Stripe/Paymob
    // In production, MUST verify the signature headers (e.g. stripe-signature or paymob HMAC string)
    
    // Assume payload format: { eventType: 'PAYMENT_SUCCESS', transactionId: '...', metadata: { appointmentId: '...' } }
    
    if (payload.eventType === 'PAYMENT_SUCCESS' && payload.metadata?.appointmentId) {
      // Update appointment status to confirm payment
      await prisma.appointment.update({
        where: { id: payload.metadata.appointmentId },
        data: { status: 'Confirmed_Paid' }
      });
      
      return NextResponse.json({ received: true, status: 'Payment Recorded and Appointment Confirmed' });
    }

    return NextResponse.json({ received: true, message: 'Unhandled or irrelevant event type' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
