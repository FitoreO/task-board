import { useEffect, useState } from "react";
import AuthView from "./components/AuthView";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) return <div>Loading...</div>;

  return !isLoggedIn && <AuthView setIsLoggedIn={setIsLoggedIn} />;
}

export default App;
