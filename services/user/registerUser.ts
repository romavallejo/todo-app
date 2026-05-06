import { RegisterUser } from "@/types/RegisterUser";
import api from "../api";

export const registerUser = async (user: RegisterUser) => {
    await api.post("/user", user);
};