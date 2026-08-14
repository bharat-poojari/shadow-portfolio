import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.myip.com', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('MyIP request failed');
    }

    const data = await response.json();

    return NextResponse.json({
      ip: data.ip,
      country: data.country,
      cc: data.cc,
    });
  } catch (error) {
    console.error('Visitor node detection failed:', error);

    return NextResponse.json(
      {
        error: 'Unable to detect visitor node',
      },
      {
        status: 500,
      },
    );
  }
}