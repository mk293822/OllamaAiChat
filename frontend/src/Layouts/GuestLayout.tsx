import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
