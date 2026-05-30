import api from "../api";

export const deleteTodo = async (id: string) => {
    await api.delete(`/todo?id=${id}`);
};