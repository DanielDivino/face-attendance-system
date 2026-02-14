import { Request, Response, NextFunction } from "express";
import { AppError } from "./appErros";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code ?? null,
    });
  }

  // TypeORM / Postgres: duplicado (unique violation)
  const anyErr = err as any;
  if (anyErr?.code === "23505") {
    return res.status(409).json({
      message: "Registro duplicado (violou uma restrição UNIQUE).",
      code: "UNIQUE_VIOLATION",
      detail: anyErr?.detail ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Erro interno do servidor.",
    code: "INTERNAL_SERVER_ERROR",
  });
}
