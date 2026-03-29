import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const category = formData.get('category') as string || 'cms';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({ url: base64 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
