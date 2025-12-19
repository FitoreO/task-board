import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

function setUserId(target: Request | Socket, id: number) {
  (target as any).userId =
    typeof id === "number" ? id : parseInt(id as any, 10);
}

function getToken(source: Request | Socket): string | null {
  if ("cookies" in source) {
    return source.cookies?.token || null;
  }
  const cookies = (source as Socket).handshake.headers.cookie;
  return (
    cookies
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1] || null
  );
}

function handleError(source: Request | Socket, res?: Response, next?: any) {
  if ("cookies" in source) {
    return res?.status(401).json({ error: "Invalid token" });
  }
  return next?.(new Error("Invalid token"));
}

function authenticate(
  source: Request | Socket,
  res?: Response,
  next?: any,
): boolean {
  const token = getToken(source);
  if (!token) {
    handleError(source, res, next);
    return false;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload & { id: number };
    setUserId(source, decoded.id);
    return true;
  } catch (err) {
    console.error("JWT verification error:", err);
    handleError(source, res, next);
    return false;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (authenticate(req, res)) next();
}

export function socketAuthMiddleware(socket: Socket, next: any) {
  if (authenticate(socket, next)) next();
}
