import { UserType } from "@/types/UserType";
import api from "../api";

export const getUser = async (): Promise<UserType> => {
    return (await api.get(`/user`)).data;
};