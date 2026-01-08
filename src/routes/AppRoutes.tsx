import { Routes, Route } from "react-router";
import SignupForm from "../components/SignupForm";
import KanbanBoard from "../components/KanbanBoard";
import AuthView from "../components/AuthView";
import PieChartWithCustomizedLabel from "../components/TasksStatisticsChart";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthView />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/kanban" element={<KanbanBoard />} />
      <Route path="/chart" element={<PieChartWithCustomizedLabel />} />
    </Routes>
  );
}
