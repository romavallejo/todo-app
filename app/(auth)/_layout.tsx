import { AuthContext } from "@/contexts/AuthContext";
import { Redirect, Slot } from "expo-router";
import { useContext } from "react";

const AuthLayout = () => {
    const {isAuthenticated} = useContext(AuthContext);

    if (isAuthenticated) {
        return <Redirect href="/(tabs)"/>
    }
    
    return (
        <Slot />
    );
};

export default AuthLayout;