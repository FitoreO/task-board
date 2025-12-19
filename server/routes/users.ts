import { Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/setCookie";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(403).json({ error: "Invalid email or password" });
    }
    // Success: return user info (omit password)
    setCookie(res, user.id);
    const { password: _, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/logout", async (_req, res) => {
  res
    .clearCookie("token", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    })
    .end();
});

router.get("/all-users", authMiddleware, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lists: true,
        tasks: true,
      },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
