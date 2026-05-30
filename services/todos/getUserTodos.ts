import api from "../api";

export const getUserTodos = async (full: boolean = false) => {
    return (await api.get(`/todo?full=${full.toString()}`)).data;
};