import Comment from "@/components/mine/Comment";
import TodoView from "@/components/mine/TodoView";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createComment } from "@/services/comments/createComment";
import { getCommentsByListId } from "@/services/comments/getCommentsByListId";
import { copyList } from "@/services/lists/copyList";
import { getTodoByListId } from "@/services/todos/getTodoByListId";
import { getUserName } from "@/services/user/getUserName";
import { CreateCommentDto } from "@/types/CreateCommentDto";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

const RowSkeleton = ({ wide = false }: { wide?: boolean }) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];
  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: Radius.md,
        padding: 16,
        marginBottom: 8,
        ...Shadow.card,
        borderLeftWidth: 4,
        borderLeftColor: C.border,
      }}
    >
      <View
        style={{
          height: 14,
          width: wide ? "60%" : "45%",
          borderRadius: Radius.sm,
          backgroundColor: C.surfaceAlt,
          marginBottom: 8,
        }}
      />
      <View
        style={{
          height: 12,
          width: "35%",
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
  onRetry?: () => void;
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
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: C.red, fontSize: 14, flex: 1 }}>{message}</Text>
      {onRetry && (
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
      )}
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
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
        {label}
      </Text>
      {count != null && (
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
    <View style={{ alignItems: "center", paddingVertical: 28, gap: 6 }}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={{ color: C.textSecondary, fontSize: 14 }}>{label}</Text>
    </View>
  );
};

