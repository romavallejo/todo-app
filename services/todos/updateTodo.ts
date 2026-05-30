import { UpdateTodoDto } from "@/types/UpdateTodoDto";
import api from "../api";

export const updateTodo = async (todo: UpdateTodoDto) => {
    await api.put('/todo', todo);
};