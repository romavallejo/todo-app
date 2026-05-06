import api from "../api";

export const getUserTodos = async (full: boolean = false) => {
    await api.get(`/todo?full=${full.toString()}`);
};