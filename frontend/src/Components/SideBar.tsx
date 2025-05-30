import { Edit, Search, Sidebar } from "feather-icons-react";
import Chats from "./Chats";
import "../index.css";

const SideBar = () => {
  return (
    <aside className="flex flex-col w-52 py-3 h-screen">
      <header className="flex items-center justify-between text-gray-200 h-6 px-3">
        <h3 className="font-bold text-lg">Gemma3</h3>
        <span className="font-bold text-xl cursor-pointer">
          <Sidebar className="w-5 h-5" />
        </span>
      </header>
      <section className="flex flex-col border-t border-gray-600 w-full ps-2 pt-3 flex-1 my-4 overflow-y-auto scrollable h-[95%]">
        <div className="flex gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700">
          <Edit className="w-3 h-3 mt-0.5" />
          <p>New Chat</p>
        </div>
        <div className="flex gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-700">
          <Search className="w-3 h-3 mt-0.5" />
          <p>Search Chats</p>
        </div>
        {/* Chat Items */}
        <Chats />
      </section>
    </aside>
  );
};

export default SideBar;
