import api from "../api";

export const getCategoriesByUser = async () => {
    await api.get('/category');
};