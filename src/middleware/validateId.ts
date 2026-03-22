import { Request, Response, NextFunction } from "express";

export function validateId(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const raw = req.params[paramName] as string;
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed <= 0 || String(parsed) !== raw) {
      res.status(400).json({
        error: `Invalid parameter: "${paramName}" must be a positive integer`,
      });
      return;
    }
    next();
  };
}
