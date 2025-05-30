import { MoreVertical } from "feather-icons-react"

const NavBar = () => {
  return (
    <nav className="w-full bg-gray-800 text-gray-100 flex justify-between items-center h-14 px-8">
      <div className=""></div>
      <div className="flex gap-2 items-center justify-center">
        <div className="cursor-pointer hover:bg-gray-700 rounded-full p-1">
          <MoreVertical className="w-5 h-5 text-gray-200" />
        </div>
        <div className="h-6 w-6 cursor-pointer bg-orange-500 text-white rounded-full flex items-center justify-center">
          <span className="text-md">M</span>
        </div>

        {/* <img src="" alt="h" className='rounded-full object-cover h-6 w-6 bg-orange-500 tex-white' /> */}
      </div>
    </nav>
  );
}

export default NavBar
