import api from "../api";

export const deleteList = async (id: string) => {
    await api.delete(`/list?id=${id}`);
};