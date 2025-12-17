type Logout = {
  setIsLoggedIn: (val: boolean) => void;
};

export const handleLogout = async ({ setIsLoggedIn }: Logout) => {
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
