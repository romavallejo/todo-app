import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from "@/constants/theme";
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
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const {setGlobalList} = useContext(DataContext);

    const router = useRouter();

    const goToEdit = () => {
        setGlobalList(list)
        router.replace(`/(tabs)/list/${list.uuid}/edit`);
    };

    const goToView = () => {
        setGlobalList(list)
        router.replace(`/(tabs)/list/${list.uuid}/view`);
    };

    return (
        <Pressable onPress={goToView} hitSlop={8}>
            <View
                className="flex-row items-center gap-3 w-full p-3 rounded-lg border-2"
                style={{ backgroundColor: bg , borderColor: tintAlt}}
            >

                {/* Info */}
                <View className="flex-1">
                    <Text
                        className="text-lg font-bold"
                        style={{
                            color: textColor,
                            opacity: 1,
                        }}
                        numberOfLines={1}
                    >
                        {list.title}
                    </Text>

                    <Text
                        style={{
                            color: textColor,
                            opacity: 1,
                        }}
                    >
                        {list.description}
                    </Text>
                </View>

                {/* Edit button */}
                <Pressable onPress={goToEdit} hitSlop={8}>
                    <IconSymbol name="pencil" size={22} color={textColor} />
                </Pressable>
            </View>
        </Pressable>
    );
};

export default ListCard;