export type UpdateTodoDto = {
    uuid: string,
    title: string,
    description: string,
    completed: boolean,
    completedAt: Date,
    dueDate: Date,
    listUuid: string,
    priority: string,
    ownerId: string,
};