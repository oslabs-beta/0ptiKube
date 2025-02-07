import { NextResponse } from "next/server";
import { queryPrometheus } from "../../utils/prometheus";
import { handleError } from "../../utils/errorHandler";

export async function GET() {
  try {
    const data = await queryPrometheus("container_memory_usage_bytes");
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, "Failed to query memory usage");
  }
}
