import { useEffect, useState } from "react";
import AuthView from "./components/AuthView";
import { isLoggedInAtom } from "./components/atoms";
import { useAtom } from "jotai";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

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

  return !isLoggedIn && <AuthView />;
}

export default App;
