import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./auth";

export const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    return token;
};