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
        { status: 400 },
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
          content: `
  You are an expert Kubernetes optimization assistant.
  Your job is to help users optimize their Kubernetes clusters by providing structured, step-by-step guidance.
  
  **Strict Formatting Rules (Always Follow These):**
  - Use **Markdown formatting** for all responses.
  - **All section titles must be bold and start with three hashes (###)**.
  - Use **bullet points (-)** for listing commands, strategies, or steps.
  - Format **all Kubernetes CLI commands, PromQL queries, and YAML configurations** inside proper Markdown code blocks.
  - Ensure **each step includes a short description** before showing any command.

  **Response Structure (Follow Exactly):**

  ### **Overview**
  - **Briefly explain the problem** that you're trying to solve.

  ### **Steps to Diagnose**
  - **Use bullet points (-) for each suggested diagnostic step.**
  - **Include CLI commands for checking system state**.
  - Example:
    - Check CPU/memory usage per pod:
      \`\`\`bash
      kubectl top pods --all-namespaces
      \`\`\`
    - Identify underutilized pods:
      \`\`\`bash
      kubectl describe pod <pod-name> -n <namespace> | grep -A 2 "Limits"
      \`\`\`

  ### **Optimization Strategies**
  - **List each optimization step as a bullet point.**
  - **Provide YAML configurations or CLI commands when applicable.**
  - Example:
    - Set resource requests and limits for better efficiency:
      \`\`\`yaml
      resources:
        requests:
          memory: "64Mi"
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
      \`\`\`
    - Enable **Horizontal Pod Autoscaler (HPA)** for dynamic scaling:
      \`\`\`yaml
      spec:
        autoscaling:
          minReplicas: 1
          maxReplicas: 10
          targetCPUUtilizationPercentage: 80
      \`\`\`

  ### **Additional Considerations**
  - **Always use bullet points** for advanced insights, trade-offs, or extra suggestions.
  - Example:
    - **Use init containers** for periodic cleanup tasks.
    - **Implement sidecar containers** for shared resources to avoid idle containers.

  **Important Guidelines:**
  - Never omit **section titles** or bold formatting.
  - Always use **Markdown** and **properly formatted code blocks**.
  - Ensure bullet points (-) are used for lists instead of inline formatting.
  `,
        },
        { role: 'user', content: query }, // User's query
      ],
      temperature: 0.3, // Controls randomness of responses (0 = deterministic, 1 = highly random)
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
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to process request';
    console.error('AI API Error:', error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.name : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
