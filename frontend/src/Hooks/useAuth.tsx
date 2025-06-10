import { useContext } from "react"
import { AuthContext } from "../Context/Contexts";


const useAuth = () => {

  const context = useContext(AuthContext);
  if (!context)
		throw new Error("useAuth must be used within Provider");
	return context;
}

export default useAuth
