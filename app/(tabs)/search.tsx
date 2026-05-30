import ListCardView from "@/components/mine/ListCardView";
import Todo from "@/components/mine/Todo";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getPublicLists } from "@/services/lists/getPublicLists";
import { getUserTodos } from "@/services/todos/getUserTodos";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

type Tab = "lists" | "todos";

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
          width: wide ? "58%" : "42%",
          borderRadius: Radius.sm,
          backgroundColor: C.surfaceAlt,
        }}
      />
      <View
        style={{
          height: 11,
          width: "28%",
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

const EmptyState = ({ emoji, label }: { emoji: string; label: string }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: Radius.md,
        paddingVertical: 36,
        alignItems: "center",
        gap: 8,
        ...Shadow.card,
      }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text
        style={{ color: C.textSecondary, fontSize: 14, textAlign: "center", paddingHorizontal: 24 }}
      >
        {label}
      </Text>
    </View>
  );
};

const TabPill = ({
  label,
  active,
  count,
  onPress,
}: {
  label: string;
  active: boolean;
  count?: number | null;
  onPress: () => void;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: Radius.md,
        backgroundColor: active ? C.tint : "transparent",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: active ? "#fff" : C.textSecondary,
        }}
      >
        {label}
      </Text>
      {count != null && count > 0 && (
        <View
          style={{
            backgroundColor: active ? "rgba(255,255,255,0.25)" : C.tintSubtle,
            paddingHorizontal: 7,
            paddingVertical: 1,
            borderRadius: Radius.full,
            minWidth: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: active ? "#fff" : C.tint,
            }}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default function Search() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const [activeTab, setActiveTab] = useState<Tab>("lists");
  const [search, setSearch] = useState("");
  const inputRef = useRef<TextInput>(null);

  const [listsLoading, setListsLoading] = useState(true);
  const [publicLists, setPublicLists] = useState<any[] | null>(null);
  const [listsError, setListsError] = useState<string | null>(null);

  const [todosLoading, setTodosLoading] = useState(true);
  const [userTodos, setUserTodos] = useState<any[] | null>(null);
  const [todosError, setTodosError] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    setListsLoading(true);
    setListsError(null);
    try {
      setPublicLists(await getPublicLists());
    } catch {
      setListsError("Couldn't load public lists.");
    } finally {
      setListsLoading(false);
    }
  }, []);

  const loadTodos = useCallback(async () => {
    setTodosLoading(true);
    setTodosError(null);
    try {
      setUserTodos(await getUserTodos(true));
    } catch {
      setTodosError("Couldn't load your todos.");
    } finally {
      setTodosLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadLists(), loadTodos()]);
  }, [loadLists, loadTodos]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        await loadAll();
        if (cancelled) return;
      })();
      return () => { cancelled = true; };
    }, [loadAll])
  );

  const q = search.trim().toLowerCase();

  const filteredLists = useMemo(() => {
    if (!publicLists) return null;
    if (!q) return publicLists;
    return publicLists.filter(
      (l) =>
        l.title?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
    );
  }, [publicLists, q]);

  const filteredTodos = useMemo(() => {
    if (!userTodos) return null;
    if (!q) return userTodos;
    return userTodos.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [userTodos, q]);

  const listsCount = filteredLists?.length ?? null;
  const todosCount = filteredTodos?.length ?? null;

  const isSearching = q.length > 0;
  const activeLoading = activeTab === "lists" ? listsLoading : todosLoading;

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: C.tint,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Discover
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "800",
              color: C.text,
              letterSpacing: -0.5,
            }}
          >
            Search
          </Text>
        </View>

        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: C.surface,
            borderRadius: Radius.md,
            paddingHorizontal: 14,
            paddingVertical: 2,
            marginBottom: 16,
            gap: 10,
            ...Shadow.card,
          }}
        >
          {activeLoading && isSearching ? (
            <ActivityIndicator size="small" color={C.tint} />
          ) : (
            <IconSymbol name="magnifyingglass" size={18} color={C.textSecondary} />
          )}
          <TextInput
            ref={inputRef}
            value={search}
            onChangeText={setSearch}
            placeholder={
              activeTab === "lists"
                ? "Search public lists…"
                : "Search your todos…"
            }
            placeholderTextColor={C.textSecondary}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={{
              flex: 1,
              paddingVertical: 13,
              fontSize: 15,
              color: C.text,
            }}
          />
          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              hitSlop={8}
              style={{
                width: 20,
                height: 20,
                borderRadius: Radius.full,
                backgroundColor: C.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: C.textSecondary,
                  fontSize: 13,
                  lineHeight: 16,
                  fontWeight: "600",
                }}
              >
                ×
              </Text>
            </Pressable>
          )}
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: C.surfaceAlt,
            borderRadius: Radius.md,
            padding: 4,
            marginBottom: 20,
            gap: 4,
          }}
        >
          <TabPill
            label="Public Lists"
            active={activeTab === "lists"}
            count={!listsLoading ? listsCount : null}
            onPress={() => setActiveTab("lists")}
          />
          <TabPill
            label="My Todos"
            active={activeTab === "todos"}
            count={!todosLoading ? todosCount : null}
            onPress={() => setActiveTab("todos")}
          />
        </View>

        {activeTab === "lists" && (
          <View style={{ gap: 8 }}>
            {listsLoading ? (
              <>
                <SkeletonRow wide />
                <SkeletonRow />
                <SkeletonRow wide />
              </>
            ) : listsError ? (
              <ErrorBanner message={listsError} onRetry={loadLists} />
            ) : filteredLists && filteredLists.length > 0 ? (
              filteredLists.map((list) => (
                <ListCardView key={list.uuid} list={list} />
              ))
            ) : isSearching ? (
              <EmptyState
                emoji="🔍"
                label={`No public lists match "${search}"`}
              />
            ) : (
              <EmptyState
                emoji="🌐"
                label="No public lists."
              />
            )}
          </View>
        )}

        {activeTab === "todos" && (
          <View style={{ gap: 8 }}>
            {todosLoading ? (
              <>
                <SkeletonRow wide />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : todosError ? (
              <ErrorBanner message={todosError} onRetry={loadTodos} />
            ) : filteredTodos && filteredTodos.length > 0 ? (
              filteredTodos.map((t) => (
                <Todo key={t.uuid} todo={t} />
              ))
            ) : isSearching ? (
              <EmptyState
                emoji="🔍"
                label={`No todos match "${search}"`}
              />
            ) : (
              <EmptyState
                emoji="📝"
                label="You don't have any todos yet."
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}