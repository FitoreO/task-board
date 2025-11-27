import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import listsRouter from "./routes/lists";
import tasksRouter from "./routes/tasks";

const app = express();
app.use(express.json());
app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}` }));

// Mount routers
app.use("/users", usersRouter);
app.use("/lists", listsRouter);
app.use("/tasks", tasksRouter);

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
