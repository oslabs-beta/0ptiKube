import { NextResponse } from "next/server";

type ErrorResponse = {
  error: string;
  message?: string;
};

export function handleError(
  error: unknown,
  context: string,
): NextResponse<ErrorResponse> {
  // Check if the error is an instance of Error
  if (error instanceof Error) {
    return NextResponse.json(
      { error: context, message: error.message },
      { status: 500 },
    );
  }

  // Handle non-Error types (e.g., strings, objects)
  return NextResponse.json(
    { error: context, message: "An unknown error occurred" },
    { status: 500 },
  );
}
