import api from "../api";

export const getTodoByListId = async (id: string, full: boolean = false) => {
    return (await api.get(`/todo/list?id=${id}&full=${full.toString()}`)).data;
};