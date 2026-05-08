import ListCard from "@/components/mine/ListCard";
import Todo from "@/components/mine/Todo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTodoByListId } from "@/services/todos/getTodoByListId";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const ViewListScreen = () => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tint = Colors[colorScheme ?? 'light'].tint;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;
    const bg = Colors[colorScheme ?? 'light'].background;

    const {globalList} = useContext(DataContext);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [todosError, setTodosError] = useState(null);
    const [listTodos, setListTodos] = useState(null);

    useEffect(() => {

        const load = async () => {
          setLoading(true);
          try {
            const todosResult = await getTodoByListId(globalList.id, true);
            setListTodos(todosResult);
          } catch (error) {
            setTodosError("Error while retrieving lists.");
          }
          setLoading(false);
        };
    
        load();
    
      }, [globalList]);

    const handleCompletedChange = useCallback((uuid: string, completed: boolean) => {
        setListTodos((prev) =>
            prev ? prev.map((t) => (t.uuid === uuid ? { ...t, completed } : t)) : prev
        );
    }, []);

    const progress = useMemo(() => {
        if (!listTodos || listTodos.length === 0) {
            return { done: 0, total: 0, percent: 0 };
        }
        const done = listTodos.filter((t) => t.completed).length;
        const total = listTodos.length;
        return { done, total, percent: Math.round((done / total) * 100) };
    }, [listTodos]);

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
                View List
            </Text>
            
            <ListCard list={globalList}></ListCard>

            {/* Progress */}
            {!loading && !todosError && listTodos && listTodos.length > 0 && (
                <View className="mt-6">
                    <View className="flex-row justify-between mb-2">
                        <Text style={{ color: textColor }} className="tracking-widest uppercase">
                            Progress
                        </Text>
                        <Text style={{ color: textColor }}>
                            {progress.done}/{progress.total} · {progress.percent}%
                        </Text>
                    </View>
                    <View
                        className="w-full h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: tintAlt }}
                    >
                        <View
                            style={{
                                width: `${progress.percent}%`,
                                height: "100%",
                                backgroundColor: tint,
                            }}
                        />
                    </View>
                </View>
            )}

            {/* Todos  */}
            <View className="mt-6 flex-col gap-2">
                <Text
                    style={{ color: textColor }}
                    className="tracking-widest uppercase mb-2"
                    >
                    Todos of list
                </Text>

                {loading ? (
                <Text style={{ color: textColor }}>Loading...</Text>
                ) : todosError ? (
                <Text style={{ color: textColor }}>{todosError}</Text>
                ) : listTodos && listTodos.length > 0 ? (
                listTodos.map((t) => (
                    <Todo key={t.uuid} todo={t} onCompletedChange={handleCompletedChange}/>
                ))
                ) : (
                <Text style={{ color: textColor }}>No todos.</Text>
                )}
            </View>

        </ScrollView>
    );
};

export default ViewListScreen;