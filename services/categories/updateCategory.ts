import { UpdateCategoryDto } from "@/types/UpdateCategoryDto";
import api from "../api";

export const updateCateogry = async (category: UpdateCategoryDto) => {
    await api.put('/category', category);
};