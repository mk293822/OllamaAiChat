import { Link } from "react-router-dom";
import { Button } from "./Button";
import { authRoutes } from "../routes";

const WelcomeNavBar = () => {

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
      <h1 className="text-2xl font-bold">Gemma3</h1>
      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm md:text-base">
          <Link to={authRoutes.login}>Login</Link>
        </Button>
        <Button className="bg-transparent border-green-700 border text-green-600 hover:text-white hover:bg-green-700 px-4 py-2 text-sm md:text-base">
          <Link to={authRoutes.register}>Register</Link>
        </Button>
      </div>
    </nav>
  );
};

export default WelcomeNavBar;
