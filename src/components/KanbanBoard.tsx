// KanbanBoard.tsx - ENKEL VERSION

import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  MenuItem,
  Select,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useKanbanLists } from "./hooks/useKanbanLists";
import { useKanbanTasks } from "./hooks/useKanbanTasks";
import { useKanbanSocket } from "./hooks/useKanbanSocket";
import { flexColumn, flexEnd, flexRow } from "../styles/flex";
import AddList from "./AddList";
import ListModal from "./ListModal";
import LoadingSpinner from "./LoadingSpinner";
import ShowSnackbar from "./ShowSnackbar";
import { useKanbanMetadata } from "./hooks/useKanbanMeta";
import { useState } from "react";

function KanbanBoard() {
  const { lists, setLists, isLoading, addListHandler, deleteListHandler } =
    useKanbanLists(true);

  const {
    addTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
    moveTaskHandler,
  } = useKanbanTasks();

  const {
    taskTypes,
    priorities,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    allUsers,
    selectedUser,
    setSelectedUser,
  } = useKanbanMetadata(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  // Socket
  useKanbanSocket(true, setLists, (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  });

  const hasTasks = lists.some((list) => list.tasks.length > 0);

  if (isLoading) {
    return <LoadingSpinner message="Loading your tasks..." />;
  }

  return (
    <Box
      sx={{
        ...flexColumn,
        width: "100%",
        margin: "0 auto",
        alignItems: "center",
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
          <Box sx={{ ...flexRow, mx: "auto", gap: 2 }}>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ width: "300px" }}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select a type</em>
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

        <Box sx={{ ...flexEnd, width: "100%", paddingLeft: 2, paddingTop: 2 }}>
          {allUsers.map((user, index) => {
            const initials = user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?";
            const isSelected = selectedUser === user.id;
            return (
              <Tooltip key={user.id} title={user.name}>
                <Avatar
                  sx={{
                    bgcolor: `hsl(${(user.id * 137) % 360}, 60%, 70%)`,
                    cursor: "pointer",
                    border: isSelected
                      ? "3px solid #1976d2"
                      : "2px solid white",
                    marginLeft: index === 0 ? 0 : -1.5,
                    width: "30px",
                    height: "30px",
                    fontSize: "14px",
                  }}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {initials.toUpperCase()}
                </Avatar>
              </Tooltip>
            );
          })}
          <Tooltip title="All users">
            <Avatar
              sx={{
                bgcolor: selectedUser === "" ? "#1976d2" : "#e0e0e0",
                cursor: "pointer",
                border:
                  selectedUser === "" ? "3px solid #1976d2" : "2px solid white",
                marginLeft: selectedUser === 0 ? 0 : -1.5,
                width: "30px",
                height: "30px",
                fontSize: "12px",
              }}
              onClick={() => setSelectedUser("")}
            >
              ALL
            </Avatar>
          </Tooltip>
        </Box>
        {lists.length > 0 ? (
          <IconButton
            sx={{ marginLeft: "auto" }}
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon sx={{ width: "30px", height: "30px" }} />
          </IconButton>
        ) : (
          <Box sx={{ margin: "auto", ...flexColumn, alignItems: "center" }}>
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
              .filter(
                (task) => !selectedUser || task.createdBy === selectedUser,
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
      <ShowSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}

export default KanbanBoard;
