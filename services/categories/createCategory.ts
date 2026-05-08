import { CreateCategoryDto } from "@/types/CreateCategoryDto";
import api from "../api";

export const createCategory = async (category: CreateCategoryDto) => {
    return (await api.post('/category', category)).data;
};