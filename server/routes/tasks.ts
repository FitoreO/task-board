import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.post("/", async (req, res) => {
  const { name, description, listId, type, priority } = req.body;
  try {
    const task = await prisma.task.create({
      data: { name, description, listId, type, priority },
    });
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, type, priority } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { name, description, type, priority },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Move a task to another list by updating it's listId
router.put("/:id/move", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { targetListId } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { listId: targetListId },
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch tasks, optionally filtered by type and/or priority

router.get("/", async (req, res) => {
  const { type, priority } = req.query;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        ...(type ? { type: type as any } : {}),
        ...(priority ? { priority: priority as any } : {}),
      },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
