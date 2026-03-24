import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId } = await req.json();

    let roomUrl = "https://ahmed-maza-demo.daily.co/test-room"; // fallback
    
    // In a real application, call Daily.co API
    if (process.env.DAILY_API_KEY) {
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            exp: Math.round(Date.now() / 1000) + 3600, // Expires in 1 hour
            enable_chat: true,
          },
        }),
      });
      const room = await response.json();
      if (room.url) {
        roomUrl = room.url;
      }
    }

    return NextResponse.json({ success: true, roomUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
