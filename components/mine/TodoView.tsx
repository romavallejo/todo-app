import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View } from "react-native";
import Category from "./Category";
import PriorityTag from "./PriorityTag";

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

const TodoView = ({ todo }: TodoProps) => {
    const colorScheme = useColorScheme();
    const C = Colors[colorScheme ?? 'light'];

    return (
        <View
            style={{
                backgroundColor: todo.completed ? C.greenSubtle : C.surface,
                borderRadius: Radius.md,
                borderLeftWidth: 4,
                borderLeftColor: todo.completed ? C.green : C.tint,
                paddingVertical: 12,
                paddingHorizontal: 14,
                ...Shadow.card,
                gap: 4,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: Radius.full,
                        backgroundColor: todo.completed ? C.green : C.border,
                        flexShrink: 0,
                    }}
                />
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: "600",
                        color: C.text,
                        textDecorationLine: todo.completed ? "line-through" : "none",
                        opacity: todo.completed ? 0.55 : 1,
                    }}
                >
                    {todo.title}
                </Text>
                <PriorityTag priority={todo.priority} />
            </View>

            {todo.description ? (
                <Text
                    style={{
                        fontSize: 13,
                        color: C.textSecondary,
                        lineHeight: 18,
                        paddingLeft: 14,
                        opacity: todo.completed ? 0.6 : 1,
                    }}
                    numberOfLines={2}
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
                        paddingLeft: 14,
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
    );
};

export default TodoView;