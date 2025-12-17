import { useKanban } from "./hooks/useKanban";
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import AddList from "./AddList";
import AddIcon from "@mui/icons-material/Add";
import ListModal from "./ListModal";
import { handleLogout } from "./hooks/handleLogout";
import LogoutIcon from "@mui/icons-material/Logout";

export const flexColumn = {
  display: "flex",
  flexDirection: "column",
};

const flexRow = {
  display: "flex",
  flexDirection: "row",
};

interface KanbanBoardProps {
  setIsLoggedIn: (val: boolean) => void;
}

function KanbanBoard({ setIsLoggedIn }: KanbanBoardProps) {
  const {
    lists,
    isModalOpen,
    setIsModalOpen,
    taskTypes,
    priorities,
    selectedType,
    setSelectedType,
    selectedPriority,
    setSelectedPriority,
    allUsers,
    selectedUser,
    setSelectedUser,
    addListHandler,
    deleteListHandler,
    addTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
    moveTaskHandler,
  } = useKanban();

  const hasTasks = lists.some((list) => list.tasks.length > 0);

  const getAvatarColor = (userId: number) => {
    const hue = (userId * 137) % 360;
    return `hsl(${hue}, 60%, 70%)`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Tooltip title="Log out">
          <IconButton
            onClick={() => handleLogout({ setIsLoggedIn })}
            sx={{ color: "#1976d2" }}
          >
            <Typography sx={{ marginRight: "5px", fontSize: "20px" }}>
              Log Out
            </Typography>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            paddingLeft: 2,
          }}
        >
          {allUsers.map((user, index) => {
            const initials = user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?";

            return (
              <Tooltip key={user.id} title={user.name}>
                <Avatar
                  sx={{
                    bgcolor: getAvatarColor(user.id),
                    cursor: "pointer",
                    border: "2px solid white",
                    marginLeft: index === 0 ? 0 : -1.5,
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {initials}
                </Avatar>
              </Tooltip>
            );
          })}
        </Box>
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
    </Box>
  );
}

export default KanbanBoard;
