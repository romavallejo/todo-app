import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from "expo-router";
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
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const router = useRouter();


    return (
        <View
            className="flex-row items-center gap-3 w-full p-3 rounded-lg border-2"
            style={{ backgroundColor: bg , borderColor: tintAlt}}
        >

            {/* Info */}
            <View className="flex-1">
                <View className='flex-row items-center'>
                    <Text
                        className="text-lg font-bold flex-1"
                        style={{
                            color: textColor,
                        }}
                        numberOfLines={1}
                    >
                        {todo.title}
                    </Text>
                    <PriorityTag priority={todo.priority}/>
                </View>

                <View>
                    <Text style={{ color: textColor }}>{todo.description}</Text>
                </View>

                <View className="flex-row items-center flex-wrap gap-1 mt-1">

                    {todo.categories?.map((c) => (
                        <Category key={c.id} name={c.name} color={c.color} />
                    ))}
                    
                    {todo.dueDate ? (
                        <Text
                            style={{ color: textColor }}
                            className="italic ml-1"
                        >
                            Due: {formatDueDate(todo.dueDate)}
                        </Text>
                    ) : null}
                </View>
            </View>

        </View>
    );
};

export default TodoView;