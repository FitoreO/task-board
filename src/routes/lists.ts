import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

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

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    //an empty list can be deleted but when a task is added it will not allow you to delete list until task is deleted first
    await prisma.task.deleteMany({ where: { listId: id } });
    await prisma.list.delete({ where: { id } });
    res.json({ message: "List and tasks deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
