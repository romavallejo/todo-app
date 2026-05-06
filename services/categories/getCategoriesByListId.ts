import api from "../api";

export const getCategoriesByListId = async (id: string) => {
    await api.get(`/category/list?id=${id}`);
};