const ViewPublicList = () => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? "light"];

  const { globalList } = useContext(DataContext);
  const router = useRouter();

  const [todosLoading, setTodosLoading] = useState(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [listTodos, setListTodos] = useState<any[] | null>(null);

  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[] | null>(null);

  const [ownerName, setOwnerName] = useState("");

  const [copying, setCopying] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const fabScale = useRef(new Animated.Value(1)).current;
  const handleFabPressIn = () =>
    Animated.spring(fabScale, { toValue: 0.92, useNativeDriver: true }).start();
  const handleFabPressOut = () =>
    Animated.spring(fabScale, { toValue: 1, useNativeDriver: true }).start();

  const loadTodos = async () => {
    setTodosLoading(true);
    setTodosError(null);
    try {
      const result = await getTodoByListId(globalList.id, false);
      setListTodos(result);
    } catch {
      setTodosError("Couldn't load todos. Please try again.");
    } finally {
      setTodosLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const result = await getCommentsByListId(globalList.id);
      setComments(result);
    } catch {
      setCommentsError("Couldn't load comments. Please try again.");
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
    loadComments();
    getUserName(globalList.owner_id)
      .then(setOwnerName)
      .catch(() => {});
  }, [globalList]);

  const cloneList = async () => {
    setCopying(true);
    setCopyError(null);
    try {
      await copyList(globalList.id);
      setCopySuccess(true);
      setTimeout(() => router.navigate("/(tabs)"), 800);
    } catch {
      setCopyError("Couldn't copy the list. Please try again.");
    } finally {
      setCopying(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    setCommentSubmitting(true);
    setCommentError(null);
    try {
      const dto: CreateCommentDto = {
        listId: globalList.id,
        comment: newComment,
      };
      await createComment(dto);
      const refreshed = await getCommentsByListId(globalList.id);
      setComments(refreshed);
      setNewComment("");
      setCommentModalVisible(false);
    } catch {
      setCommentError("Couldn't post comment. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setNewComment("");
    setCommentError(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView
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
            Public List
          </Text>

          <View style={{ width: 36 }} />
        </View>

        <View
          style={{
            backgroundColor: C.tint,
            borderRadius: Radius.lg,
            padding: 20,
            marginBottom: 16,
            ...Shadow.card,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.22)",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: Radius.full,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
              PUBLIC LIST
            </Text>
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 4,
              lineHeight: 28,
            }}
          >
            {globalList.title}
          </Text>

          {globalList.description ? (
            <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 20 }}>
              {globalList.description}
            </Text>
          ) : null}

          {ownerName ? (
            <Text
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 12,
                marginTop: 10,
                fontStyle: "italic",
              }}
            >
              by {ownerName}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={cloneList}
          disabled={copying || copySuccess}
          activeOpacity={0.85}
          style={{
            backgroundColor: copySuccess ? C.green : C.tint,
            borderRadius: Radius.md,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: copyError ? 10 : 24,
            opacity: copying ? 0.75 : 1,
            ...Shadow.card,
          }}
        >
          {copying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
              {copySuccess ? "Copied! Redirecting…" : "Copy List to My Lists"}
            </Text>
          )}
        </TouchableOpacity>

        {copyError && (
          <ErrorBanner message={copyError} onRetry={cloneList} />
        )}

        <View style={{ marginTop: 8 }}>
          <SectionHeader
            label="Todos"
            count={!todosLoading && listTodos ? listTodos.length : null}
          />

          {todosLoading ? (
            [1, 2, 3].map((i) => <RowSkeleton key={i} wide={i === 1} />)
          ) : todosError ? (
            <ErrorBanner message={todosError} onRetry={loadTodos} />
          ) : listTodos && listTodos.length > 0 ? (
            <View style={{ gap: 8 }}>
              {listTodos.map((t) => (
                <TodoView key={t.uuid} todo={t} />
              ))}
            </View>
          ) : (
            <EmptyState emoji="📭" label="No todos in this list" />
          )}
        </View>

        <View style={{ marginTop: 28 }}>
          <SectionHeader
            label="Comments"
            count={!commentsLoading && comments ? comments.length : null}
          />

          {commentsLoading ? (
            [1, 2].map((i) => <RowSkeleton key={i} />)
          ) : commentsError ? (
            <ErrorBanner message={commentsError} onRetry={loadComments} />
          ) : comments && comments.length > 0 ? (
            <View style={{ gap: 8 }}>
              {comments.map((c, i) => (
                <Comment key={i} comment={c} />
              ))}
            </View>
          ) : (
            <EmptyState emoji="💬" label="No comments yet. Be the first!" />
          )}
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
          onPress={() => setCommentModalVisible(true)}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
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
          <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32, fontWeight: "300" }}>
            +
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={commentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCommentModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            onPress={closeCommentModal}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
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
                Add a comment
              </Text>

              <TextInput
                value={newComment}
                onChangeText={(v) => {
                  setNewComment(v);
                  if (commentError) setCommentError(null);
                }}
                placeholder="Share your thoughts on this list…"
                placeholderTextColor={C.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: Radius.md,
                  padding: 14,
                  color: C.text,
                  fontSize: 15,
                  minHeight: 110,
                  borderWidth: commentError ? 1.5 : 0,
                  borderColor: commentError ? C.red : "transparent",
                  marginBottom: 6,
                }}
              />

              {commentError ? (
                <Text
                  style={{
                    color: C.red,
                    fontSize: 13,
                    marginBottom: 12,
                    marginLeft: 4,
                  }}
                >
                  {commentError}
                </Text>
              ) : (
                <View style={{ height: 14 }} />
              )}

              <View
                style={{ flexDirection: "row", gap: 12, marginTop: 4 }}
              >
                <TouchableOpacity
                  onPress={closeCommentModal}
                  disabled={commentSubmitting}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: Radius.md,
                    alignItems: "center",
                    backgroundColor: C.surfaceAlt,
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={{
                      color: C.textSecondary,
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={addComment}
                  disabled={commentSubmitting}
                  style={{
                    flex: 2,
                    paddingVertical: 14,
                    borderRadius: Radius.md,
                    alignItems: "center",
                    backgroundColor: C.tint,
                    opacity: commentSubmitting ? 0.75 : 1,
                    ...Shadow.card,
                  }}
                  activeOpacity={0.85}
                >
                  {commentSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}
                    >
                      Post Comment
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ViewPublicList;