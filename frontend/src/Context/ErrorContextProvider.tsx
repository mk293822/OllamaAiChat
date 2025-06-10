import { useMemo, useState, type PropsWithChildren } from "react";
import { ErrorContext } from "./Contexts";

const ErrorContextProvider = ({ children }: PropsWithChildren) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const value = useMemo(
		() => ({
			errorMessage,
			setErrorMessage,
		}),
		[errorMessage]
	);

	return (
		<ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
	);
};

export default ErrorContextProvider;
