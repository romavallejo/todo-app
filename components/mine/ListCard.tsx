import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Radius, Shadow } from "@/constants/theme";
import { DataContext } from '@/contexts/DataContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from "expo-router";
import { useContext } from 'react';
import { Pressable, Text, View } from "react-native";

type ListType = {
    uuid: string;
    title: string;
    description: string;
    ownerId: string;
    visibility: boolean;
    comments: null;
};

type ListProps = {
    list: ListType;
};

const ListCard = ({ list }: ListProps) => {
    const colorScheme = useColorScheme();
    const C = Colors[colorScheme ?? 'light'];

    const { setGlobalList } = useContext(DataContext);
    const router = useRouter();

    const goToEdit = () => {
        setGlobalList(list);
        router.navigate(`/(tabs)/list/${list.uuid}/edit`);
    };

    const goToView = () => {
        setGlobalList(list);
        router.navigate(`/(tabs)/list/${list.uuid}/view`);
    };

    return (
        <Pressable
            onPress={goToView}
            hitSlop={4}
            style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
        >
            <View
                style={{
                    backgroundColor: C.surface,
                    borderRadius: Radius.lg,
                    borderLeftWidth: 4,
                    borderLeftColor: C.tint,
                    paddingVertical: 14,
                    paddingRight: 14,
                    paddingLeft: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    ...Shadow.card,
                }}
            >
                <View style={{ flex: 1, gap: 3 }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: C.text,
                        }}
                    >
                        {list.title}
                    </Text>

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
                            alignSelf: "flex-start",
                            marginTop: 6,
                            backgroundColor: list.visibility ? C.tintSubtle : C.surfaceAlt,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: Radius.full,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "600",
                                color: list.visibility ? C.tint : C.textSecondary,
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                            }}
                        >
                            {list.visibility ? "Public" : "Private"}
                        </Text>
                    </View>
                </View>

                <Pressable
                    onPress={goToEdit}
                    hitSlop={8}
                    style={({ pressed }) => ({
                        width: 34,
                        height: 34,
                        borderRadius: Radius.full,
                        backgroundColor: pressed ? C.surfaceAlt : C.tintSubtle,
                        alignItems: "center",
                        justifyContent: "center",
                    })}
                >
                    <IconSymbol name="pencil" size={16} color={C.tint} />
                </Pressable>
            </View>
        </Pressable>
    );
};

export default ListCard;