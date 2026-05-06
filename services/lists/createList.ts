import { CreateListDto } from "@/types/CreateListDto";
import api from "../api";

export const createList = async (list: CreateListDto) => {
    await api.post('/list', list);
};