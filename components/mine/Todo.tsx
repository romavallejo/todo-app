import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from "@/constants/theme";
import { DataContext } from '@/contexts/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { updateTodo } from '@/services/todos/updateTodo';
import { UpdateTodoDto } from "@/types/UpdateTodoDto";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Category from "./Category";

type CategoryType = {
    id: string;
    name: string;
    color: string;
};

type TodoType = {
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

type TodoProps = {
    todo: TodoType;
};

const formatDueDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const Todo = ({ todo }: TodoProps) => {
    const { setGlobalTodo } = useContext(DataContext);

    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const router = useRouter();

    const [completed, setCompleted] = useState(todo.completed);
    const [updating, setUpdating] = useState(false);

    const toggleCompleted = async () => {
        if (updating) return;
        const next = !completed;
        setCompleted(next); // optimistic

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
        } catch (err) {
            setCompleted(!next); // rollback
            console.error("Failed to update todo", err);
        } finally {
            setUpdating(false);
        }
    };

    const goToEdit = () => {
        setGlobalTodo(todo)
        router.replace(`/(tabs)/todo/${todo.uuid}/edit`);
    };

    const goToView = () => {
        setGlobalTodo(todo)
        router.replace(`/(tabs)/todo/${todo.uuid}/view`);
    };

    return (
        <Pressable onPress={goToView} hitSlop={8}>
            <View
                className="flex-row items-center gap-3 w-full p-3 rounded-lg border-2"
                style={{ backgroundColor: bg , borderColor: tintAlt}}
            >
                {/* Checkbox */}
                <Pressable
                    onPress={toggleCompleted}
                    hitSlop={8}
                    disabled={updating}
                >
                    <IconSymbol
                        name={completed ? "checkmark.square.fill" : "square"}
                        size={26}
                        color={textColor}
                    />
                </Pressable>

                {/* Info */}
                <View className="flex-1">
                    <Text
                        className="text-lg font-bold"
                        style={{
                            color: textColor,
                            textDecorationLine: completed ? "line-through" : "none",
                            opacity: completed ? 0.6 : 1,
                        }}
                        numberOfLines={1}
                    >
                        {todo.title}
                    </Text>

                    <View className="flex-row items-center flex-wrap gap-1 mt-1">
                        {todo.categories?.map((c) => (
                            <Category key={c.id} name={c.name} color={c.color} />
                        ))}
                        {todo.dueDate ? (
                            <Text
                                style={{ color: textColor }}
                                className="italic ml-1"
                            >
                                {formatDueDate(todo.dueDate)}
                            </Text>
                        ) : null}
                    </View>
                </View>

                {/* Edit button */}
                <Pressable onPress={goToEdit} hitSlop={8}>
                    <IconSymbol name="pencil" size={22} color={textColor} />
                </Pressable>
            </View>
        </Pressable>
    );
};

export default Todo;