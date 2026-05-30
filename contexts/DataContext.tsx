import { createContext, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    
	const [globalTodo, setGlobalTodo] = useState(null);
    const [globalList, setGlobalList] = useState(null)

	return (
	<DataContext.Provider value={{globalTodo, globalList, setGlobalTodo, setGlobalList}}>
		{children}
	</DataContext.Provider>
	);
};