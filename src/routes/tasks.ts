import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Add a task to a list
router.post("/", async (req, res) => {
  const { name, description, listId } = req.body;
  try {
    const task = await prisma.task.create({
      data: { name, description, listId },
    });
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
