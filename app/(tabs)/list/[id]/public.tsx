import Comment from "@/components/mine/Comment";
import TodoView from "@/components/mine/TodoView";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createComment } from "@/services/comments/createComment";
import { getCommentsByListId } from "@/services/comments/getCommentsByListId";
import { copyList } from "@/services/lists/copyList";
import { getTodoByListId } from "@/services/todos/getTodoByListId";
import { CreateCommentDto } from "@/types/CreateCommentDto";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const ViewPublicList = () => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tint = Colors[colorScheme ?? 'light'].tint;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;
    const bg = Colors[colorScheme ?? 'light'].background;

    const {globalList} = useContext(DataContext);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [todosError, setTodosError] = useState(null);
    const [listTodos, setListTodos] = useState(null);
    const [copyError, setCopyError] = useState(null);
    const [comments, setComments] = useState(null);
    const [commentsError, setCommentsError] = useState(null);

    const [newComment, setNewComment] = useState("");
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);

    const cloneList = async () => {
        setLoading(true);
        try {
            await copyList(globalList.id);
            router.navigate("/(tabs)");

        } catch(error) {
            setCopyError("Error while copping the list.")
        }
        setLoading(false);
    };

    const addComment = async () => {
        if (!newComment.trim()) {
            setCommentError("Comment cannot be empty.");
            return;
        }
        setCommentSubmitting(true);
        setCommentError(null);
        try {
            const comment: CreateCommentDto = {
                listId: globalList.id,
                comment: newComment
            }
            const created = await createComment(comment);

            // refresh comments locally instead of navigating away
            const refreshed = await getCommentsByListId(globalList.id);
            setComments(refreshed);

            setNewComment("");
            setCommentModalVisible(false);
        } catch(error) {
            setCommentError("Error while creating the comment.");
        }
        setCommentSubmitting(false);
    };

    const closeCommentModal = () => {
        setCommentModalVisible(false);
        setNewComment("");
        setCommentError(null);
    };

    useEffect(() => {

        const loadTodos = async () => {
          try {
            const todosResult = await getTodoByListId(globalList.id, false);
            setListTodos(todosResult);
          } catch (error) {
            setTodosError("Error while retrieving todos.");
          }
        };

        const loadComments = async () => {
          try {
            const commentsResult = await getCommentsByListId(globalList.id);
            setComments(commentsResult);
          } catch (error) {
            setCommentsError("Error while retrieving comments.");
          }
        };

        setLoading(true);
        loadTodos();
        loadComments();
        setLoading(false);
    
      }, [globalList]);

    return (
        <ScrollView className="flex-col px-6 pt-6">
            <View 
                className="flex w-[24px] h-[24px] justify-center items-center border rounded-[12px] mb-6"
                style={{borderColor: tintAlt}}
            >
                <Pressable 
                    onPress={() => router.back()} 
                    hitSlop={8}
                >
                    <IconSymbol name="chevron.left" size={24} color={textColor} />
                </Pressable>
            </View>

            <Text style={{ color: textColor }} className="mb-2 tracking-widest uppercase">
                Public List
            </Text>

            <TouchableOpacity
                style={{backgroundColor: tintAlt}}
                className={`rounded-xl py-4 mt-2 items-center mb-3`}
                onPress={cloneList}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="font-semibold text-base" style={{color: tint}}>
                        Copy List
                    </Text>
                )}
            </TouchableOpacity>

            {copyError && <Text style={{ color: textColor }}>{copyError}</Text>}
            
            <View
                className="w-full p-3 rounded-lg border-2"
                style={{ backgroundColor: bg , borderColor: tintAlt}}
            >       
                <View className="flex-row items-center">
                    <Text
                        className="text-lg font-bold flex-1"
                        style={{
                            color: textColor,
                        }}
                        numberOfLines={1}
                    >
                        {globalList.title}
                    </Text>
                    <Text
                        className="italic"
                        style={{
                            color: textColor,
                        }}
                        numberOfLines={1}
                    >
                        user name
                    </Text>
                </View>

                <Text
                    style={{
                        color: textColor,
                        opacity: 1,
                    }}
                >
                    {globalList.description}
                </Text>
            </View>

            {/* Todos  */}
            <View className="mt-6 flex-col gap-2">
                <Text
                style={{ color: textColor }}
                className="tracking-widest uppercase mb-2"
                >
                Todos of list
                </Text>

                {loading ? (
                <Text style={{ color: textColor }}>Loading...</Text>
                ) : todosError ? (
                <Text style={{ color: textColor }}>{todosError}</Text>
                ) : listTodos && listTodos.length > 0 ? (
                listTodos.map((t) => (
                    <TodoView key={t.uuid} todo={t}/>
                ))
                ) : (
                <Text style={{ color: textColor }}>No todos in the List</Text>
                )}
            </View>

            {/* Comments  */}
            <View className="mt-6 flex-col gap-2">
                <Text
                style={{ color: textColor }}
                className="tracking-widest uppercase mb-2"
                >
                Comments of list
                </Text>

                {loading ? (
                <Text style={{ color: textColor }}>Loading...</Text>
                ) : commentsError ? (
                <Text style={{ color: textColor }}>{todosError}</Text>
                ) : comments && comments.length > 0 ? (
                comments.map((c, index) => (
                    <Comment key={index} comment={c}/>
                ))
                ) : (
                <Text style={{ color: textColor }}>No Comments.</Text>
                )}
            </View>

            {/* Floating button */}
            <TouchableOpacity
            onPress={() => setCommentModalVisible(true)}
            activeOpacity={0.8}
            style={{
                backgroundColor: tintAlt,
                position: "fixed",
                bottom: 24,
                right: 24,
            }}
            className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
            >
            <Text style={{ color: tint }} className="text-3xl font-bold">
                +
            </Text>
            </TouchableOpacity>

            {/* New comment modal */}
            <Modal
                visible={commentModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeCommentModal}
            >
                <Pressable
                    onPress={closeCommentModal}
                    className="flex-1 justify-center items-center px-6"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        className="w-full rounded-xl p-5"
                        style={{ backgroundColor: bg, borderWidth: 2, borderColor: tintAlt }}
                    >
                        <Text
                            className="text-lg font-bold mb-3"
                            style={{ color: textColor }}
                        >
                            New comment
                        </Text>

                        <TextInput
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Write your comment..."
                            placeholderTextColor={textColor + "99"}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="rounded-lg p-3 mb-3"
                            style={{
                                color: textColor,
                                borderWidth: 1,
                                borderColor: tintAlt,
                                minHeight: 100,
                            }}
                        />

                        {commentError && (
                            <Text className="mb-2" style={{ color: textColor }}>
                                {commentError}
                            </Text>
                        )}

                        <View className="flex-row gap-3 justify-end">
                            <TouchableOpacity
                                onPress={closeCommentModal}
                                className="rounded-xl py-3 px-4"
                                style={{ borderWidth: 1, borderColor: tintAlt }}
                                activeOpacity={0.8}
                                disabled={commentSubmitting}
                            >
                                <Text style={{ color: textColor }} className="font-semibold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={addComment}
                                className="rounded-xl py-3 px-4"
                                style={{ backgroundColor: tintAlt }}
                                activeOpacity={0.8}
                                disabled={commentSubmitting}
                            >
                                {commentSubmitting ? (
                                    <ActivityIndicator color={tint} />
                                ) : (
                                    <Text style={{ color: tint }} className="font-semibold">
                                        Post
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

        </ScrollView>
    );
};

export default ViewPublicList