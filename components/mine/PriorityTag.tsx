import { Radius } from "@/constants/theme";
import { Text, View } from "react-native";

type PriorityTagProps = {
    priority: "LOW" | "MEDIUM" | "HIGH";
};

const PRIORITY_CONFIG = {
    LOW: {
        bg: "#DCFCE7",
        text: "#166534",
        dot: "#16A34A",
        label: "Low",
    },
    MEDIUM: {
        bg: "#FEF9C3",
        text: "#854D0E",
        dot: "#CA8A04",
        label: "Medium",
    },
    HIGH: {
        bg: "#FEE2E2",
        text: "#991B1B",
        dot: "#DC2626",
        label: "High",
    },
} as const;

const PriorityTag = ({ priority }: PriorityTagProps) => {
    const cfg = PRIORITY_CONFIG[priority];

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: cfg.bg,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: Radius.full,
                flexShrink: 0,
            }}
        >
            <View
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: Radius.full,
                    backgroundColor: cfg.dot,
                }}
            />
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: cfg.text,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                }}
            >
                {cfg.label}
            </Text>
        </View>
    );
};

export default PriorityTag;