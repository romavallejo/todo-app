import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createList } from "@/services/lists/createList";
import { CreateListDto } from "@/types/CreateListDto";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CreateListScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);

  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError("Title is required.");
      return false;
    }
    setTitleError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const list: CreateListDto = {
        title: title.trim(),
        description: description.trim(),
        visibility,
      };
      await createList(list);
      router.back();
    } catch {
      setSaveError("Couldn't create the list. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
            New List
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
                Title
              </Text>
              {titleError && (
                <Text style={{ fontSize: 12, color: C.red }}>{titleError}</Text>
              )}
            </View>
            <TextInput
              value={title}
              onChangeText={(v) => {
                setTitle(v);
                if (titleError) setTitleError(null);
              }}
              placeholder="Give your list a name…"
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
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.textSecondary,
                letterSpacing: 0.4,
                marginBottom: 6,
              }}
            >
              Description{" "}
              <Text style={{ fontWeight: "400", color: C.textSecondary }}>
                (optional)
              </Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What is this list about?"
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
                minHeight: 100,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: C.text }}
              >
                Public visibility
              </Text>
              <Text
                style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}
              >
                {visibility
                  ? "Anyone can view and copy this list."
                  : "Only you can see this list."}
              </Text>
            </View>
            <Switch
              value={visibility}
              onValueChange={setVisibility}
              trackColor={{ false: C.border, true: C.tintSubtle }}
              thumbColor={visibility ? C.tint : C.textSecondary}
            />
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
              <Text style={{ color: C.red, fontSize: 18, lineHeight: 20 }}>
                ×
              </Text>
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
              Create List
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateListScreen;