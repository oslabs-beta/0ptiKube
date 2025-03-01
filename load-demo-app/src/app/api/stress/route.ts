import { NextResponse } from 'next/server';
import { LoadGenerator } from '../../../lib/loadGenerator';

let loadGenerator: LoadGenerator | null = null;

export async function POST(request: Request) {
  try {
    const { phase } = await request.json();

    switch (phase) {
      case 'high':
        // High load configuration (75% target)
        loadGenerator?.stop();
        loadGenerator = new LoadGenerator({
          durationMinutes: 3,
          memoryIntensive: true,
          cpuIntensive: true,
        });
        await loadGenerator.start();
        break;

      case 'low':
        // Low load configuration (20% target)
        loadGenerator?.stop();
        loadGenerator = new LoadGenerator({
          durationMinutes: 1,
          memoryIntensive: false,
          cpuIntensive: true,
        });
        await loadGenerator.start();
        break;

      case 'stop':
        loadGenerator?.stop();
        loadGenerator = null;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid phase',
          },
          { status: 400 },
        );
    }

    console.log(`Load generator phase changed to: ${phase}`);
    return NextResponse.json({ success: true, phase });
  } catch (error) {
    console.error('Error in stress API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
      },
      { status: 500 },
    );
  }
}

