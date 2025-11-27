import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Success: return user info (omit password)
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
