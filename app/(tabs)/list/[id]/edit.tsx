import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { deleteList } from "@/services/lists/deleteList";
import { editList } from "@/services/lists/editList";
import { EditListDto } from "@/types/EditListDto";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

const EditListScreen = () => {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const tint = Colors[colorScheme ?? "light"].tint;
  const tintAlt = Colors[colorScheme ?? "light"].tintAlt;
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const red = Colors[colorScheme ?? "light"].red;

  const { globalList, setGlobalList } = useContext(DataContext);

  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);

  // ui state
  const [saving, setSaving] = useState(false);

  // hydrate from globalTodo
  useEffect(() => {
    if (!globalList) return;
    setTitle(globalList.title);
    setDescription(globalList.description);
    setVisibility(globalList.visibility);
  }, [globalList]);

  const handleSave = async () => {
    if (!globalList) return;
    setSaving(true);
    const list: EditListDto = {
        id: globalList.id,
        description: description,
        title: title,
        visibility: visibility
    };
    try {
        await editList(list);
        router.back();
    } catch (e) {
        console.error("Failed to save list", e);
    } finally {
        setGlobalList(list)
        setSaving(false);
    }
    };

  const handleDelete = async () => {
    if (!globalList) return;
    setSaving(true);
    try {
      await deleteList(globalList.id);
      router.back();
    } catch(err) {
      console.error("Failed to delete list", err);
    } finally {
      setSaving(false)
      router.back()
    }
  };

  if (!globalList) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: textColor }}>No list selected</Text>
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
        Edit List
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

      {/* Visibility */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-semibold" style={{ color: textColor }}>
          Visibility
        </Text>
        <Switch value={visibility} onValueChange={setVisibility} />
      </View>

      {/* Save */}
      <Pressable
        onPress={handleSave}
        disabled={saving}
        className="rounded-lg py-3 items-center mb-3"
        style={{ backgroundColor: tintAlt, opacity: saving ? 0.6 : 1 }}
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

    </ScrollView>
  );
};

export default EditListScreen;