import { CreateCategoryDto } from "@/types/CreateCategoryDto";
import api from "../api";

export const createCategory = async (category: CreateCategoryDto) => {
    await api.post('/category', category);
};