import api from "../api";

export const getCategoriesByListId = async (id: string) => {
    return (await api.get(`/category/list?id=${id}`)).data;
};