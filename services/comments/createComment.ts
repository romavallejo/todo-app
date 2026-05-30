import { CreateCommentDto } from "@/types/CreateCommentDto";
import api from "../api";

export const createComment = async (comment: CreateCommentDto) => {
    await api.post('/comment', comment);
};