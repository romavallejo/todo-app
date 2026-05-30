import { CategoryType } from "./CategoryType";

export type TodoType = {
    uuid: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    completedAt: string | null;
    dueDate: string;
    listUuid: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    ownerId: string;
    categories: CategoryType[];
};