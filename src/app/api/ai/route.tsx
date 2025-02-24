// app/api/ai/route.ts
// Import necessary modules
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI instance with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Define an async function to handle POST requests
export async function POST(request: Request) {
  try {
    // Parse the JSON body from the incoming request
    const { query } = await request.json();

    // Validate input: Ensure 'query' exists and is a string
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query format' },
        { status: 400 }
      );
    }
    // RESPONSE CLEANUP & FORMATTING
    // Send a request to OpenAI's Chat Completions API
    const completion = await openai.chat.completions.create({
      model: process.env.FINE_TUNED_MODEL || 'gpt-3.5-turbo-0125', // Use fine-tuned model if available, otherwise fallback
      messages: [
        {
          // System message to guide the AI on how to format responses
          role: 'system',
          content: `You are a Kubernetes optimization expert. Format responses with:
          - Numbered lists in Markdown
          - Code blocks for YAML examples
          - **Bold** for important terms
          - Clear section headings using ##`,
        },
        { role: 'user', content: query }, // User's query
      ],
      temperature: 0.5, // Controls randomness of responses (0 = deterministic, 1 = highly random)
      max_tokens: 1000, // Limits the length of the AI's response
      response_format: { type: 'text' }, //Ensure response is in text
    });

    // Clean up response
    const response = completion.choices[0].message.content
      ?.replace(/\\n/g, '\n') // Fix newlines
      .replace(/^ +/gm, '') // Remove leading spaces
      .replace(/(```yaml)/g, '\n$1'); // Add spacing before code blocks

    // Return an error response if an exception occurs
    return NextResponse.json({ response });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    console.error('AI API Error:', error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.name : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
