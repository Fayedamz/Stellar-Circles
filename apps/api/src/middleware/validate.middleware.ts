import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/** Run after express-validator chains to short-circuit on validation errors */
export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  next();
}
