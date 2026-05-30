import { Radius } from "@/constants/theme";
import { Text, View } from "react-native";

export type CategoryProps = {
    name: string;
    color: string;
};

const contrastText = (hex: string): string => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? "#374151" : "#ffffff";
};

const Category = ({ name, color }: CategoryProps) => {
    const textColor = contrastText(color);

    return (
        <View
            style={{
                backgroundColor: color,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: Radius.full,
            }}
        >
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: textColor,
                    letterSpacing: 0.3,
                }}
            >
                {name}
            </Text>
        </View>
    );
};

export default Category;