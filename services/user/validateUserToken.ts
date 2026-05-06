import api from "../api";

export const validateUserToken = async () => {
    await api.get("/user/validate");
};