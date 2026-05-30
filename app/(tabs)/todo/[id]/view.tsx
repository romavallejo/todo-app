import Category from "@/components/mine/Category";
import PriorityTag from "@/components/mine/PriorityTag";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { updateTodo } from "@/services/todos/updateTodo";
import { UpdateTodoDto } from "@/types/UpdateTodoDto";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const formatDueDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const ViewTodoScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const { globalTodo } = useContext(DataContext);
  const router = useRouter();

  const [completed, setCompleted] = useState(globalTodo?.completed ?? false);
  const [updating, setUpdating] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  if (!globalTodo) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: C.background,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 32 }}>🤔</Text>
        <Text style={{ color: C.textSecondary, fontSize: 15 }}>
          No todo selected
        </Text>
      </View>
    );
  }

  const toggleCompleted = async () => {
    if (updating) return;
    const next = !completed;
    setCompleted(next);
    setToggleError(null);

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
    } catch {
      setCompleted(!next); // rollback
      setToggleError("Couldn't update status. Tap to retry.");
    } finally {
      setUpdating(false);
    }
  };

  const goToEdit = () => {
    router.navigate(`/(tabs)/todo/${globalTodo.uuid}/edit`);
  };

  return (
    <ScrollView
      style={{ backgroundColor: C.background }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 120,
      }}
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
          View Todo
        </Text>

        <TouchableOpacity
          onPress={goToEdit}
          style={({ pressed }: any) => ({
            width: 36,
            height: 36,
            borderRadius: Radius.full,
            backgroundColor: pressed ? C.surfaceAlt : C.tintSubtle,
            alignItems: "center",
            justifyContent: "center",
            ...Shadow.card,
          })}
          activeOpacity={0.8}
        >
          <IconSymbol name="pencil" size={16} color={C.tint} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: completed ? C.greenSubtle : C.surface,
          borderRadius: Radius.lg,
          borderLeftWidth: 4,
          borderLeftColor: completed ? C.green : C.tint,
          padding: 20,
          ...Shadow.card,
          gap: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={toggleCompleted}
            disabled={updating}
            hitSlop={8}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            {updating ? (
              <ActivityIndicator size="small" color={C.tint} />
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: Radius.full,
                  borderWidth: 2,
                  borderColor: completed ? C.green : C.border,
                  backgroundColor: completed ? C.green : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {completed && (
                  <IconSymbol name="checkmark" size={13} color="#fff" />
                )}
              </View>
            )}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: completed ? C.green : C.textSecondary,
              }}
            >
              {completed ? "Completed" : "Mark as complete"}
            </Text>
          </Pressable>

          <PriorityTag priority={globalTodo.priority} />
        </View>

        {toggleError && (
          <Text style={{ fontSize: 12, color: C.red }}>{toggleError}</Text>
        )}

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: C.text,
            lineHeight: 28,
            textDecorationLine: completed ? "line-through" : "none",
            opacity: completed ? 0.6 : 1,
          }}
        >
          {globalTodo.title}
        </Text>

        {globalTodo.dueDate && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: C.surfaceAlt,
              alignSelf: "flex-start",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: Radius.full,
            }}
          >
            <IconSymbol name="calendar" size={13} color={C.textSecondary} />
            <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: "500" }}>
              Due {formatDueDate(globalTodo.dueDate)}
            </Text>
          </View>
        )}

        {globalTodo.categories?.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {globalTodo.categories.map((c) => (
              <Category key={c.id} name={c.name} color={c.color} />
            ))}
          </View>
        )}
      </View>

      {globalTodo.description ? (
        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 18,
            marginTop: 14,
            ...Shadow.card,
            gap: 8,
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
            Description
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: C.text,
              lineHeight: 22,
            }}
          >
            {globalTodo.description}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={goToEdit}
        style={{
          backgroundColor: C.tint,
          borderRadius: Radius.md,
          paddingVertical: 15,
          alignItems: "center",
          marginTop: 24,
          ...Shadow.card,
        }}
        activeOpacity={0.85}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Edit Todo
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ViewTodoScreen;