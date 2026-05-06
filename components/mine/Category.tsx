import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View } from "react-native";

export type CateogryProps = {
    name: string,
    color: string,
};

const Category = ({name, color}: CateogryProps) => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text;
    const bg = Colors[colorScheme ?? 'light'].background;

    return (
        <View 
            className="p-1 rounded-lg"
            style={{backgroundColor: color}}
        >
            <Text>{name}</Text>
        </View>
    );
};

export default Category;