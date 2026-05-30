import api from "../api";

export const getPublicLists = async () => {
    return (await api.get('/list/public')).data;
};