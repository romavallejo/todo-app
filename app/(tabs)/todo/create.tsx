import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getUserLists } from "@/services/lists/getUserLists";
import { createTodo } from "@/services/todos/createTodo";
import { CreateTodoDto } from "@/types/CreateTodoDto";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

type Priority = "LOW" | "MEDIUM" | "HIGH";

const CreateTodoScreen = () => {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const tintAlt = Colors[colorScheme ?? "light"].tintAlt;
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const red = Colors[colorScheme ?? "light"].red;

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [listUuid, setListUuid] = useState<string | null>(null);

  // ui state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allLists, setAllLists] = useState<
    { string; id?: string; title: string }[]
  >([]);
  const [showListPicker, setShowListPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

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
  }, []);

  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];

  const canSave = !!listUuid && !saving;

  const handleSave = async () => {
    if (!listUuid) {
      setListError("Please select a list.");
      return;
    }
    setListError(null);
    setSaving(true);
    try {
        const todo: CreateTodoDto = {
            title: title,
            description: description,
            dueDate: dueDate,
            priority:  priority,
            listUuid: listUuid
        }
        await createTodo(todo);
        router.back();
    } catch (e) {
        console.error("Failed to create todo", e);
    } finally {
        setSaving(false);
    }
  };


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
        Create Todo
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
                style={{ color: selected ? backgroundColor : textColor }}
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
      {listError && (
        <Text className="mb-4" style={{ color: red }}>
          {listError}
        </Text>
      )}
      {!listError && <View className="mb-4" />}


      {/* Create */}
      <Pressable
        onPress={handleSave}
        disabled={!canSave}
        className="rounded-lg py-3 items-center"
        style={{ backgroundColor: tintAlt, opacity: canSave ? 1 : 0.6 }}
      >
        <Text style={{ color: backgroundColor }} className="font-semibold">
          {saving ? "Creating..." : "Create"}
        </Text>
      </Pressable>

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

export default CreateTodoScreen;