import { useSetAtom } from "jotai";
import { isLoggedInAtom } from "../atoms";

export const useHandleLogout = () => {
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  return async () => {
    try {
      const res = await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsLoggedIn(false);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
};
