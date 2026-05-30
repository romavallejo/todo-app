import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserName } from "@/services/user/getUserName";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type ListType = {
    uuid: string;
    title: string;
    description: string;
    owner_id: string;
    visibility: boolean;
    comments: null;
};

type ListProps = {
    list: ListType;
};

const ListCardView = ({ list }: ListProps) => {
    const colorScheme = useColorScheme();
    const C = Colors[colorScheme ?? 'light'];

    const router = useRouter();
    const { setGlobalList } = useContext(DataContext);

    const [userName, setUserName] = useState("");

    useEffect(() => {
        getUserName(list.owner_id)
            .then(setUserName)
            .catch(() => {});
    }, [list.owner_id]);

    const handlePress = () => {
        setGlobalList(list);
        router.navigate(`/list/${list.uuid}/public`);
    };

    return (
        <Pressable
            onPress={handlePress}
            hitSlop={4}
            style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
        >
            <View
                style={{
                    backgroundColor: C.surface,
                    borderRadius: Radius.lg,
                    padding: 16,
                    ...Shadow.card,
                    gap: 6,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 8,
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            fontWeight: "700",
                            color: C.text,
                        }}
                    >
                        {list.title}
                    </Text>

                    {userName ? (
                        <View
                            style={{
                                backgroundColor: C.tintSubtle,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                borderRadius: Radius.full,
                                flexShrink: 0,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 11,
                                    fontWeight: "600",
                                    color: C.tint,
                                    maxWidth: 100,
                                }}
                            >
                                {userName}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {list.description ? (
                    <Text
                        numberOfLines={2}
                        style={{
                            fontSize: 13,
                            color: C.textSecondary,
                            lineHeight: 18,
                        }}
                    >
                        {list.description}
                    </Text>
                ) : null}

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 4,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: C.tintSubtle,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: Radius.full,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "600",
                                color: C.tint,
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                            }}
                        >
                            Public
                        </Text>
                    </View>

                    <Text style={{ fontSize: 13, color: C.textSecondary }}>
                        View →
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ListCardView;