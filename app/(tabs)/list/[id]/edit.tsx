import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { deleteList } from "@/services/lists/deleteList";
import { editList } from "@/services/lists/editList";
import { EditListDto } from "@/types/EditListDto";
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

const FieldLabel = ({ label, error }: { label: string; error?: string | null }) => {
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
      </Text>
      {error && (
        <Text style={{ fontSize: 12, color: Colors[colorScheme ?? "light"].red }}>
          {error}
        </Text>
      )}
    </View>
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 28,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: C.surface,
            borderRadius: Radius.lg,
            padding: 24,
            width: "100%",
            ...Shadow.modal,
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: Radius.full,
              backgroundColor: C.redSubtle,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>🗑️</Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: C.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Delete List?
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: C.textSecondary,
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            This will permanently delete this list and all its todos. This action
            cannot be undone.
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={deleting}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: Radius.md,
                alignItems: "center",
                backgroundColor: C.surfaceAlt,
              }}
              activeOpacity={0.75}
            >
              <Text style={{ color: C.textSecondary, fontWeight: "600", fontSize: 15 }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={deleting}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: Radius.md,
                alignItems: "center",
                backgroundColor: C.red,
                opacity: deleting ? 0.7 : 1,
                ...Shadow.card,
              }}
              activeOpacity={0.85}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const EditListScreen = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const { globalList, setGlobalList } = useContext(DataContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (!globalList) return;
    setTitle(globalList.title ?? "");
    setDescription(globalList.description ?? "");
    setVisibility(!!globalList.visibility);
  }, [globalList]);

  const validate = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError(null);
    }
    return valid;
  };

  const handleSave = async () => {
    if (!globalList || !validate()) return;
    setSaving(true);
    setSaveError(null);
    const dto: EditListDto = {
      id: globalList.id,
      title: title.trim(),
      description: description.trim(),
      visibility,
    };
    try {
      await editList(dto);
      setGlobalList(dto);
      router.back();
    } catch {
      setSaveError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!globalList) return;
    setDeleting(true);
    try {
      await deleteList(globalList.id);
      setConfirmVisible(false);
      router.back();
    } catch {
      setConfirmVisible(false);
      setSaveError("Couldn't delete the list. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (!globalList) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.background,
        }}
      >
        <Text style={{ fontSize: 28, marginBottom: 12 }}>🤔</Text>
        <Text style={{ color: C.textSecondary, fontSize: 15 }}>
          No list selected
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 52,
          paddingBottom: 140,
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
            Edit List
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
                Save
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
            <FieldLabel label="Description" />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What is this list about? (optional)"
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
              paddingVertical: 4,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: C.text }}>
                Public visibility
              </Text>
              <Text style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>
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
              <Text style={{ color: C.red, fontSize: 18 }}>×</Text>
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
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={{
            marginTop: 28,
            borderRadius: Radius.lg,
            borderWidth: 1.5,
            borderColor: C.redSubtle,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: C.redSubtle,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: C.red,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Danger Zone
            </Text>
          </View>

          <View style={{ backgroundColor: C.surface, padding: 16 }}>
            <Text
              style={{
                fontSize: 14,
                color: C.textSecondary,
                lineHeight: 20,
                marginBottom: 14,
              }}
            >
              Deleting this list is permanent and cannot be undone. All todos
              inside it will be lost.
            </Text>

            <TouchableOpacity
              onPress={() => setConfirmVisible(true)}
              disabled={saving || deleting}
              style={{
                backgroundColor: C.red,
                borderRadius: Radius.md,
                paddingVertical: 13,
                alignItems: "center",
                opacity: saving || deleting ? 0.6 : 1,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                Delete List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmVisible(false)}
        deleting={deleting}
      />
    </KeyboardAvoidingView>
  );
};

export default EditListScreen;