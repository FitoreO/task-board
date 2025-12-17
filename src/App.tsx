import { useEffect, useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import AuthView from "./components/AuthView";

function App() {
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Kör bara auth check
  useEffect(() => {
    fetch("http://localhost:3000/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(() => setIsLoggedIn(true))
      .catch((err) => {
        if (!err.message.includes("Not logged in")) {
          console.error("Auth check failed:", err);
        }
        setIsLoggedIn(false);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? (
    <KanbanBoard setIsLoggedIn={setIsLoggedIn} />
  ) : (
    <AuthView
      showSignup={showSignup}
      setShowSignup={setShowSignup}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default App;
