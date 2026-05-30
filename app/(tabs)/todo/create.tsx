import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getUserLists } from "@/services/lists/getUserLists";
import { createTodo } from "@/services/todos/createTodo";
import { CreateTodoDto } from "@/types/CreateTodoDto";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Priority = "LOW" | "MEDIUM" | "HIGH";

const PRIORITY_CONFIG: Record<Priority, { bg: string; text: string; dot: string; label: string }> = {
  LOW:    { bg: "#DCFCE7", text: "#166534", dot: "#16A34A", label: "Low" },
  MEDIUM: { bg: "#FEF9C3", text: "#854D0E", dot: "#CA8A04", label: "Medium" },
  HIGH:   { bg: "#FEE2E2", text: "#991B1B", dot: "#DC2626", label: "High" },
};

const FieldLabel = ({
  label,
  optional,
  error,
}: {
  label: string;
  optional?: boolean;
  error?: string | null;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: C.textSecondary,
          letterSpacing: 0.4,
        }}
      >
        {label}
        {optional && (
          <Text style={{ fontWeight: "400" }}> (optional)</Text>
        )}
      </Text>
      {error && (
        <Text style={{ fontSize: 12, color: C.red }}>{error}</Text>
      )}
    </View>
  );
};

const PickerModal = ({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: C.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: Platform.OS === "ios" ? 40 : 28,
            ...Shadow.modal,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: Radius.full,
              backgroundColor: C.border,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: C.text,
              marginBottom: 16,
            }}
          >
            {title}
          </Text>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const CreateTodoScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [listUuid, setListUuid] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allLists, setAllLists] = useState<{ id?: string; title: string }[]>([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [showListPicker, setShowListPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setListsLoading(true);
    getUserLists()
      .then(setAllLists)
      .catch(() => {})
      .finally(() => setListsLoading(false));
  }, []);

  const validate = (): boolean => {
    let ok = true;
    if (!title.trim()) { setTitleError("Title is required."); ok = false; }
    else setTitleError(null);
    if (!listUuid) { setListError("Please select a list."); ok = false; }
    else setListError(null);
    return ok;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const todo: CreateTodoDto = {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        listUuid: listUuid!,
      };
      await createTodo(todo);
      router.back();
    } catch {
      setSaveError("Couldn't create the todo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedList = allLists.find((l) => l.id === listUuid);

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 52,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
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
            New Todo
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: Radius.md,
              backgroundColor: C.tint,
              opacity: saving ? 0.65 : 1,
              ...Shadow.card,
            }}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                Create
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 20,
            ...Shadow.card,
            gap: 20,
          }}
        >
          <View>
            <FieldLabel label="Title" error={titleError} />
            <TextInput
              value={title}
              onChangeText={(v) => { setTitle(v); if (titleError) setTitleError(null); }}
              placeholder="What needs to be done?"
              placeholderTextColor={C.textSecondary}
              style={{
                backgroundColor: C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.text,
                borderWidth: titleError ? 1.5 : 0,
                borderColor: titleError ? C.red : "transparent",
              }}
            />
          </View>

          <View>
            <FieldLabel label="Description" optional />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details…"
              placeholderTextColor={C.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                fontSize: 15,
                color: C.text,
                minHeight: 96,
              }}
            />
          </View>

          <View>
            <FieldLabel label="Due Date" />
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? C.border : C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              })}
            >
              <IconSymbol name="calendar" size={16} color={C.tint} />
              <Text style={{ fontSize: 15, color: C.text }}>
                {formatDate(dueDate)}
              </Text>
            </Pressable>
            {showDatePicker && (
              <View style={{ marginTop: 8 }}>
                <DateTimePicker
                  value={dueDate}
                  mode="datetime"
                  onChange={(_, selected) => {
                    if (Platform.OS === "android") setShowDatePicker(false);
                    if (selected) setDueDate(selected);
                  }}
                />
              </View>
            )}
          </View>

          <View>
            <FieldLabel label="Priority" />
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map((p) => {
                const cfg = PRIORITY_CONFIG[p];
                const selected = priority === p;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: Radius.md,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 5,
                      backgroundColor: selected ? cfg.bg : C.surfaceAlt,
                      borderWidth: selected ? 1.5 : 0,
                      borderColor: selected ? cfg.dot : "transparent",
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: Radius.full,
                        backgroundColor: cfg.dot,
                        opacity: selected ? 1 : 0.4,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: selected ? cfg.text : C.textSecondary,
                      }}
                    >
                      {cfg.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <FieldLabel label="List" error={listError} />
            <Pressable
              onPress={() => setShowListPicker(true)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? C.border : C.surfaceAlt,
                borderRadius: Radius.md,
                paddingHorizontal: 14,
                paddingVertical: 13,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: listError ? 1.5 : 0,
                borderColor: listError ? C.red : "transparent",
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: selectedList ? C.text : C.textSecondary,
                  flex: 1,
                }}
              >
                {listsLoading
                  ? "Loading lists…"
                  : selectedList
                  ? selectedList.title
                  : "Select a list"}
              </Text>
              <IconSymbol name="chevron.right" size={14} color={C.textSecondary} />
            </Pressable>
          </View>
        </View>

        {saveError && (
          <View
            style={{
              backgroundColor: C.redSubtle,
              borderRadius: Radius.md,
              padding: 14,
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ flex: 1, color: C.red, fontSize: 14 }}>
              {saveError}
            </Text>
            <Pressable onPress={() => setSaveError(null)} hitSlop={8}>
              <Text style={{ color: C.red, fontSize: 18, lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: C.tint,
            borderRadius: Radius.md,
            paddingVertical: 15,
            alignItems: "center",
            marginTop: 24,
            opacity: saving ? 0.7 : 1,
            ...Shadow.card,
          }}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Create Todo
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <PickerModal
        visible={showListPicker}
        title="Select a List"
        onClose={() => setShowListPicker(false)}
      >
        {allLists.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 24 }}>📋</Text>
            <Text style={{ color: C.textSecondary, fontSize: 14 }}>
              No lists yet. Create one first.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 4 }}>
            {allLists.map((list) => {
              const lid = list.id;
              const selected = listUuid === lid;
              return (
                <Pressable
                  key={lid}
                  onPress={() => {
                    setListUuid(lid ?? null);
                    setListError(null);
                    setShowListPicker(false);
                  }}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: Radius.md,
                    backgroundColor: selected
                      ? C.tintSubtle
                      : pressed
                      ? C.surfaceAlt
                      : "transparent",
                  })}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: selected ? C.tint : C.text,
                      fontWeight: selected ? "600" : "400",
                    }}
                  >
                    {list.title}
                  </Text>
                  {selected && (
                    <IconSymbol name="checkmark" size={16} color={C.tint} />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </PickerModal>
    </KeyboardAvoidingView>
  );
};

export default CreateTodoScreen;