import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../helper";

const GuestLayout = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const token = getCookie("auth_token");
  const fetchUser = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main>{children}</main>
    </div>
  );
};

export default GuestLayout;
