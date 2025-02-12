// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: process.env.FINE_TUNED_MODEL || 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `You are a Kubernetes optimization expert. Format responses with:
          - Numbered lists in Markdown
          - Code blocks for YAML examples
          - **Bold** for important terms
          - Clear section headings using ##`,
        },
        { role: 'user', content: query },
      ],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'text' }, // Force text format
    });

    // Clean up response
    const response = completion.choices[0].message.content
      ?.replace(/\\n/g, '\n') // Fix newlines
      .replace(/^ +/gm, '') // Remove leading spaces
      .replace(/(```yaml)/g, '\n$1'); // Add spacing before code blocks

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('AI API Error:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to process request',
        details: error.type || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

/*import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',

      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant who have experience in Kubernetes resource allacation management. Format your response as a numbered list. After each numbered list make sure to add a line break.',
        },
        {
          role: 'user',
          content:
            'How do I allocate CPU and memory resources to a Kubernetes pod?',
        },
        {
          role: 'assistant',
          content:
            'To allocate CPU and memory resources to a Kubernetes pod, you can specify resource requests and limits in the pod’s YAML configuration. Here’s an example:\nresources:\nrequests:\nmemory:"64Mi"\n    cpu: "250m"\n  limits:\n    memory: "128Mi"\n    cpu: "500m"\n```\n\n- `requests`: The minimum resources required for the pod to run.\n- `limits`: The maximum resources the pod can use.',
        }, // System instruction
        { role: 'user', content: query },
      ], // User query],
      temperature: 0.7,
      max_tokens: 500, // Adjust creativity (0 = deterministic, 1 = creative)
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error querying AI:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the response.' },
      { status: 500 }
    );
  }
}
  */
