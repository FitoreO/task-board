import { useEffect, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import AddList from "./components/AddList";
import AddIcon from "@mui/icons-material/Add";

import LoginForm from "./components/LoginForm";
import ListModal from "./components/ListModal";

const flexColumn = {
  display: "flex",
  flexDirection: "column",
};

export type Task = { id: number; name?: string; description?: string };

function App() {
  const [lists, setLists] = useState<
    { id: number; tasks: Task[]; name?: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!sessionStorage.getItem("user"); // keep user logged in during entire session
  });

  useEffect(() => {
    if (isLoggedIn) {
      const user = JSON.parse(sessionStorage.getItem("user")!);
      fetch(`http://localhost:3000/lists/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setLists(data);
        })
        .catch((err) => console.error("Failed to load lists:", err));
    }
  }, [isLoggedIn]);

  const addListHandler = async (name: string) => {
    const user = JSON.parse(sessionStorage.getItem("user")!);
    if (!user) return;

    try {
      const res = await fetch("http://localhost:3000/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, userId: user.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const newList = await res.json();
      setLists((prev) => [...prev, { ...newList, tasks: [] }]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  };

  const deleteListHandler = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/lists/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete list");

      setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const addTaskHandler = async (
    listId: number,
    name: string,
    description?: string,
  ) => {
    try {
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, listId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const newTask = await res.json();

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list,
        ),
      );
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTaskHandler = async (
    listId: number,
    taskId: number,
    newName: string,
    newDescription: string,
  ) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updatedTask = await res.json();

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? updatedTask : task,
                ),
              }
            : list,
        ),
      );
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const deleteTaskHandler = async (listId: number, taskId: number) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) }
            : list,
        ),
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const moveTaskHandler = async (
    taskId: number,
    sourceListId: number,
    targetListId: number,
    targetIndex?: number,
  ) => {
    const res = await fetch(`http://localhost:3000/tasks/${taskId}/move`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetListId, targetIndex }),
    });

    if (!res.ok) throw new Error("Failed to move task");
    const updatedTask = await res.json();

    setLists((prev) =>
      prev.map((list) => {
        if (list.id === sourceListId) {
          return { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) };
        }
        if (list.id === targetListId) {
          const insertAt = targetIndex ?? list.tasks.length;
          const newTasks = [...list.tasks];
          newTasks.splice(insertAt, 0, updatedTask);
          return { ...list, tasks: newTasks };
        }
        return list;
      }),
    );
  };

  return isLoggedIn ? (
    <Box
      sx={{
        "& > :not(style)": { marginLeft: "auto", marginRight: "auto" },
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: 1250,
          height: 600,
          marginTop: "30px",
          ...flexColumn,
          padding: 3,
        }}
      >
        {lists.length > 0 ? (
          <IconButton
            sx={{ marginLeft: "auto" }}
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon sx={{ width: "30px", height: "30px" }} />
          </IconButton>
        ) : (
          <Box
            sx={{
              margin: "auto",
              ...flexColumn,
              alignItems: "center",
            }}
          >
            <Typography sx={{ mb: 1, fontSize: "26px" }}>
              Add a new list
            </Typography>
            <IconButton onClick={() => setIsModalOpen(true)}>
              <AddIcon sx={{ width: "50px", height: "50px" }} />
            </IconButton>
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {lists.map((list) => (
            <AddList
              key={list.id}
              list={list}
              moveTask={moveTaskHandler}
              addTask={addTaskHandler}
              deleteTask={deleteTaskHandler}
              deleteList={deleteListHandler}
              updateTask={updateTaskHandler}
            />
          ))}
        </Box>
        <ListModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addListHandler}
        />
      </Paper>
    </Box>
  ) : (
    <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
  );
}
export default App;
