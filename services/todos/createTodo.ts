import { CreateTodoDto } from "@/types/CreateTodoDto";
import api from "../api";

export const createTodo = async (todo: CreateTodoDto) => {
    await api.post('/todo', todo);
};