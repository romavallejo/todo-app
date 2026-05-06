export type UpdateTodoDto = {
    uuid: string,
    title: string,
    description: string,
    completed: boolean,
    completedAt: Date | null,
    dueDate: Date | null,
    listUuid: string,
    priority: string,
    ownerId: string,
};