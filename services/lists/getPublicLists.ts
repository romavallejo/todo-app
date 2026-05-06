import api from "../api";

export const getPublicLists = async () => {
    await api.get('/list/public');
};