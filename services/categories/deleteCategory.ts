import api from "../api";

export const deleteCategory = async (id: string) => {
    await api.delete(`/category?id=${id}`);
};