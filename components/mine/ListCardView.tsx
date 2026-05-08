import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from "expo-router";
import { useContext } from "react";
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

const ListCardView = ({ list }: ListProps) => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const router = useRouter();
    const {setGlobalList} = useContext(DataContext);

    return (
        <Pressable onPress={() => {
                setGlobalList(list);
                router.navigate(`/list/${list.uuid}/public`);
            }} 
            hitSlop={8}
        >
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
                    >
                        {list.title}
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
                        color: textColor
                    }}
                >
                    {list.description}
                </Text>
            </View>
        </Pressable>
    );
};

export default ListCardView;