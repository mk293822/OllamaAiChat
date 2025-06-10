import { useContext } from 'react'
import { AuthenticatedUserContext } from '../Context/Contexts';

const useAuthUserContext = () => {
    const context = useContext(AuthenticatedUserContext);
    if (!context)
        throw new Error("useAuthUserContext must be used within Provider");
    return context;
}

export default useAuthUserContext
