import api from "../api";

export const getUserLists = async () => {
    return (await api.get('/list')).data;
};