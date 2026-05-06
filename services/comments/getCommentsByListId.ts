import api from "../api";

export const getCommentsByListId = async (id: string) => {
    return (await api.get(`/comment?id=${id}`)).data;
};