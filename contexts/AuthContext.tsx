import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkLogin = () => {

    };
	
	const login = (userData, tokenValue) => {
		setUser(userData);
		setToken(tokenValue);
		setIsAuthenticated(true);
        AsyncStorage.setItem("token", token);
	};
	
	const logout = () => {
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);
        AsyncStorage.removeItem("token");
	};
	
	return (
	<AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
		{children}
	</AuthContext.Provider>
	);
};