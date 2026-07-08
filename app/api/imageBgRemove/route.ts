import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { imageSrc } = await request.json();

  const response = await fetch('https://modelslab.com/api/v6/image_editing/removebg_mask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageSrc,
      only_mask: false,
      inverse_mask: false,
      seed: null,
      alpha_matting: false,
      post_process_mask: false,
      track_id: null,
      model_id: "background-remover-1",
      base64: "no",
      webhook: null,
      key: process.env.MODELSLAB_API_KEY,  
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    return NextResponse.json({ error: error.error?.message || 'API failed' }, { status: response.status });
  }

  const result = await response.json();
  return NextResponse.json(result);
}