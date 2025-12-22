import { Routes, Route } from "react-router";
import SignupForm from "../components/SignupForm";
import KanbanBoard from "../components/KanbanBoard";
import AuthView from "../components/AuthView";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthView setIsLoggedIn={() => {}} />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route
        path="/kanban"
        element={<KanbanBoard setIsLoggedIn={() => {}} />}
      />
    </Routes>
  );
}
