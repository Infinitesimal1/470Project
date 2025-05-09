import { useEffect } from "react";

const useRoleRedirect = (allowedRoles = []) => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/"; // 🔐 Not logged in
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      window.location.href = "/";
      return;
    }

    if (!allowedRoles.includes(parsedUser.role)) {
      alert("⛔ Access Denied");
      window.location.href = "/";
    }
  }, [allowedRoles]);
};

export default useRoleRedirect;
