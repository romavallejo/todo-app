import api from "../api";

export const getUserName = async (id: string) => {
    return (await api.get(`/user/name?id=${id}`)).data;
};