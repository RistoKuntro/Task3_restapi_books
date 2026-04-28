import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: object,
  ) {
    super(message);
    this.name = "AppError";
  }
}

interface PrismaClientKnownError extends Error {
  code: string;
  meta?: { target?: string[] };
}

function isPrismaError(err: unknown): err is PrismaClientKnownError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as PrismaClientKnownError).code === "string" &&
    (err as PrismaClientKnownError).code.startsWith("P")
  );
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue: z.core.$ZodIssue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  if (isPrismaError(err)) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          error: "A record with this value already exists",
          details: err.meta?.target
            ? [{ field: err.meta.target.join(", "), message: "Must be unique" }]
            : undefined,
        });
        return;
      case "P2025":
        res.status(404).json({ error: "Record not found" });
        return;
      case "P2003":
        res.status(400).json({ error: "Referenced record does not exist" });
        return;
    }
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}
