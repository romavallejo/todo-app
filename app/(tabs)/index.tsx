import ListCard from "@/components/mine/ListCard";
import Todo from "@/components/mine/Todo";
import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserLists } from "@/services/lists/getUserLists";
import { getUserTodos } from "@/services/todos/getUserTodos";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
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

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const [todosResult, listsResult] = await Promise.allSettled([
        getUserTodos(true),
        getUserLists(),
      ]);

      if (cancelled) return;

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
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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
      <View className="mt-6">
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
        ) : userTodos && userTodos.length > 0 ? (
          userTodos.map((t) => (
            <Todo key={t.uuid} todo={t}/>
          ))
        ) : (
          <Text style={{ color: textColor }}>No todos for today.</Text>
        )}
      </View>

      {/* Lists of todos */}
      <View className="mt-6">
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
      </View>
    </ScrollView>
  );
}