import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// Get all lists for a user, including their tasks

router.get("/", async (req, res) => {
  try {
    const lists = await prisma.list.findMany({
      include: {
        tasks: {
          include: {
            creator: { select: { id: true, name: true, email: true } },
          },
        },
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(lists);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const list = await prisma.list.create({
      data: {
        name,
        createdBy: req.userId!,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        tasks: true,
      },
    });
    res.json(list);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.list.delete({ where: { id } });
    res.json({ message: "List and tasks deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
