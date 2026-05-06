import { validateUserToken } from "@/services/user/validateUserToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState } from "react";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(true);

    const checkForAuth = async () => {
		const t = await AsyncStorage.getItem("token");
		if (!t) {return;}
		try {
			await validateUserToken();
			login(null,t);
			return true;
		} catch(error) {
			logout();
			return false;
		}
    };
	
	const login = (userData, tokenValue) => {
		setUser(userData);
		setToken(tokenValue);
		setIsAuthenticated(true);
        AsyncStorage.setItem("token", tokenValue);
	};
	
	const logout = () => {
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);
        AsyncStorage.removeItem("token");
	};
	
	return (
	<AuthContext.Provider value={{ user, token, isAuthenticated, login, logout,checkForAuth }}>
		{children}
	</AuthContext.Provider>
	);
};