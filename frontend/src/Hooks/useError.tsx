import { useContext } from 'react'
import { ErrorContext } from '../Context/Contexts'

const useError = () => {
    const context = useContext(ErrorContext);
    if (!context)
			throw new Error("useErrorModal must be used within ErrorProvider");
		return context;
}

export default useError
