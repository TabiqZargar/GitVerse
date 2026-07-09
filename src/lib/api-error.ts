/**
 * Standardized API error response helper.
 * Every API route uses this to return consistent error shapes.
 */

import { NextResponse } from "next/server";
import { GitHubError } from "@/features/github/errors";

interface ErrorBody {
  code: string;
  message: string;
  status: number;
}

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof GitHubError) {
    const body: ErrorBody = {
      code: error.code,
      message: error.message,
      status: error.status,
    };
    return NextResponse.json(body, { status: error.status });
  }

  if (error instanceof Error) {
    const body: ErrorBody = {
      code: "INTERNAL_ERROR",
      message: error.message,
      status: 500,
    };
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json(
    { code: "INTERNAL_ERROR", message: "An unexpected error occurred", status: 500 },
    { status: 500 }
  );
}

export function apiSuccessResponse<T>(data: T) {
  return NextResponse.json({ data });
}
