import api from "../api";

export const getCommentsByListId = async (id: string) => {
    await api.get(`/comment?id=${id}`);
};