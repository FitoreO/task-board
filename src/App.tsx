import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import AddList from "./components/AddList";
import AddIcon from "@mui/icons-material/Add";
import LoginForm from "./components/LoginForm";
import ListModal from "./components/ListModal";
import { type TaskList } from "./types/task.types";

export const flexColumn = {
  display: "flex",
  flexDirection: "column",
};

const flexRow = {
  display: "flex",
  flexDirection: "row",
};

function App() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!sessionStorage.getItem("user"); // keep user logged in during entire session
  });
  const [taskTypes, setTaskTypes] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

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

  // Load dropdown options for task type and priority filters

  useEffect(() => {
    fetch("http://localhost:3000/task-types")
      .then((res) => res.json())
      .then(setTaskTypes)
      .catch((err) => console.error("Failed to load task types:", err));

    fetch("http://localhost:3000/priorities")
      .then((res) => res.json())
      .then(setPriorities)
      .catch((err) => console.error("Failed to load priorities:", err));
  }, []);

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
    type?: string,
    priority?: string,
  ) => {
    try {
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, listId, type, priority }),
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
    newType?: string,
    newPriority?: string,
  ) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          type: newType,
          priority: newPriority,
        }),
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

  const hasTasks = lists.some((list) => list.tasks.length > 0);

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
          height: 700,
          marginTop: "30px",
          ...flexColumn,
          padding: 3,
        }}
      >
        {hasTasks && (
          <Box
            sx={{
              ...flexRow,
              marginLeft: "auto",
              marginRight: "auto",
              gap: 2,
            }}
          >
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ width: "300px" }}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select a task</em>
              </MenuItem>
              {taskTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              sx={{ width: "300px" }}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select priority</em>
              </MenuItem>
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
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
        <Box sx={{ ...flexRow, gap: 2 }}>
          {lists.map((list) => {
            const filteredTasks = list.tasks
              .filter((task) => !selectedType || task.type === selectedType)
              .filter(
                (task) =>
                  !selectedPriority || task.priority === selectedPriority,
              )
              .sort(
                (a, b) =>
                  priorities.indexOf(a.priority!) -
                  priorities.indexOf(b.priority!),
              );

            return (
              <AddList
                key={list.id}
                list={{ ...list, tasks: filteredTasks }}
                moveTask={moveTaskHandler}
                addTask={addTaskHandler}
                deleteTask={deleteTaskHandler}
                deleteList={deleteListHandler}
                updateTask={updateTaskHandler}
                taskTypes={taskTypes}
                priorities={priorities}
              />
            );
          })}
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
