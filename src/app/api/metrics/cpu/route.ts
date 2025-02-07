import { NextResponse } from "next/server";
import { queryPrometheus } from "../../utils/prometheus";
import { handleError } from "../../utils/errorHandler";

export async function GET() {
  try {
    const data = await queryPrometheus(
      "rate(container_cpu_usage_seconds_total[1m])",
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, "Failed to query CPU usage");
  }
}
