import { EditListDto } from "@/types/EditListDto";
import api from "../api";

export const editList = async (list: EditListDto) => {
    await api.put(`/list`,list);
};