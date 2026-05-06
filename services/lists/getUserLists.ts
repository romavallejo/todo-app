import api from "../api";

export const getUserLists = async () => {
    await api.get('/list');
};