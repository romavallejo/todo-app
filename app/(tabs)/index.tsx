import ListCard from "@/components/mine/ListCard";
import Todo from "@/components/mine/Todo";
import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserLists } from "@/services/lists/getUserLists";
import { getUserTodos } from "@/services/todos/getUserTodos";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;
  const tint = Colors[colorScheme ?? 'light'].tint;
  const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

  const [loading, setLoading] = useState(true);
  const [userTodos, setUserTodos] = useState(null);
  const [userTodosError, setUserTodosError] = useState(null);
  const [userLists, setUserLists] = useState(null);
  const [userListsError, setUserListsError] = useState(null);

  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setUserTodosError(null);
    setUserListsError(null);

    const [todosResult, listsResult] = await Promise.allSettled([
      getUserTodos(true),
      getUserLists(),
    ]);

    if (todosResult.status === "fulfilled") {
      setUserTodos(todosResult.value);
    } else {
      setUserTodosError("Error while retrieving todos.");
    }

    if (listsResult.status === "fulfilled") {
      setUserLists(listsResult.value);
    } else {
      setUserListsError("Error while retrieving lists.");
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const run = async () => {
        await load();
        if (cancelled) return;
      };

      run();

      return () => {
        cancelled = true;
      };
    }, [load])
  );

  // Only show pending todos that are overdue or due today
  const visibleTodos = useMemo(() => {
    if (!userTodos) return null;

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return userTodos.filter((t) => {
      if (t.completed) return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate).getTime() <= endOfToday.getTime();
    });
  }, [userTodos]);

  return (
    <ScrollView className="flex flex-col px-6">
      <View className="mt-10">
        <Text
          style={{ color: textColor }}
          className="text-4xl font-bold tracking-tight"
        >
          Your Atelier
        </Text>
        <Text
          style={{ color: textColor }}
          className="text-xl tracking-tight"
        >
          Focus on what matters today.
        </Text>
      </View>

      {/* Todos due today */}
      <View className="mt-6 flex-col gap-2">
        <Text
          style={{ color: textColor }}
          className="tracking-widest uppercase mb-2"
        >
          Due Today
        </Text>

        {loading ? (
          <Text style={{ color: textColor }}>Loading...</Text>
        ) : userTodosError ? (
          <Text style={{ color: textColor }}>{userTodosError}</Text>
        ) : visibleTodos && visibleTodos.length > 0 ? (
          visibleTodos.map((t) => (
            <Todo key={t.uuid} todo={t}/>
          ))
        ) : (
          <Text style={{ color: textColor }}>No todos for today.</Text>
        )}
      </View>

      {/* Lists of todos */}
      <View className="mt-6 flex-col gap-2 mb-10">
        <Text style={{ color: textColor }} className="mb-2 tracking-widest uppercase">
          Lists
        </Text>

        {loading ? (
          <Text style={{ color: textColor }}>Loading...</Text>
        ) : userListsError ? (
          <Text style={{ color: textColor }}>{userListsError}</Text>
        ) : userLists && userLists.length > 0 ? (
          userLists.map((list) => (
            <ListCard key={list.uuid} list={list}/>
          ))
        ) : (
          <Text style={{ color: textColor }}>No lists yet.</Text>
        )}

        <TouchableOpacity
            style={{backgroundColor: tintAlt}}
            className={`rounded-xl py-4 mt-2 items-center `}
            onPress={() => {router.navigate("/(tabs)/list/create")}}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text className="font-semibold text-base" style={{color: tint}}>
                    Create new List
                </Text>
            )}
        </TouchableOpacity>

        {/* Floating button */}
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/todo/create")}
          activeOpacity={0.8}
          style={{
            backgroundColor: tintAlt,
            position: "fixed",
            bottom: 24,
            right: 24,
          }}
          className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Text style={{ color: tint }} className="text-3xl font-bold">
            +
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}