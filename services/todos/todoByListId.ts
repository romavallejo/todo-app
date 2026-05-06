import api from "../api";

export const todoByList = async (id: string, full: boolean = false) => {
    return (await api.post(`/todo?id=${id}&full=${full.toString()}`)).data;
};