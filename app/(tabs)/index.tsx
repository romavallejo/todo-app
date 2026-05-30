import ListCard from "@/components/mine/ListCard";
import Todo from "@/components/mine/Todo";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getUserLists } from "@/services/lists/getUserLists";
import { getUserTodos } from "@/services/todos/getUserTodos";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SkeletonRow = ({ wide = false }: { wide?: boolean }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: Radius.md,
        borderLeftWidth: 4,
        borderLeftColor: C.border,
        paddingVertical: 14,
        paddingHorizontal: 16,
        ...Shadow.card,
        gap: 8,
      }}
    >
      <View
        style={{
          height: 13,
          width: wide ? "60%" : "45%",
          borderRadius: Radius.sm,
          backgroundColor: C.surfaceAlt,
        }}
      />
      <View
        style={{
          height: 11,
          width: "30%",
          borderRadius: Radius.sm,
          backgroundColor: C.surfaceAlt,
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
  onRetry: () => void;
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
        gap: 10,
      }}
    >
      <Text style={{ flex: 1, color: C.red, fontSize: 14 }}>{message}</Text>
      <Pressable
        onPress={onRetry}
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
    </View>
  );
};

const SectionHeader = ({
  label,
  count,
}: {
  label: string;
  count?: number | null;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: C.textSecondary,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      {count != null && count > 0 && (
        <View
          style={{
            backgroundColor: C.tintSubtle,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: Radius.full,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", color: C.tint }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );
};

const EmptyState = ({ emoji, label }: { emoji: string; label: string }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: Radius.md,
        paddingVertical: 28,
        alignItems: "center",
        gap: 6,
        ...Shadow.card,
      }}
    >
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text style={{ color: C.textSecondary, fontSize: 14 }}>{label}</Text>
    </View>
  );
};

export default function Index() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userTodos, setUserTodos] = useState<any[] | null>(null);
  const [userTodosError, setUserTodosError] = useState<string | null>(null);
  const [userLists, setUserLists] = useState<any[] | null>(null);
  const [userListsError, setUserListsError] = useState<string | null>(null);

  const fabScale = useRef(new Animated.Value(1)).current;
  const onFabIn = () =>
    Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true }).start();
  const onFabOut = () =>
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();

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
      setUserTodosError("Couldn't load todos.");
    }

    if (listsResult.status === "fulfilled") {
      setUserLists(listsResult.value);
    } else {
      setUserListsError("Couldn't load lists.");
    }

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        await load();
        if (cancelled) return;
      })();
      return () => { cancelled = true; };
    }, [load])
  );

  const visibleTodos = useMemo(() => {
    if (!userTodos) return null;
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return userTodos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) <= endOfToday
    );
  }, [userTodos]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.tint,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {greeting}
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: C.text,
              lineHeight: 38,
              letterSpacing: -0.5,
            }}
          >
            Your Atelier
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: C.textSecondary,
              marginTop: 4,
              lineHeight: 22,
            }}
          >
            Focus on what matters today.
          </Text>
        </View>

        {!loading && !userTodosError && !userListsError && (
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: Radius.md,
                padding: 14,
                ...Shadow.card,
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: C.tint }}
              >
                {visibleTodos?.length ?? 0}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: C.textSecondary,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Due Today
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: Radius.md,
                padding: 14,
                ...Shadow.card,
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: C.tint }}
              >
                {userLists?.length ?? 0}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: C.textSecondary,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Lists
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: Radius.md,
                padding: 14,
                ...Shadow.card,
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: C.green }}
              >
                {userTodos?.filter((t) => t.completed).length ?? 0}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: C.textSecondary,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Done
              </Text>
            </View>
          </View>
        )}

        <View style={{ marginBottom: 28 }}>
          <SectionHeader
            label="Due Today"
            count={!loading && visibleTodos ? visibleTodos.length : null}
          />

          {loading ? (
            <View style={{ gap: 8 }}>
              <SkeletonRow wide />
              <SkeletonRow />
            </View>
          ) : userTodosError ? (
            <ErrorBanner message={userTodosError} onRetry={load} />
          ) : visibleTodos && visibleTodos.length > 0 ? (
            <View style={{ gap: 8 }}>
              {visibleTodos.map((t) => (
                <Todo key={t.uuid} todo={t} />
              ))}
            </View>
          ) : (
            <EmptyState emoji="✅" label="All clear — nothing due today!" />
          )}
        </View>

        <View>
          <SectionHeader
            label="Lists"
            count={!loading && userLists ? userLists.length : null}
          />

          {loading ? (
            <View style={{ gap: 8 }}>
              <SkeletonRow wide />
              <SkeletonRow />
              <SkeletonRow wide />
            </View>
          ) : userListsError ? (
            <ErrorBanner message={userListsError} onRetry={load} />
          ) : userLists && userLists.length > 0 ? (
            <View style={{ gap: 8 }}>
              {userLists.map((list) => (
                <ListCard key={list.uuid} list={list} />
              ))}
            </View>
          ) : (
            <EmptyState emoji="📋" label="No lists yet. Create your first one!" />
          )}

          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/list/create")}
            disabled={loading}
            activeOpacity={0.85}
            style={{
              backgroundColor: C.tintSubtle,
              borderRadius: Radius.md,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 12,
              opacity: loading ? 0.5 : 1,
              borderWidth: 1.5,
              borderColor: C.tint,
              borderStyle: "dashed",
            }}
          >
            <Text
              style={{
                color: C.tint,
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              + New List
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 32,
          right: 24,
          transform: [{ scale: fabScale }],
        }}
      >
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/todo/create")}
          onPressIn={onFabIn}
          onPressOut={onFabOut}
          activeOpacity={1}
          style={{
            width: 56,
            height: 56,
            borderRadius: Radius.full,
            backgroundColor: C.tint,
            alignItems: "center",
            justifyContent: "center",
            ...Shadow.modal,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              lineHeight: 32,
              fontWeight: "300",
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}