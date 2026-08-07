import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { fetchUrl } = await request.json();

  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: process.env.MODELSLAB_API_KEY }),
  });

  return NextResponse.json(await response.json());
}