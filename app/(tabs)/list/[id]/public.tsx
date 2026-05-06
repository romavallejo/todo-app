import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, View } from "react-native";


const ViewPublicList = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const {globalList} = useContext(DataContext);

    const router = useRouter();

    return (
        <ScrollView className="flex-col px-6 pt-6">
            <View 
                className="flex w-[24px] h-[24px] justify-center items-center border rounded-[12px]"
                style={{borderColor: tintAlt}}
            >
                <Pressable 
                    onPress={() => router.navigate("/(tabs)/search")} 
                    hitSlop={8}
                >
                    <IconSymbol name="chevron.left" size={24} color={textColor} />
                </Pressable>
            </View>
            
        </ScrollView>
    );
};

export default ViewPublicList