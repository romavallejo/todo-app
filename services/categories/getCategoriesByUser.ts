import api from "../api";

export const getCategoriesByUser = async () => {
    return (await api.get('/category')).data;
};