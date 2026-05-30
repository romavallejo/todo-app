import { CategoryTodoDto } from "@/types/CategoryTodoDto";
import api from "../api";

export const associateCategoryTodo = async (associate: CategoryTodoDto) => {
    await api.post('/category/associate', associate);
};