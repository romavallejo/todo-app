import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = AsyncStorage.getItem("token");
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;