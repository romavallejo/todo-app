import api from "../api";

export const copyList = async (id: string) => {
    await api.post(`/list/copy?id=${id}`);
};