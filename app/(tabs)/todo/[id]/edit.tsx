import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { associateCategoryTodo } from "@/services/categories/associateCategoryTodo";
import { createCategory } from "@/services/categories/createCategory";
import { deleteCategory } from "@/services/categories/deleteCategory";
import { getCategoriesByUser } from "@/services/categories/getCategoriesByUser";
import { getUserLists } from "@/services/lists/getUserLists";
import { deleteTodo } from "@/services/todos/deleteTodo";
import { updateTodo } from "@/services/todos/updateTodo";
import { CategoryType } from "@/types/CategoryType";
import { TodoType } from "@/types/TodoType";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
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
        {optional && <Text style={{ fontWeight: "400" }}> (optional)</Text>}
      </Text>
      {error && <Text style={{ fontSize: 12, color: C.red }}>{error}</Text>}
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
            maxHeight: "75%",
            ...Shadow.modal,
          }}
        >
          <View
            style={{
              width: 40, height: 4, borderRadius: Radius.full,
              backgroundColor: C.border, alignSelf: "center", marginBottom: 20,
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "700", color: C.text, marginBottom: 16 }}>
            {title}
          </Text>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const ConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
  deleting,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1, backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center", alignItems: "center", paddingHorizontal: 28,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: C.surface, borderRadius: Radius.lg,
            padding: 24, width: "100%", ...Shadow.modal,
          }}
        >
          <View
            style={{
              width: 52, height: 52, borderRadius: Radius.full,
              backgroundColor: C.redSubtle, alignItems: "center",
              justifyContent: "center", alignSelf: "center", marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>🗑️</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "700", color: C.text, textAlign: "center", marginBottom: 8 }}>
            Delete Todo?
          </Text>
          <Text style={{ fontSize: 14, color: C.textSecondary, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
            This todo will be permanently deleted and cannot be recovered.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={deleting}
              style={{ flex: 1, paddingVertical: 14, borderRadius: Radius.md, alignItems: "center", backgroundColor: C.surfaceAlt }}
              activeOpacity={0.75}
            >
              <Text style={{ color: C.textSecondary, fontWeight: "600", fontSize: 15 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={deleting}
              style={{ flex: 1, paddingVertical: 14, borderRadius: Radius.md, alignItems: "center", backgroundColor: C.red, opacity: deleting ? 0.7 : 1, ...Shadow.card }}
              activeOpacity={0.85}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const CategoryChip = ({
  cat,
  onRemove,
}: {
  cat: CategoryType;
  onRemove: (cat: CategoryType) => void;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: cat.color,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: Radius.full,
    }}
  >
    <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
      {cat.name}
    </Text>
    <Pressable onPress={() => onRemove(cat)} hitSlop={8}>
      <Text style={{ color: "rgba(255,255,255,0.85)", fontWeight: "700", fontSize: 14, lineHeight: 16 }}>
        ×
      </Text>
    </Pressable>
  </View>
);

const COLOR_PRESETS = ["#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#14B8A6",];

const EditTodoScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const { globalTodo, setGlobalTodo } = useContext(DataContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [todoCategories, setTodoCategories] = useState<CategoryType[]>([]);
  const [listUuid, setListUuid] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [allLists, setAllLists] = useState<{ id?: string; title: string }[]>([]);
  const [showListPicker, setShowListPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_PRESETS[0]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!globalTodo) return;
    setTitle(globalTodo.title);
    setDescription(globalTodo.description);
    setCompleted(globalTodo.completed);
    setDueDate(new Date(globalTodo.dueDate));
    setPriority(globalTodo.priority);
    setTodoCategories(globalTodo.categories ?? []);
    setListUuid(globalTodo.listUuid ?? null);
  }, [globalTodo]);

  useEffect(() => {
    getCategoriesByUser().then(setAllCategories).catch(() => {});
    getUserLists().then(setAllLists).catch(() => {});
  }, [globalTodo]);

  const validate = (): boolean => {
    let ok = true;
    if (!title.trim()) { setTitleError("Title is required."); ok = false; }
    else setTitleError(null);
    if (!listUuid) { setListError("Please select a list."); ok = false; }
    else setListError(null);
    return ok;
  };

  const handleSave = async () => {
    if (!globalTodo || !validate()) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateTodo({
        uuid: globalTodo.uuid,
        title: title.trim(),
        description: description.trim(),
        completed,
        completedAt: completed ? (globalTodo.completedAt ?? new Date().toISOString()) : null,
        dueDate,
        listUuid: listUuid!,
        priority,
        ownerId: globalTodo.ownerId,
      });
      const updated: TodoType = {
        ...globalTodo,
        title: title.trim(),
        description: description.trim(),
        completed,
        completedAt: completed ? (globalTodo.completedAt ?? new Date().toISOString()) : null,
        dueDate: dueDate.toISOString(),
        listUuid: listUuid as TodoType["listUuid"],
        priority,
        categories: todoCategories,
      };
      setGlobalTodo(updated);
      router.back();
    } catch {
      setSaveError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!globalTodo) return;
    setDeleting(true);
    try {
      await deleteTodo(globalTodo.uuid);
      setConfirmVisible(false);
      router.back();
    } catch {
      setConfirmVisible(false);
      setSaveError("Couldn't delete the todo. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddCategory = async (category: CategoryType) => {
    if (!globalTodo) return;
    if (todoCategories.some((c) => c.id === category.id)) {
      setShowCategoryPicker(false);
      return;
    }
    try {
      await associateCategoryTodo({ categoryId: category.id, todoId: globalTodo.uuid });
      setTodoCategories([...todoCategories, category]);
      setShowCategoryPicker(false);
    } catch {
    }
  };

  const handleRemoveCategory = async (category: CategoryType) => {
    try {
      await deleteCategory(category.id);
      setTodoCategories(todoCategories.filter((c) => c.id !== category.id));
      setAllCategories(allCategories.filter((c) => c.id !== category.id));
    } catch {}
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setAllCategories([newCat, ...allCategories]);
      setNewCategoryName("");
      setNewCategoryColor(COLOR_PRESETS[0]);
      setShowCreateCategory(false);
    } catch {}
  };

  if (!globalTodo) {
    return (
      <View style={{ flex: 1, backgroundColor: C.background, justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 32 }}>🤔</Text>
        <Text style={{ color: C.textSecondary, fontSize: 15 }}>No todo selected</Text>
      </View>
    );
  }

  const selectedList = allLists.find((l) => l.id === listUuid);
  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 52, paddingBottom: 140 }}
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
              width: 36, height: 36, borderRadius: Radius.full,
              backgroundColor: pressed ? C.surfaceAlt : C.surface,
              borderWidth: 1, borderColor: C.border,
              alignItems: "center", justifyContent: "center", ...Shadow.card,
            })}
          >
            <IconSymbol name="chevron.left" size={18} color={C.text} />
          </Pressable>

          <Text style={{ fontSize: 12, fontWeight: "600", color: C.textSecondary, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Edit Todo
          </Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.md, backgroundColor: C.tint, opacity: saving ? 0.65 : 1, ...Shadow.card }}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: C.surface, borderRadius: Radius.lg, padding: 20, ...Shadow.card, gap: 20 }}>

          <View>
            <FieldLabel label="Title" error={titleError} />
            <TextInput
              value={title}
              onChangeText={(v) => { setTitle(v); if (titleError) setTitleError(null); }}
              placeholder="What needs to be done?"
              placeholderTextColor={C.textSecondary}
              style={{
                backgroundColor: C.surfaceAlt, borderRadius: Radius.md,
                paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.text,
                borderWidth: titleError ? 1.5 : 0, borderColor: titleError ? C.red : "transparent",
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
                backgroundColor: C.surfaceAlt, borderRadius: Radius.md,
                paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
                color: C.text, minHeight: 96,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: C.text }}>Completed</Text>
              <Text style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
                {completed ? "This todo is done." : "Still in progress."}
              </Text>
            </View>
            <Switch
              value={completed}
              onValueChange={setCompleted}
              trackColor={{ false: C.border, true: C.tintSubtle }}
              thumbColor={completed ? C.green : C.textSecondary}
            />
          </View>

          <View>
            <FieldLabel label="Due Date" />
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={({ pressed }) => ({
                backgroundColor: pressed ? C.border : C.surfaceAlt,
                borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13,
                flexDirection: "row", alignItems: "center", gap: 8,
              })}
            >
              <IconSymbol name="calendar" size={16} color={C.tint} />
              <Text style={{ fontSize: 15, color: C.text }}>{formatDate(dueDate)}</Text>
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
                      flex: 1, paddingVertical: 10, borderRadius: Radius.md,
                      alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 5,
                      backgroundColor: selected ? cfg.bg : C.surfaceAlt,
                      borderWidth: selected ? 1.5 : 0, borderColor: selected ? cfg.dot : "transparent",
                    }}
                  >
                    <View style={{ width: 7, height: 7, borderRadius: Radius.full, backgroundColor: cfg.dot, opacity: selected ? 1 : 0.4 }} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: selected ? cfg.text : C.textSecondary }}>
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
                borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13,
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                borderWidth: listError ? 1.5 : 0, borderColor: listError ? C.red : "transparent",
              })}
            >
              <Text style={{ fontSize: 15, color: selectedList ? C.text : C.textSecondary, flex: 1 }}>
                {selectedList ? selectedList.title : "Select a list"}
              </Text>
              <IconSymbol name="chevron.right" size={14} color={C.textSecondary} />
            </Pressable>
          </View>

          <View>
            <FieldLabel label="Categories" optional />
            {todoCategories.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {todoCategories.map((cat) => (
                  <CategoryChip key={cat.id} cat={cat} onRemove={handleRemoveCategory} />
                ))}
              </View>
            )}
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => setShowCategoryPicker(true)}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 10, borderRadius: Radius.md,
                  backgroundColor: pressed ? C.border : C.surfaceAlt,
                  alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
                })}
              >
                <Text style={{ fontSize: 13, color: C.tint, fontWeight: "600" }}>+ Add</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowCreateCategory(true)}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 10, borderRadius: Radius.md,
                  backgroundColor: pressed ? C.border : C.surfaceAlt,
                  alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6,
                })}
              >
                <Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: "600" }}>New category</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {saveError && (
          <View style={{ backgroundColor: C.redSubtle, borderRadius: Radius.md, padding: 14, marginTop: 16, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ flex: 1, color: C.red, fontSize: 14 }}>{saveError}</Text>
            <Pressable onPress={() => setSaveError(null)} hitSlop={8}>
              <Text style={{ color: C.red, fontSize: 18, lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ backgroundColor: C.tint, borderRadius: Radius.md, paddingVertical: 15, alignItems: "center", marginTop: 24, opacity: saving ? 0.7 : 1, ...Shadow.card }}
          activeOpacity={0.85}
        >
          {saving ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ marginTop: 28, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: C.redSubtle, overflow: "hidden" }}>
          <View style={{ backgroundColor: C.redSubtle, paddingHorizontal: 16, paddingVertical: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: C.red, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Danger Zone
            </Text>
          </View>
          <View style={{ backgroundColor: C.surface, padding: 16 }}>
            <Text style={{ fontSize: 14, color: C.textSecondary, lineHeight: 20, marginBottom: 14 }}>
              Deleting this todo is permanent and cannot be undone.
            </Text>
            <TouchableOpacity
              onPress={() => setConfirmVisible(true)}
              disabled={saving || deleting}
              style={{ backgroundColor: C.red, borderRadius: Radius.md, paddingVertical: 13, alignItems: "center", opacity: saving || deleting ? 0.6 : 1 }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Delete Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <PickerModal visible={showListPicker} title="Select a List" onClose={() => setShowListPicker(false)}>
        {allLists.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 24 }}>📋</Text>
            <Text style={{ color: C.textSecondary, fontSize: 14 }}>No lists yet.</Text>
          </View>
        ) : (
          <View style={{ gap: 4 }}>
            {allLists.map((list) => {
              const lid = list.id;
              const selected = listUuid === lid;
              return (
                <Pressable
                  key={lid}
                  onPress={() => { setListUuid(lid ?? null); setListError(null); setShowListPicker(false); }}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                    paddingVertical: 12, paddingHorizontal: 14, borderRadius: Radius.md,
                    backgroundColor: selected ? C.tintSubtle : pressed ? C.surfaceAlt : "transparent",
                  })}
                >
                  <Text style={{ fontSize: 15, color: selected ? C.tint : C.text, fontWeight: selected ? "600" : "400" }}>
                    {list.title}
                  </Text>
                  {selected && <IconSymbol name="checkmark" size={16} color={C.tint} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </PickerModal>

      <PickerModal visible={showCategoryPicker} title="Add a Category" onClose={() => setShowCategoryPicker(false)}>
        {allCategories.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 24 }}>🏷️</Text>
            <Text style={{ color: C.textSecondary, fontSize: 14 }}>No categories yet. Create one first.</Text>
          </View>
        ) : (
          <View style={{ gap: 4 }}>
            {allCategories.map((cat) => {
              const already = todoCategories.some((c) => c.id === cat.id);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleAddCategory(cat)}
                  disabled={already}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center", gap: 12,
                    paddingVertical: 12, paddingHorizontal: 14, borderRadius: Radius.md,
                    backgroundColor: already ? C.surfaceAlt : pressed ? C.surfaceAlt : "transparent",
                    opacity: already ? 0.5 : 1,
                  })}
                >
                  <View style={{ width: 14, height: 14, borderRadius: Radius.full, backgroundColor: cat.color }} />
                  <Text style={{ fontSize: 15, color: C.text, flex: 1 }}>{cat.name}</Text>
                  {already && <Text style={{ fontSize: 12, color: C.textSecondary }}>Added</Text>}
                </Pressable>
              );
            })}
          </View>
        )}
      </PickerModal>

      <PickerModal visible={showCreateCategory} title="New Category" onClose={() => setShowCreateCategory(false)}>
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Category name"
          placeholderTextColor={C.textSecondary}
          style={{
            backgroundColor: C.surfaceAlt, borderRadius: Radius.md,
            paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
            color: C.text, marginBottom: 14,
          }}
        />

        <Text style={{ fontSize: 13, fontWeight: "600", color: C.textSecondary, marginBottom: 10 }}>
          Color
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {COLOR_PRESETS.map((hex) => (
            <Pressable
              key={hex}
              onPress={() => setNewCategoryColor(hex)}
              style={{
                width: 36, height: 36, borderRadius: Radius.full,
                backgroundColor: hex,
                borderWidth: newCategoryColor === hex ? 3 : 0,
                borderColor: C.text,
              }}
            />
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Text style={{ fontSize: 13, color: C.textSecondary }}>Preview:</Text>
          <View style={{ backgroundColor: newCategoryColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full }}>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>
              {newCategoryName || "Category"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShowCreateCategory(false)}
            style={{ flex: 1, paddingVertical: 14, borderRadius: Radius.md, alignItems: "center", backgroundColor: C.surfaceAlt }}
            activeOpacity={0.75}
          >
            <Text style={{ color: C.textSecondary, fontWeight: "600", fontSize: 15 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreateCategory}
            style={{ flex: 1, paddingVertical: 14, borderRadius: Radius.md, alignItems: "center", backgroundColor: C.tint, ...Shadow.card }}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Create</Text>
          </TouchableOpacity>
        </View>
      </PickerModal>

      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmVisible(false)}
        deleting={deleting}
      />
    </KeyboardAvoidingView>
  );
};

export default EditTodoScreen;