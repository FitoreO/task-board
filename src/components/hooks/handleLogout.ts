type Logout = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleLogout = async ({ setIsLoggedIn }: Logout) => {
  try {
    const res = await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include", // 👈 ensures cookies are sent
    });

    if (res.ok) {
      setIsLoggedIn(false); // update UI state
    } else {
      console.error("Logout failed");
    }
  } catch (err) {
    console.error("Error logging out:", err);
  }
};
