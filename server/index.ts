import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import listsRouter from "./routes/lists";
import tasksRouter from "./routes/tasks";
import { TaskType, Priority } from "../generated/prisma/enums";

const app = express();
app.use(express.json());
app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}` }));

// Mount routers
app.use("/users", usersRouter);
app.use("/lists", listsRouter);
app.use("/tasks", tasksRouter);

app.get("/task-types", (req, res) => {
  res.json(Object.values(TaskType));
});

app.get("/priorities", (req, res) => {
  res.json(Object.values(Priority));
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
