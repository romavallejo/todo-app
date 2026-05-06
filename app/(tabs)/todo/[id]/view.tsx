import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { DataContext } from "@/contexts/DataContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, ScrollView, View } from "react-native";

const ViewTodoScreen = () => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const tintAlt = Colors[colorScheme ?? 'light'].tintAlt;

    const {globalTodo} = useContext(DataContext);
    
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <ScrollView className="flex-col px-6 pt-6">
            <View 
                className="flex w-[24px] h-[24px] justify-center items-center border rounded-[12px]"
                style={{borderColor: tintAlt}}
            >
                <Pressable 
                    onPress={() => router.back()} 
                    hitSlop={8}
                >
                    <IconSymbol name="chevron.left" size={24} color={textColor} />
                </Pressable>
            </View>
            
        </ScrollView>
    );
};

export default ViewTodoScreen;