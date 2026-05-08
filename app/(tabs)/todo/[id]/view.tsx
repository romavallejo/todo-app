import Category from "@/components/mine/Category";
import PriorityTag from "@/components/mine/PriorityTag";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { updateTodo } from "@/services/todos/updateTodo";
import { UpdateTodoDto } from "@/types/UpdateTodoDto";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

const ViewTodoScreen = () => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tint = Colors[colorScheme ?? 'light'].tint;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;
    const bg = Colors[colorScheme ?? 'light'].background;

    const {globalTodo} = useContext(DataContext);
    const router = useRouter();

    const [completed, setCompleted] = useState(globalTodo.completed);
    const [updating, setUpdating] = useState(false);

    const toggleCompleted = async () => {
        if (updating) return;
        const next = !completed;
        setCompleted(next); // optimistic

        const dto: UpdateTodoDto = {
            uuid: globalTodo.uuid,
            title: globalTodo.title,
            description: globalTodo.description,
            completed: next,
            completedAt: next ? new Date() : (null as unknown as Date),
            dueDate: new Date(globalTodo.dueDate),
            listUuid: globalTodo.listUuid,
            priority: globalTodo.priority,
            ownerId: globalTodo.ownerId,
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
        router.navigate(`/(tabs)/todo/${globalTodo.id}/edit`);
    };

    return (
        <ScrollView className="flex-col px-6 pt-6">
            <View 
                className="flex w-[24px] h-[24px] justify-center items-center border rounded-[12px] mb-6"
                style={{borderColor: tintAlt}}
            >
                <Pressable 
                    onPress={() => router.back()} 
                    hitSlop={8}
                >
                    <IconSymbol name="chevron.left" size={24} color={textColor} />
                </Pressable>
            </View>
            

            <Text style={{ color: textColor }} className="mb-2 tracking-widest uppercase">
                View Todo
            </Text>

            <View 
                className="flex-col gap-3 w-full p-3 rounded-lg border-2" 
                style={{ backgroundColor: bg , borderColor: tintAlt}}
            >
                <View className="flex-row items-center gap-3">

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

                    {/* Title, categories and date */}
                    <View className="flex-1">
                    <View className='flex-row items-center'>
                        <Text
                            className="text-lg font-bold flex-1"
                            style={{
                                color: textColor,
                                textDecorationLine: completed ? "line-through" : "none",
                                opacity: completed ? 0.6 : 1,
                            }}
                            numberOfLines={1}
                        >
                            {globalTodo.title}
                        </Text>
                        <PriorityTag priority={globalTodo.priority}/>
                    </View>

                        <View className="flex-row items-center flex-wrap gap-1 mt-1">

                            {globalTodo.categories?.map((c) => (
                                <Category key={c.id} name={c.name} color={c.color} />
                            ))}

                            {globalTodo.dueDate ? (
                                <Text
                                    style={{ color: textColor }}
                                    className="italic ml-1"
                                >
                                    Due: {formatDueDate(globalTodo.dueDate)}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    
                </View>
                <View>
                    <Text style={{ color: textColor }} className="italic uppercase tracking-widest">Description</Text>
                    <Text style={{ color: textColor }}>{globalTodo.description}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{backgroundColor: tintAlt}}
                className={`rounded-xl py-4 mt-2 items-center `}
                onPress={goToEdit}
                activeOpacity={0.8}
            >
               
                <Text className="font-semibold text-base" style={{color: tint}}>
                    Edit Todo
                </Text>
                
            </TouchableOpacity>
            
            {/*
            <View className="my-6 flex-col gap-2">

                <Text
                    style={{ color: textColor }}
                    className="tracking-widest uppercase mb-2"
                    >
                    OWNED BY LIST
                </Text>
                

            </View>
            */}
            
        </ScrollView>
    );
};

export default ViewTodoScreen;