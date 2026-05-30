import ListCard from "@/components/mine/ListCard";
import Todo from "@/components/mine/Todo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getTodoByListId } from "@/services/todos/getTodoByListId";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

const TodoSkeleton = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: Radius.md,
        padding: 16,
        marginBottom: 8,
        ...Shadow.card,
        borderLeftWidth: 4,
        borderLeftColor: C.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: Radius.full,
            backgroundColor: C.surfaceAlt,
          }}
        />
        <View
          style={{
            height: 14,
            width: "55%",
            borderRadius: Radius.sm,
            backgroundColor: C.surfaceAlt,
          }}
        />
      </View>
      <View
        style={{
          height: 12,
          width: "40%",
          borderRadius: Radius.sm,
          backgroundColor: C.surfaceAlt,
          marginTop: 8,
          marginLeft: 32,
        }}
      />
    </View>
  );
};

const ErrorBanner = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.redSubtle,
        borderRadius: Radius.md,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <Text style={{ color: C.red, fontSize: 14, flex: 1 }}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          hitSlop={8}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: C.red,
            borderRadius: Radius.sm,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
            Retry
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const EmptyTodos = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 40,
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 32 }}>📋</Text>
      <Text style={{ color: C.textSecondary, fontSize: 15, fontWeight: "500" }}>
        No todos yet
      </Text>
      <Text style={{ color: C.textSecondary, fontSize: 13, textAlign: "center" }}>
        Add your first todo to start tracking progress.
      </Text>
    </View>
  );
};

const ViewListScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const { globalList } = useContext(DataContext);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [listTodos, setListTodos] = useState<any[] | null>(null);

  const loadTodos = useCallback(async () => {
    if (!globalList) return;
    setLoading(true);
    setTodosError(null);
    try {
      const result = await getTodoByListId(globalList.id, true);
      setListTodos(result);
    } catch {
      setTodosError("Couldn't load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [globalList]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCompletedChange = useCallback(
    (uuid: string, completed: boolean) => {
      setListTodos((prev) =>
        prev ? prev.map((t) => (t.uuid === uuid ? { ...t, completed } : t)) : prev
      );
    },
    []
  );

  const progress = useMemo(() => {
    if (!listTodos || listTodos.length === 0)
      return { done: 0, total: 0, percent: 0 };
    const done = listTodos.filter((t) => t.completed).length;
    const total = listTodos.length;
    return { done, total, percent: Math.round((done / total) * 100) };
  }, [listTodos]);

  const progressLabel =
    progress.total === 0
      ? null
      : progress.percent === 100
      ? "Complete"
      : `${progress.done}/${progress.total} done`;

  return (
    <ScrollView
      style={{ backgroundColor: C.background }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: Radius.full,
            backgroundColor: pressed ? C.surfaceAlt : C.surface,
            borderWidth: 1,
            borderColor: C.border,
            alignItems: "center",
            justifyContent: "center",
            ...Shadow.card,
          })}
        >
          <IconSymbol name="chevron.left" size={18} color={C.text} />
        </Pressable>

        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: C.textSecondary,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          View List
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ListCard list={globalList} />

      {!loading && !todosError && listTodos && listTodos.length > 0 && (
        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 16,
            marginTop: 20,
            ...Shadow.card,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: C.textSecondary,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Progress
            </Text>

            <View
              style={{
                backgroundColor:
                  progress.percent === 100 ? C.greenSubtle : C.tintSubtle,
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: Radius.full,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: progress.percent === 100 ? C.green : C.tint,
                }}
              >
                {progressLabel}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 6,
              borderRadius: Radius.full,
              backgroundColor: C.surfaceAlt,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progress.percent}%`,
                height: "100%",
                backgroundColor:
                  progress.percent === 100 ? C.green : C.tint,
                borderRadius: Radius.full,
              }}
            />
          </View>

          <Text
            style={{
              marginTop: 6,
              fontSize: 12,
              color: C.textSecondary,
              textAlign: "right",
            }}
          >
            {progress.percent}%
          </Text>
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: C.textSecondary,
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Todos
          </Text>

          {!loading && listTodos && listTodos.length > 0 && (
            <View
              style={{
                backgroundColor: C.tintSubtle,
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: Radius.full,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: C.tint }}>
                {listTodos.filter((t) => !t.completed).length} remaining
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <TodoSkeleton key={i} />
            ))}
          </>
        ) : todosError ? (
          <ErrorBanner message={todosError} onRetry={loadTodos} />
        ) : listTodos && listTodos.length > 0 ? (
          <View style={{ gap: 8 }}>
            {listTodos.map((t) => (
              <Todo key={t.uuid} todo={t} onCompletedChange={handleCompletedChange} />
            ))}
          </View>
        ) : (
          <EmptyTodos />
        )}
      </View>
    </ScrollView>
  );
};

export default ViewListScreen;