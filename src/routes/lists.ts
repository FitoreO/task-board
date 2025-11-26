import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Get all lists for a user
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  try {
    const lists = await prisma.list.findMany({
      where: { userId },
      include: { tasks: true },
    });
    res.json(lists);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new list for a user
router.post("/", async (req, res) => {
  const { name, userId } = req.body;
  try {
    const list = await prisma.list.create({
      data: { name, userId },
    });
    res.json(list);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
