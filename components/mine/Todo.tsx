import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from '@/contexts/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { updateTodo } from '@/services/todos/updateTodo';
import { TodoType } from '@/types/TodoType';
import { UpdateTodoDto } from "@/types/UpdateTodoDto";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Category from "./Category";
import PriorityTag from './PriorityTag';

type TodoProps = {
    todo: TodoType;
    onCompletedChange?: (uuid: string, completed: boolean) => void;
};

const formatDueDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const Todo = ({ todo, onCompletedChange }: TodoProps) => {
    const { setGlobalTodo } = useContext(DataContext);

    const colorScheme = useColorScheme();
    const C = Colors[colorScheme ?? 'light'];

    const router = useRouter();

    const [completed, setCompleted] = useState(todo.completed);
    const [updating, setUpdating] = useState(false);

    const toggleCompleted = async () => {
        if (updating) return;
        const next = !completed;
        setCompleted(next);
        onCompletedChange?.(todo.uuid, next);

        const dto: UpdateTodoDto = {
            uuid: todo.uuid,
            title: todo.title,
            description: todo.description,
            completed: next,
            completedAt: next ? new Date() : (null as unknown as Date),
            dueDate: new Date(todo.dueDate),
            listUuid: todo.listUuid,
            priority: todo.priority,
            ownerId: todo.ownerId,
        };

        try {
            setUpdating(true);
            await updateTodo(dto);
        } catch {
            setCompleted(!next);
            onCompletedChange?.(todo.uuid, !next);
        } finally {
            setUpdating(false);
        }
    };

    const goToEdit = () => {
        setGlobalTodo(todo);
        router.replace(`/(tabs)/todo/${todo.uuid}/edit`);
    };

    const goToView = () => {
        setGlobalTodo(todo);
        router.replace(`/(tabs)/todo/${todo.uuid}/view`);
    };

    return (
        <Pressable onPress={goToView} hitSlop={4}>
            <View
                style={{
                    backgroundColor: completed ? C.greenSubtle : C.surface,
                    borderRadius: Radius.md,
                    borderLeftWidth: 4,
                    borderLeftColor: completed ? C.green : C.tint,
                    paddingVertical: 12,
                    paddingRight: 14,
                    paddingLeft: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    ...Shadow.card,
                }}
            >
                <Pressable
                    onPress={toggleCompleted}
                    hitSlop={8}
                    disabled={updating}
                    style={{ opacity: updating ? 0.5 : 1 }}
                >
                    <View
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: Radius.full,
                            borderWidth: 2,
                            borderColor: completed ? C.green : C.border,
                            backgroundColor: completed ? C.green : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {completed && (
                            <IconSymbol name="checkmark" size={12} color="#fff" />
                        )}
                    </View>
                </Pressable>

                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                fontSize: 15,
                                fontWeight: "600",
                                color: C.text,
                                textDecorationLine: completed ? "line-through" : "none",
                                opacity: completed ? 0.55 : 1,
                            }}
                        >
                            {todo.title}
                        </Text>
                        <PriorityTag priority={todo.priority} />
                    </View>

                    {todo.description ? (
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 13,
                                color: C.textSecondary,
                                opacity: completed ? 0.6 : 1,
                            }}
                        >
                            {todo.description}
                        </Text>
                    ) : null}

                    {(todo.categories?.length > 0 || todo.dueDate) && (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 4,
                                marginTop: 2,
                            }}
                        >
                            {todo.categories?.map((c) => (
                                <Category key={c.id} name={c.name} color={c.color} />
                            ))}
                            {todo.dueDate && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 3,
                                        backgroundColor: C.surfaceAlt,
                                        paddingHorizontal: 7,
                                        paddingVertical: 2,
                                        borderRadius: Radius.full,
                                    }}
                                >
                                    <IconSymbol
                                        name="calendar"
                                        size={11}
                                        color={C.textSecondary}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: C.textSecondary,
                                            fontWeight: "500",
                                        }}
                                    >
                                        {formatDueDate(todo.dueDate)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <Pressable
                    onPress={goToEdit}
                    hitSlop={8}
                    style={({ pressed }) => ({
                        width: 30,
                        height: 30,
                        borderRadius: Radius.full,
                        backgroundColor: pressed ? C.surfaceAlt : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                    })}
                >
                    <IconSymbol name="ellipsis" size={18} color={C.textSecondary} />
                </Pressable>
            </View>
        </Pressable>
    );
};

export default Todo;