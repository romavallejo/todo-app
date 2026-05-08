import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

type Priority = "LOW" | "MEDIUM" | "HIGH";

const EditTodoScreen = () => {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const tint = Colors[colorScheme ?? "light"].tint;
  const tintAlt = Colors[colorScheme ?? "light"].tintAlt;
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const red = Colors[colorScheme ?? "light"].red;

  const { globalTodo, setGlobalTodo } = useContext(DataContext);

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [todoCategories, setTodoCategories] = useState<CategoryType[]>([]);
  const [listUuid, setListUuid] = useState<string | null>(null);

  // ui state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [allLists, setAllLists] = useState<
    { string; id?: string; title: string }[]
  >([]);
  const [showListPicker, setShowListPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // hydrate from globalTodo
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

  // load all user categories for the picker
  useEffect(() => {
    (async () => {
      try {
        const data = await getCategoriesByUser();
        setAllCategories(data);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    })();
  }, [globalTodo]);

  // load all user lists for the picker
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserLists();
        setAllLists(data);
      } catch (e) {
        console.error("Failed to load lists", e);
      }
    })();
  }, [globalTodo]);

  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

  const canSave = !!listUuid && !saving;

  const handleSave = async () => {
    if (!globalTodo) return;
    if (!listUuid) {
      setListError("Please select a list.");
      return;
    }
    setListError(null);
    setSaving(true);
    try {
      await updateTodo({
        uuid: globalTodo.uuid,
        title,
        description,
        completed,
        completedAt: completed
          ? globalTodo.completedAt ?? new Date().toISOString()
          : null,
        dueDate: dueDate,
        listUuid: listUuid,
        priority,
        ownerId: globalTodo.ownerId,
      });

      const updated: TodoType = {
        ...globalTodo,
        title,
        description,
        completed,
        completedAt: completed
          ? globalTodo.completedAt ?? new Date().toISOString()
          : null,
        dueDate: dueDate.toISOString(),
        listUuid: listUuid as TodoType["listUuid"],
        priority,
        categories: todoCategories,
      };
      setGlobalTodo(updated);
      router.back();
    } catch (e) {
      console.error("Failed to save todo", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!globalTodo) return;
    setSaving(true);
    try {
      await deleteTodo(globalTodo.uuid);
    } catch(err) {
      console.error("Failed to delete todo", err);
    } finally {
      setSaving(false)
      router.back()
    }
  };

  const handleAddCategoryToTodo = async (category: CategoryType) => {
    if (!globalTodo) return;
    if (todoCategories.some((c) => c.id === category.id)) {
      setShowCategoryPicker(false);
      return;
    }
    try {
      await associateCategoryTodo({
        categoryId: category.id,
        todoId: globalTodo.uuid,
      });
      setTodoCategories([...todoCategories, category]);
      setShowCategoryPicker(false);
    } catch (e) {
      console.error("Failed to associate category", e);
    }
  };

  const handleRemoveCategoryFromTodo = async (category: CategoryType) => {
    try {
      await deleteCategory(category.id);
      setTodoCategories(
        todoCategories.filter((c) => c.id !== category.id)
      );
      setAllCategories(allCategories.filter((c) => c.id !== category.id));
    } catch (e) {
      console.error("Failed to delete category", e);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
      });
      setAllCategories([newCat, ...allCategories]);
    } catch (e) {
      console.error("Failed to create category", e);
    } finally {
      setShowCreateCategory(false);
    }
  };

  if (!globalTodo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: textColor }}>No todo selected</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-col px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Back button */}
      <View
        className="flex w-[24px] h-[24px] justify-center items-center border rounded-[12px] mb-6"
        style={{ borderColor: tintAlt }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </Pressable>
      </View>

      <Text style={{ color: textColor }} className="mb-2 tracking-widest uppercase">
        Edit todo
      </Text>

      {/* Title */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        Title
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={tintAlt}
        className="border rounded-lg px-3 py-2 mb-4"
        style={{ borderColor: tintAlt, color: textColor }}
      />

      {/* Description */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={tintAlt}
        multiline
        numberOfLines={4}
        className="border rounded-lg px-3 py-2 mb-4"
        style={{
          borderColor: tintAlt,
          color: textColor,
          minHeight: 96,
          textAlignVertical: "top",
        }}
      />

      {/* Completed */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-semibold" style={{ color: textColor }}>
          Completed
        </Text>
        <Switch value={completed} onValueChange={setCompleted} />
      </View>

      {/* Due date */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        Due date
      </Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="border rounded-lg px-3 py-3 mb-4"
        style={{ borderColor: tintAlt }}
      >
        <Text style={{ color: textColor }}>{dueDate.toLocaleString()}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="datetime"
          onChange={(_, selected) => {
            if (Platform.OS === "android") setShowDatePicker(false);
            if (selected) setDueDate(selected);
          }}
        />
      )}

      {/* Priority */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        Priority
      </Text>
      <View className="flex-row gap-2 mb-4">
        {priorities.map((p) => {
          const selected = priority === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              className="flex-1 border rounded-lg py-2 items-center"
              style={{
                borderColor: tintAlt,
                backgroundColor: selected ? tintAlt : "transparent",
              }}
            >
              <Text
                style={{ color: selected ? tint : textColor }}
                className="font-semibold"
              >
                {p}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        List <Text style={{ color: red }}>*</Text>
      </Text>
      <View className="flex-row gap-2 mb-2">
        <Pressable
          onPress={() => setShowListPicker(true)}
          className="flex-1 border rounded-lg px-3 py-3"
          style={{ borderColor: listError ? red : tintAlt }}
        >
          <Text style={{ color: textColor }}>
            {listUuid
              ? allLists.find((l) => (l.id) === listUuid)?.title ??
                "Selected list"
              : "Select a list"}
          </Text>
        </Pressable>
      </View>
      {listError ? (
        <Text className="mb-4" style={{ color: red }}>
          {listError}
        </Text>
      ) : (
        <View className="mb-4" />
      )}

      {/* Categories */}
      <Text className="mb-2 font-semibold" style={{ color: textColor }}>
        Categories
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-2">
        {todoCategories.map((cat) => (
          <View
            key={cat.id}
            className="flex-row items-center px-3 py-1 rounded-full"
            style={{ backgroundColor: cat.color ?? tintAlt }}
          >
            <Text style={{ color: "#fff" }} className="mr-2">
              {cat.name}
            </Text>
            <Pressable
              onPress={() => handleRemoveCategoryFromTodo(cat)}
              hitSlop={8}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <View className="flex-row gap-2 mb-6">
        <Pressable
          onPress={() => setShowCategoryPicker(true)}
          className="border rounded-lg px-3 py-2"
          style={{ borderColor: tintAlt }}
        >
          <Text style={{ color: textColor }}>+ Add category</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowCreateCategory(true)}
          className="border rounded-lg px-3 py-2"
          style={{ borderColor: tintAlt }}
        >
          <Text style={{ color: textColor }}>New category</Text>
        </Pressable>
      </View>

      {/* Save */}
      <Pressable
        onPress={handleSave}
        disabled={!canSave}
        className="rounded-lg py-3 items-center mb-3"
        style={{ backgroundColor: tintAlt, opacity: canSave ? 1 : 0.6 }}
      >
        <Text style={{ color: tint }} className="font-semibold">
          {saving ? "Saving..." : "Save"}
        </Text>
      </Pressable>

      {/* Delete */}
      <Pressable
        onPress={handleDelete}
        disabled={saving}
        className="rounded-lg py-3 items-center"
        style={{ backgroundColor: red, opacity: saving ? 0.6 : 1 }}
      >
        <Text style={{ color: backgroundColor }} className="font-semibold">
          {saving ? "Deleting..." : "Delete"}
        </Text>
      </Pressable>

      {/* Category picker modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <Pressable
          onPress={() => setShowCategoryPicker(false)}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            className="w-4/5 rounded-lg p-4"
            style={{ backgroundColor }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              className="font-semibold mb-3"
              style={{ color: textColor, fontSize: 16 }}
            >
              Select a category
            </Text>
            {allCategories.length === 0 && (
              <Text style={{ color: tintAlt }}>No categories yet</Text>
            )}
            {allCategories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => handleAddCategoryToTodo(cat)}
                className="flex-row items-center py-2"
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: cat.color ?? tintAlt,
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: textColor }}>{cat.name}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Create category modal */}
      <Modal
        visible={showCreateCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateCategory(false)}
      >
        <Pressable
          onPress={() => setShowCreateCategory(false)}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            className="w-4/5 rounded-lg p-4"
            style={{ backgroundColor }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              className="font-semibold mb-3"
              style={{ color: textColor, fontSize: 16 }}
            >
              New category
            </Text>
            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Name"
              placeholderTextColor={tintAlt}
              className="border rounded-lg px-3 py-2 mb-3"
              style={{ borderColor: tintAlt, color: textColor }}
            />
            <TextInput
              value={newCategoryColor}
              onChangeText={setNewCategoryColor}
              placeholder="#3b82f6"
              placeholderTextColor={tintAlt}
              autoCapitalize="none"
              className="border rounded-lg px-3 py-2 mb-3"
              style={{ borderColor: tintAlt, color: textColor }}
            />
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowCreateCategory(false)}
                className="flex-1 border rounded-lg py-2 items-center"
                style={{ borderColor: tintAlt }}
              >
                <Text style={{ color: textColor }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateCategory}
                className="flex-1 rounded-lg py-2 items-center"
                style={{ backgroundColor: tintAlt }}
              >
                <Text style={{ color: textColor }}>Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* List picker modal */}
      <Modal
        visible={showListPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowListPicker(false)}
      >
        <Pressable
          onPress={() => setShowListPicker(false)}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            className="w-4/5 rounded-lg p-4"
            style={{ backgroundColor }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              className="font-semibold mb-3"
              style={{ color: textColor, fontSize: 16 }}
            >
              Select a list
            </Text>
            {allLists.length === 0 && (
              <Text style={{ color: tintAlt }}>No lists yet</Text>
            )}
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
                  className="flex-row items-center justify-between py-2"
                >
                  <Text style={{ color: textColor }}>{list.title}</Text>
                  {selected && (
                    <Text style={{ color: tintAlt, fontWeight: "bold" }}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default EditTodoScreen;