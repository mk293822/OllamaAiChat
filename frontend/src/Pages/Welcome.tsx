import { Button } from "../Components/Button";
import WelcomeNavBar from "../Components/WelcomeNavBar";
import { Link } from "react-router-dom";
import { authRoutes } from "../routes";

const Welcome = () => {
  return (
    <>
      <WelcomeNavBar />
      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-130px)] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Welcome to Gemma3 AI Assistant
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Your personal, private AI companion powered by the locally running
          Gemma3 model with Ollama.
        </p>
        <Button className="bg-gray-600 hover:bg-gray-500 px-6 py-2 text-lg">
          <Link to={authRoutes.login}>Get start</Link>
        </Button>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm p-4 text-gray-400">
        &copy; {new Date().getFullYear()} Gemma3 by Ollama. All rights reserved.
      </footer>
    </>
  );
};

export default Welcome;
