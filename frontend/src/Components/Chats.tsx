import { MoreVertical } from "feather-icons-react";

const Chats = () => {
  return (
    <section>
      <div className="flex flex-col gap-2 py-4 text-xs">
        {/* day */}
        <span className="text-xs text-gray-400 ps-2">Today</span>
        {/* Chats */}
        <div className="flex flex-col gap-4 text-gray-100 w-full">
          {/* Chat Items */}
          <div className="relative group cursor-pointer hover:bg-gray-700 p-2 rounded-xl">
            <span className="block max-w-[100%] overflow-hidden text-ellipsis z-10 whitespace-nowrap group-hover:mr-5">
              Hello what is your name icons and first withy u
            </span>

            <button className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:block text-gray-200">
              <MoreVertical className="w-6 h-6 cursor-pointer hover:bg-gray-600 rounded-full p-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chats;
