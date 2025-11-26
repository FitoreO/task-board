import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

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

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { name, description },
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

export default router;
