import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload & { id: number };

    // Add debug logging temporarily
    console.log("Decoded JWT:", decoded);
    console.log("User ID type:", typeof decoded.id);
    console.log("User ID value:", decoded.id);

    // Ensure it's a number
    (req as any).userId =
      typeof decoded.id === "number"
        ? decoded.id
        : parseInt(decoded.id as any, 10);

    console.log("Set req.userId to:", (req as any).userId);

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
